import { type AssessCreditRiskOutput, type AssessCreditRiskInput } from '@/ai/flows/assess-credit-risk';

export type AssessmentResult = AssessCreditRiskOutput & {
  requestedLoanAmount: number;
};

export type FullResult = {
    applicantData: AssessCreditRiskInput;
    assessmentResult: AssessmentResult;
}
