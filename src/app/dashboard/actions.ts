"use server";

import { assessCreditRisk, AssessCreditRiskInput, AssessCreditRiskOutput } from "@/ai/flows/assess-credit-risk";
import { addCandidate } from "@/app/candidates/service";
import { revalidatePath } from "next/cache";

// This action ONLY assesses risk and does not save the candidate.
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

// This new action is dedicated to saving the candidate.
export async function handleSaveCandidate(applicantData: AssessCreditRiskInput, assessmentResult: AssessCreditRiskOutput) {
    addCandidate({
        name: applicantData.name,
        email: applicantData.email,
        creditScore: Number(applicantData.creditScore),
        loanAmount: Number(applicantData.loanAmount),
        risk: assessmentResult.riskAssessment as "Low" | "Medium" | "High",
        status: assessmentResult.approvedLoanAmount > 0 ? "Approved" : "Rejected",
    });

    // Revalidate the candidates page to show the new entry
    revalidatePath('/candidates');
}


export async function handleBatchAssess(candidates: AssessCreditRiskInput[]) {
    // We don't want to revalidate for every single record in the batch.
    // So we'll call a simpler version of the assess logic.
    const assessAndAdd = async (candidate: AssessCreditRiskInput) => {
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
    };

    // Process all candidates
    await Promise.all(candidates.map(c => assessAndAdd(c)));

    // Revalidate once after the entire batch is processed
    revalidatePath('/candidates');
}