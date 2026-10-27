export interface OutfitSuggestionResult {
  title: string;
  aesthetic: string;
  occasion: string;
  stylistRationale: string;
  recommendedProductIds: string[];
  stylingTips: string[];
  colorHarmony: string;
}

export interface FitSuggestionResult {
  recommendedSize: string;
  confidenceScore: number;
  fitAnalysis: string;
  drapeDescription: string;
  alternativeSizeNote: string;
}

export interface TrendSuggestionResult {
  headline: string;
  trendingAesthetics: string[];
  vibeDescription: string;
  featuredProductIds: string[];
  keyStylingRules: string[];
}

export interface SmartSearchResult {
  interpretation: string;
  matchedProductIds: string[];
  stylistNote: string;
  suggestedTags: string[];
}
