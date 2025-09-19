"use server";

import { assessCreditRisk, AssessCreditRiskInput } from "@/ai/flows/assess-credit-risk";
import { addCandidate } from "@/app/candidates/service";
import { revalidatePath } from "next/cache";

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

    // Add the assessed candidate to our "database"
    addCandidate({
      name: validatedInput.name,
      email: validatedInput.email,
      creditScore: validatedInput.creditScore,
      loanAmount: validatedInput.loanAmount,
      risk: result.riskAssessment as "Low" | "Medium" | "High",
      status: result.approvedLoanAmount > 0 ? "Approved" : "Rejected",
    });

    return result;
}


export async function handleBatchAssess(candidates: AssessCreditRiskInput[]) {
    for (const candidate of candidates) {
        await handleAssessCreditRisk(candidate);
    }
    revalidatePath('/candidates');
}
