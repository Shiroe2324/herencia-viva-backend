import { Inject, Injectable } from '@nestjs/common';

import type { LLMConfig } from '@/configs';
import { llmConfig } from '@/configs';
import { LLMService } from '@/llm/llm.service';
import type { RecommendationContextItem } from '@/recommendations/dtos/llm';

@Injectable()
export class RecommendationsPromptService {
  constructor(
    private readonly llmService: LLMService,
    @Inject(llmConfig.KEY) private readonly llmCfg: LLMConfig,
  ) {}

  public buildSystemPrompt(contexts: RecommendationContextItem[]): string {
    const contextFormat = this.llmCfg.contextFormat;
    const systemPromptTemplate = this.llmCfg.systemPrompt;

    const mappedContext = contexts.map((item, index) =>
      contextFormat
        .replace('{{INDEX}}', (index + 1).toString())
        .replace('{{QUESTION}}', item.question ?? '')
        .replace('{{ANSWER}}', item.answer ?? '')
        .replace('{{DOCUMENT}}', item.document ?? ''),
    );

    const contextText = contexts.length > 0 ? mappedContext.join('\n\n') : this.llmCfg.emptyContextMessage;
    return systemPromptTemplate.replace('{{CONTEXT}}', contextText);
  }

  public async generateTitle(question: string): Promise<string> {
    try {
      const prompt = this.llmCfg.titlePrompt.replace('{{CONTENT}}', question);
      const title = await this.llmService.generateText(prompt);
      return title.trim().replace(/["']/g, '');
    } catch (_error) {
      return question.trim().replace(/\s+/g, ' ').slice(0, 120);
    }
  }
}
