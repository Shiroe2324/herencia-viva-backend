import { HttpException, Inject, Injectable, NotFoundException, ServiceUnavailableException } from '@nestjs/common';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { defer, Observable, Subscriber } from 'rxjs';

import type { LLMConfig } from '@/configs';
import { llmConfig } from '@/configs';
import { RECOMMENDATIONS_ERROR_CODES } from '@/constants';
import { AskRecommendationStreamEvents, LLMChatRole } from '@/enums';
import { LLMService } from '@/llm/llm.service';
import { RecommendationChatMessageModel, RecommendationChatModel } from '@/models';
import { RecommendationsContextRetrievalService } from '@/modules/recommendations/services/recommendations-context-retrieval.service';
import type {
  AskRecommendationRequest,
  AskRecommendationResponse,
  AskRecommendationStreamEventType,
  RecommendationContextItem,
  RecommendationMessageItem,
} from '@/recommendations/dtos/llm';
import { RecommendationsChatCacheService } from '@/recommendations/services/recommendations-chat-cache.service';
import { RecommendationsPromptService } from '@/recommendations/services/recommendations-prompt.service';
import { RecommendationChatMessageRepositoryService } from '@/repositories/services/recommendation-chat-message.service';
import { RecommendationChatRepositoryService } from '@/repositories/services/recommendation-chat.service';
import type { LLMChatHistoryItem, PreparedChatForQuestion } from '@/types';

@Injectable()
export class RecommendationsLLMService {
  constructor(
    private readonly recommendationChatRepository: RecommendationChatRepositoryService,
    private readonly recommendationChatMessageRepository: RecommendationChatMessageRepositoryService,
    private readonly llmService: LLMService,
    private readonly chatCacheService: RecommendationsChatCacheService,
    private readonly contextRetrievalService: RecommendationsContextRetrievalService,
    private readonly promptService: RecommendationsPromptService,
    @Inject(llmConfig.KEY) private readonly llmCfg: LLMConfig,
    @InjectPinoLogger(RecommendationsLLMService.name) private readonly logger: PinoLogger,
  ) {}

  public async askChat(userId: string, data: AskRecommendationRequest): Promise<AskRecommendationResponse> {
    const { question, chatId } = data;

    try {
      const { savedChat, contexts } = await this.prepareChatForQuestion(userId, data);
      const llmChat = this.createChat(contexts, savedChat.messages);
      const answer = (await llmChat.sendMessage(question)) || this.llmCfg.fallbackMessage;

      const finalChat = await this.appendModelAnswer(userId, savedChat, answer);

      return { chatId: finalChat.id, answer, contexts, messages: this.mapChatMessages(finalChat.messages) };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      this.logger.error({ error, question, userId, chatId }, 'Failed to generate AI recommendation chat');
      throw new ServiceUnavailableException(RECOMMENDATIONS_ERROR_CODES.AI_GENERATION_FAILED);
    }
  }

  public askChatStream(userId: string, data: AskRecommendationRequest): Observable<AskRecommendationStreamEventType> {
    const observable$ = new Observable<AskRecommendationStreamEventType>((subscriber) => {
      this.performAskChatStream(userId, data, subscriber).catch((error) => {
        this.logger.error({ error, userId, chatId: data.chatId }, 'Unhandled error in recommendation chat stream');
        subscriber.next({ type: AskRecommendationStreamEvents.ERROR, error: String(error) });
        subscriber.complete();
      });
    });
    return defer(() => observable$);
  }

