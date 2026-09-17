import type { RecommendationChatModel } from '@/models';
import type { RecommendationContextItem } from '@/recommendations/dtos/llm';

export interface PreparedChatForQuestion {
  savedChat: RecommendationChatModel;
  contexts: RecommendationContextItem[];
}
