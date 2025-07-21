
'use server';
/**
 * @fileOverview An AI agent that provides football news and live scores.
 *
 * - footballNews - A function that returns a summary of football news or scores based on a query.
 * - FootballNewsInput - The input type for the footballNews function.
 * - FootballNewsOutput - The return type for the footballNews function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const FootballNewsInputSchema = z.object({
  query: z.string().describe('The user\'s question about football news, scores, or transfers.'),
});
export type FootballNewsInput = z.infer<typeof FootballNewsInputSchema>;

const FootballNewsOutputSchema = z.object({
  newsSummary: z.string().describe('A concise summary of the football news or scores requested by the user.'),
});

export type FootballNewsOutput = z.infer<typeof FootballNewsOutputSchema>;

export async function footballNews(input: FootballNewsInput): Promise<FootballNewsOutput> {
  return footballNewsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'footballNewsPrompt',
  input: {schema: FootballNewsInputSchema},
  output: {schema: FootballNewsOutputSchema},
  prompt: `You are an expert football analyst and sports journalist AI. Your name is "NaijaScores AI".

  Your task is to provide concise, accurate, and up-to-date information about football based on the user's query. The query is: {{{query}}}

  You should be able to answer questions about:
  - Recent match results
  - Live scores (if you have access to real-time data, state that it's the most current information you have)
  - Upcoming fixtures
  - Player transfer news
  - League standings
  - General football news

  Respond in a clear, easy-to-read format. Use Markdown for formatting if it helps readability (e.g., bullet points for scores).
  
  Always start your response by introducing yourself, for example: "This is NaijaScores AI with the latest updates..."
  
  If the query is ambiguous or you cannot find the information, politely state that and ask for a more specific question.
  
  Return a JSON object containing the news summary.`,
});

const footballNewsFlow = ai.defineFlow(
  {
    name: 'footballNewsFlow',
    inputSchema: FootballNewsInputSchema,
    outputSchema: FootballNewsOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
