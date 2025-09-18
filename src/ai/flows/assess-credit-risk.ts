// This file is machine-generated - edit at your own risk!

'use server';

/**
 * @fileOverview Credit risk assessment AI agent.
 *
 * - assessCreditRisk - A function that handles the credit risk assessment process.
 * - AssessCreditRiskInput - The input type for the assessCreditRisk function.
 * - AssessCreditRiskOutput - The return type for the assessCreditRisk function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AssessCreditRiskInputSchema = z.object({
  income: z
    .number()
    .describe('Annual income of the loan applicant (in USD).'),
  creditScore: z
    .number()
    .describe('Credit score of the applicant (e.g., 680).'),
  loanAmount: z
    .number()
    .describe('The amount of loan requested (in USD).'),
  loanDuration: z
    .number()
    .describe('Loan duration in months.'),
  employmentHistory: z
    .string()
    .describe(
      'A brief summary of the applicant employment history including job titles, duration at each job and industry.'
    ),
  debtToIncomeRatio: z
    .number()
    .describe(
      'The applicants total monthly debt payments divided by their gross monthly income, expressed as a decimal.'
    ),
});
export type AssessCreditRiskInput = z.infer<typeof AssessCreditRiskInputSchema>;

const AssessCreditRiskOutputSchema = z.object({
  riskAssessment: z
    .string()
    .describe(
      'Overall risk assessment of the loan applicant (e.g., Low, Medium, High).'
    ),
  riskFactors: z
    .string()
    .describe(
      'Key factors contributing to the risk assessment with justification.'
    ),
  recommendedInterestRate: z
    .number()
    .describe(
      'Recommended interest rate for the loan, expressed as a percentage.'
    ),
  approvedLoanAmount: z
    .number()
    .describe(
      'The approved loan amount, adjusted for risk (in USD). If the loan is too risky, set to zero.'
    ),
});
export type AssessCreditRiskOutput = z.infer<typeof AssessCreditRiskOutputSchema>;

export async function assessCreditRisk(input: AssessCreditRiskInput): Promise<AssessCreditRiskOutput> {
  return assessCreditRiskFlow(input);
}

const assessCreditRiskPrompt = ai.definePrompt({
  name: 'assessCreditRiskPrompt',
  input: {schema: AssessCreditRiskInputSchema},
  output: {schema: AssessCreditRiskOutputSchema},
  prompt: `You are an expert credit risk analyst. Evaluate the credit risk of a loan applicant based on the following information and suggest loan terms.

Applicant Data:
Income: {{income}}
Credit Score: {{creditScore}}
Loan Amount Requested: {{loanAmount}}
Loan Duration: {{loanDuration}}
Employment History: {{employmentHistory}}
Debt-to-Income Ratio: {{debtToIncomeRatio}}

Instructions:
1.  Assess the overall risk (Low, Medium, High) and provide a justification based on the data.
2.  Recommend an appropriate interest rate based on the risk assessment.
3.  Determine the approved loan amount, adjusting for risk. If the applicant is too risky, set the loan amount to zero.

Output:
Risk Assessment: (Low, Medium, High)
Risk Factors: (Key factors and justification)
Recommended Interest Rate: (Percentage)
Approved Loan Amount: (in USD, or 0 if not approved)`,
});

const assessCreditRiskFlow = ai.defineFlow(
  {
    name: 'assessCreditRiskFlow',
    inputSchema: AssessCreditRiskInputSchema,
    outputSchema: AssessCreditRiskOutputSchema,
  },
  async input => {
    const {output} = await assessCreditRiskPrompt(input);
    return output!;
  }
);
