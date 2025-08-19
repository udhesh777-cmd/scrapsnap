'use server';

/**
 * @fileOverview Scrap value estimation flow.
 *
 * - estimateScrapValue - Estimates the value of scrap materials from an image and description.
 * - EstimateScrapValueInput - The input type for the estimateScrapValue function.
 * - EstimateScrapValueOutput - The return type for the estimateScrapValue function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const EstimateScrapValueInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      'A photo of the scrap materials, as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.' // Corrected typo here
    ),
  description: z.string().describe('A description of the scrap materials, which may include type and weight.'),
});
export type EstimateScrapValueInput = z.infer<typeof EstimateScrapValueInputSchema>;

const EstimateScrapValueOutputSchema = z.object({
  category: z.string().describe('The category of the scrap materials (e.g., metal, plastic, paper).'),
  estimatedValue: z.number().describe('The estimated value of the scrap materials in USD.'),
  confidence: z.number().describe('A confidence score (0-1) for the estimation.'),
});
export type EstimateScrapValueOutput = z.infer<typeof EstimateScrapValueOutputSchema>;

export async function estimateScrapValue(input: EstimateScrapValueInput): Promise<EstimateScrapValueOutput> {
  return estimateScrapValueFlow(input);
}

const estimateScrapValuePrompt = ai.definePrompt({
  name: 'estimateScrapValuePrompt',
  input: {schema: EstimateScrapValueInputSchema},
  output: {schema: EstimateScrapValueOutputSchema},
  prompt: `You are an AI assistant specialized in estimating the value of scrap materials.

  Analyze the provided image and description to determine the category, estimated value, and confidence score. The description may contain the type of scrap and its weight.

  Description: {{{description}}}
  Photo: {{media url=photoDataUri}}
  
  Return the category, estimated value (in USD), and confidence score in JSON format.
  Be very concise in the returned values. Don't include extra words.`,
});

const estimateScrapValueFlow = ai.defineFlow(
  {
    name: 'estimateScrapValueFlow',
    inputSchema: EstimateScrapValueInputSchema,
    outputSchema: EstimateScrapValueOutputSchema,
  },
  async input => {
    const {output} = await estimateScrapValuePrompt(input);
    return output!;
  }
);
