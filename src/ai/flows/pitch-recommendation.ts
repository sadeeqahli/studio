// src/ai/flows/pitch-recommendation.ts
'use server';
/**
 * @fileOverview An AI agent that provides personalized football pitch recommendations based on user preferences.
 *
 * - pitchRecommendation - A function that returns a personalized pitch recommendation.
 * - PitchRecommendationInput - The input type for the pitchRecommendation function.
 * - PitchRecommendationOutput - The return type for the pitchRecommendation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PitchRecommendationInputSchema = z.object({
  location: z.string().describe('The preferred location for the football pitch.'),
  time: z.string().describe('The desired time slot for booking the pitch.'),
  budget: z.number().describe('The budget for booking the football pitch in Naira.'),
  amenities: z.string().describe('Preferred amenities such as floodlights, parking, etc.'),
});
export type PitchRecommendationInput = z.infer<typeof PitchRecommendationInputSchema>;

const PitchRecommendationOutputSchema = z.object({
  pitchName: z.string().describe('The name of the recommended football pitch.'),
  address: z.string().describe('The address of the recommended football pitch.'),
  price: z.number().describe('The price of booking the pitch for the specified time in Naira.'),
  amenities: z.string().describe('The available amenities at the pitch.'),
  contact: z.string().describe('The contact information for booking the pitch.'),
  mapUrl: z.string().describe('Google Maps URL for the pitch location.'),
});

export type PitchRecommendationOutput = z.infer<typeof PitchRecommendationOutputSchema>;

export async function pitchRecommendation(input: PitchRecommendationInput): Promise<PitchRecommendationOutput> {
  return pitchRecommendationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'pitchRecommendationPrompt',
  input: {schema: PitchRecommendationInputSchema},
  output: {schema: PitchRecommendationOutputSchema},
  prompt: `You are an AI assistant that recommends football pitches based on user preferences.

  Consider the following user preferences to provide the best recommendation:

  Location: {{{location}}}
  Time: {{{time}}}
  Budget: {{{budget}}} NGN
  Amenities: {{{amenities}}}

  Return a JSON object with the details of the recommended pitch including pitchName, address, price, amenities, contact and mapUrl.
  Ensure the price is in Naira (NGN).
  Always respond in JSON format.`,
});

const pitchRecommendationFlow = ai.defineFlow(
  {
    name: 'pitchRecommendationFlow',
    inputSchema: PitchRecommendationInputSchema,
    outputSchema: PitchRecommendationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
