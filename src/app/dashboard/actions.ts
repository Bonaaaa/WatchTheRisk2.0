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
    try {
        const result = await addCandidate({
            name: applicantData.name,
            email: applicantData.email,
            creditScore: Number(applicantData.creditScore),
            loanAmount: Number(applicantData.loanAmount),
            risk: assessmentResult.riskAssessment as "Low" | "Medium" | "High",
            status: assessmentResult.approvedLoanAmount > 0 ? "Approved" : "Rejected",
            riskFactors: assessmentResult.riskFactors,
        });
        revalidatePath('/candidates');
        return { success: true, candidate: result };
    } catch (error) {
        console.error("Server action error:", error);
    
        // Return the actual error message for debugging
        const message = error instanceof Error ? error.message : "Unknown error occurred";
        return { 
          success: false, 
          error: message,
          details: error instanceof Error ? error.stack : String(error)
        };
    }
}