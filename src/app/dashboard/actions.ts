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

    // Revalidate the candidates page to show the new entry
    revalidatePath('/candidates');

    return result;
}


export async function handleBatchAssess(candidates: AssessCreditRiskInput[]) {
    for (const candidate of candidates) {
        // We don't need to revalidate inside the loop for each one
        // So we call a simpler version of the assess logic
        const validatedInput = {
            ...candidate,
            income: Number(candidate.income),
            creditScore: Number(candidate.creditScore),
            loanAmount: Number(candidate.loanAmount),
            loanDuration: Number(candidate.loanDuration),
            debtToIncomeRatio: Number(candidate.debtToIncomeRatio),
        };
        const result = await assessCreditRisk(validatedInput);
        addCandidate({
          name: validatedInput.name,
          email: validatedInput.email,
          creditScore: validatedInput.creditScore,
          loanAmount: validatedInput.loanAmount,
          risk: result.riskAssessment as "Low" | "Medium" | "High",
          status: result.approvedLoanAmount > 0 ? "Approved" : "Rejected",
        });
    }
    // Revalidate once after the batch is processed
    revalidatePath('/candidates');
}