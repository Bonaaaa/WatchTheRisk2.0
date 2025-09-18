'use server';
/**
 * @fileOverview Estimates a loan limit and dynamically adjusts the loan rate based on assessed risk factors using AI.
 *
 * - estimateLoanLimitAndRate - A function that handles the loan limit and rate estimation process.
 * - EstimateLoanLimitAndRateInput - The input type for the estimateLoanLimitAndRate function.
 * - EstimateLoanLimitAndRateOutput - The return type for the estimateLoanLimitAndRate function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const EstimateLoanLimitAndRateInputSchema = z.object({
  income: z.number().describe('Annual income of the applicant.'),
  creditScore: z.number().describe('Credit score of the applicant (e.g., 300-850).'),
  debtToIncomeRatio: z
    .number()
    .describe('Debt to income ratio of the applicant (e.g., 0.0 - 1.0).'),
  loanPurpose: z.string().describe('The purpose of the loan.'),
  employmentHistory: z.string().describe('Employment history of the applicant.'),
});
export type EstimateLoanLimitAndRateInput = z.infer<
  typeof EstimateLoanLimitAndRateInputSchema
>;

const EstimateLoanLimitAndRateOutputSchema = z.object({
  loanLimit: z
    .number()
    .describe('The estimated maximum loan limit that can be offered.'),
  interestRate: z.number().describe('The interest rate for the loan.'),
  riskFactors: z.string().describe('Key risk factors affecting the loan terms.'),
});
export type EstimateLoanLimitAndRateOutput = z.infer<
  typeof EstimateLoanLimitAndRateOutputSchema
>;

export async function estimateLoanLimitAndRate(
  input: EstimateLoanLimitAndRateInput
): Promise<EstimateLoanLimitAndRateOutput> {
  return estimateLoanLimitAndRateFlow(input);
}

const prompt = ai.definePrompt({
  name: 'estimateLoanLimitAndRatePrompt',
  input: {schema: EstimateLoanLimitAndRateInputSchema},
  output: {schema: EstimateLoanLimitAndRateOutputSchema},
  prompt: `You are a loan expert specializing in estimating loan limits and rates.

  Based on the applicant's financial information, you will estimate a loan limit and an appropriate interest rate. Provide a summary of the key risk factors affecting the loan terms.

  Income: {{{income}}}
  Credit Score: {{{creditScore}}}
  Debt to Income Ratio: {{{debtToIncomeRatio}}}
  Loan Purpose: {{{loanPurpose}}}
  Employment History: {{{employmentHistory}}}

  Consider these factors and provide the loanLimit, interestRate, and riskFactors in the output. The interest rate should be a number between 0 and 1.
  `,
});

const estimateLoanLimitAndRateFlow = ai.defineFlow(
  {
    name: 'estimateLoanLimitAndRateFlow',
    inputSchema: EstimateLoanLimitAndRateInputSchema,
    outputSchema: EstimateLoanLimitAndRateOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
