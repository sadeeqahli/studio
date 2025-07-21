
'use server';

import { pitchRecommendation, type PitchRecommendationInput, type PitchRecommendationOutput } from '@/ai/flows/pitch-recommendation';
import { footballNews, type FootballNewsInput, type FootballNewsOutput } from '@/ai/flows/football-news-flow';

export async function getPitchRecommendation(
  input: PitchRecommendationInput
): Promise<{ data?: PitchRecommendationOutput; error?: string }> {
  try {
    const recommendation = await pitchRecommendation(input);
    // In a real app, you might want to find this pitch in your DB
    // and return its full details. For now, we return the AI output directly.
    return { data: recommendation };
  } catch (error) {
    console.error('Error getting pitch recommendation:', error);
    // You could throw a more specific error here
    return { error: 'Failed to get recommendation. Please try again.' };
  }
}


export async function getFootballNews(
    query: string
  ): Promise<{ data?: FootballNewsOutput; error?: string }> {
    try {
      const input: FootballNewsInput = { query };
      const news = await footballNews(input);
      return { data: news };
    } catch (error) {
      console.error('Error getting football news:', error);
      return { error: 'Failed to get news from the AI assistant. Please try again.' };
    }
  }
