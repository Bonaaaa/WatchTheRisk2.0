import { type AssessCreditRiskOutput } from '@/ai/flows/assess-credit-risk';

export type AssessmentResult = AssessCreditRiskOutput & {
  requestedLoanAmount: number;
};
