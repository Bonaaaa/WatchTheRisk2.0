"use server";

import { assessCreditRisk, AssessCreditRiskInput } from "@/ai/flows/assess-credit-risk";

export async function handleAssessCreditRisk(input: AssessCreditRiskInput) {
    const validatedInput = {
        ...input,
        income: Number(input.income),
        creditScore: Number(input.creditScore),
        loanAmount: Number(input.loanAmount),
        loanDuration: Number(input.loanDuration),
        debtToIncomeRatio: Number(input.debtToIncomeRatio),
    };
    const result = await assessCreditRisk(validatedInput);
    return result;
}