  private async performAskChatStream(userId: string, data: AskRecommendationRequest, subscriber$: Subscriber<AskRecommendationStreamEventType>) {
    const { question } = data;

    try {
      const { savedChat, contexts } = await this.prepareChatForQuestion(userId, data);

      subscriber$.next({ type: AskRecommendationStreamEvents.METADATA, chatId: savedChat.id, question, context: contexts });

      const aiChat = this.createChat(contexts, savedChat.messages);

      let answer = '';
      for await (const text of aiChat.sendMessageStream(question)) {
        answer += text;
        subscriber$.next({ type: AskRecommendationStreamEvents.CONTENT, chunk: text });
      }

      if (!answer) answer = this.llmCfg.fallbackMessage;

      await this.appendModelAnswer(userId, savedChat, answer);

      subscriber$.next({ type: AskRecommendationStreamEvents.DONE, chatId: savedChat.id });
      subscriber$.complete();
    } catch (error) {
      this.logger.error({ error, question: data.question, userId, chatId: data.chatId }, 'Failed to generate AI recommendation chat');
      subscriber$.next({ type: AskRecommendationStreamEvents.ERROR, error: String(error) });
      subscriber$.complete();
    }
  }

  private async prepareChatForQuestion(userId: string, data: AskRecommendationRequest): Promise<PreparedChatForQuestion> {
    const { question, limit, chatId } = data;
    let chat = await this.resolveChat(userId, chatId);

    if (!chat.title) {
      chat.title = await this.promptService.generateTitle(question);
      chat = await this.recommendationChatRepository.save(chat);
    }

    const contexts = await this.contextRetrievalService.retrieve(question, limit);

    const userMessage = await this.recommendationChatMessageRepository.createForChat(chat.id, LLMChatRole.USER, question);
    const chatWithUserMessage = this.appendMessage(chat, userMessage);
    await this.chatCacheService.set(userId, chatWithUserMessage);

    return { savedChat: chatWithUserMessage, contexts };
  }

  private createChat(contexts: RecommendationContextItem[], messages: RecommendationChatMessageModel[]) {
    const systemPrompt = this.promptService.buildSystemPrompt(contexts);
    const chatHistory = this.buildChatHistory(this.getRecentMessages(messages));
    return this.llmService.createChat(systemPrompt, chatHistory, { maxOutputTokens: this.llmCfg.maxOutputTokens });
  }

  private async appendModelAnswer(userId: string, chat: RecommendationChatModel, answer: string): Promise<RecommendationChatModel> {
    const modelMessage = await this.recommendationChatMessageRepository.createForChat(chat.id, LLMChatRole.ASSISTANT, answer);
    const chatWithAnswer = this.appendMessage(chat, modelMessage);

    await this.chatCacheService.set(userId, chatWithAnswer);

    return chatWithAnswer;
  }

  private async resolveChat(userId: string, chatId?: string): Promise<RecommendationChatModel> {
    if (!chatId) return this.recommendationChatRepository.createForUser(userId);

    const cachedChat = await this.chatCacheService.get(userId, chatId);
    if (cachedChat) return cachedChat;

    const chat = await this.recommendationChatRepository.findOneByIdAndUser(chatId, userId);
    if (!chat) throw new NotFoundException(RECOMMENDATIONS_ERROR_CODES.CHAT_NOT_FOUND);
    await this.chatCacheService.set(userId, chat);

    return chat;
  }

  private buildChatHistory(messages: RecommendationChatMessageModel[]): LLMChatHistoryItem[] {
    return messages
      .filter((msg) => msg.role === LLMChatRole.USER || msg.role === LLMChatRole.ASSISTANT)
      .map((msg) => ({ role: msg.role, content: msg.content }));
  }

  private getRecentMessages(messages: RecommendationChatMessageModel[] | null | undefined): RecommendationChatMessageModel[] {
    const limit = this.llmCfg.recentMessagesLimit ?? 20;
    return (messages ?? []).slice(-limit);
  }

  private mapChatMessages(messages: RecommendationChatMessageModel[]): RecommendationMessageItem[] {
    return messages.map((message) => ({ role: message.role, content: message.content, createdAt: message.createdAt.toISOString() }));
  }

  private appendMessage(chat: RecommendationChatModel, message: RecommendationChatMessageModel): RecommendationChatModel {
    const currentMessages = (chat.messages ?? []) as RecommendationChatMessageModel[];
    const nextMessages = [...currentMessages, message].sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
    return new RecommendationChatModel({ ...chat, messages: nextMessages });
  }
}
