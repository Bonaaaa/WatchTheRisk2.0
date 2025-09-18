# WatchTheRisk Technical Design Document

## 1. Overview

This document outlines the technical architecture and logic of the **WatchTheRisk** application. The primary function of this application is to provide loan officers with an AI-powered tool to assess the credit risk of a loan applicant and determine an appropriate approved loan amount and interest rate.

The system takes applicant financial data as input, processes it through a generative AI model, and returns a structured risk assessment, including a recommended loan amount.

## 2. System Architecture

The application is built on a modern web stack designed for performance, scalability, and rapid development.

- **Frontend**: [Next.js](https://nextjs.org/) with [React](https://react.dev/) and [TypeScript](https://www.typescriptlang.org/). It uses Server Components and Server Actions for a seamless and performant user experience.
- **UI Components**: [ShadCN UI](https://ui.shadcn.com/), a collection of accessible and reusable components built on Radix UI and Tailwind CSS.
- **Styling**: [Tailwind CSS](https://tailwindcss.com/), a utility-first CSS framework for rapid UI development.
- **AI/Backend**: [Genkit](https://genkit.dev/), a Google framework for building production-ready AI-powered features, is used to define and manage the interaction with the Large Language Model (LLM).
- **Hosting**: Deployed on [Firebase App Hosting](https://firebase.google.com/docs/app-hosting), providing a secure and scalable serverless environment.

## 3. Loan Amount Determination Flow

The core functionality of determining a loanee's approved loan amount follows a clear, multi-step process that begins with user input and ends with an AI-generated recommendation.

![Data Flow Diagram](https://storage.googleapis.com/stedi-assets/misc/watchtherisk-flow.png)

### Step 1: Data Input (`RiskAssessmentForm`)

The process starts on the **Dashboard** page, where the loan officer enters the applicant's data into the `RiskAssessmentForm`.

- **File**: `src/app/dashboard/components/risk-assessment-form.tsx`
- **Inputs Collected**:
  - `income`: Annual income (USD)
  - `creditScore`: Applicant's credit score
  - `loanAmount`: The originally requested loan amount (USD)
  - `loanDuration`: The loan term in months
  - `employmentHistory`: A summary of the applicant's job history
  - `debtToIncomeRatio`: The applicant's debt-to-income ratio as a decimal

### Step 2: Form Submission & Server Action

Upon clicking the "Assess Risk" button, the form data is submitted.

- The `onAssess` handler in `src/app/dashboard/page.tsx` is triggered.
- It calls the `handleAssessCreditRisk` Next.js Server Action, passing the form data.
- **File**: `src/app/dashboard/actions.ts`

```typescript
"use server";

import { assessCreditRisk, AssessCreditRiskInput } from "@/ai/flows/assess-credit-risk";

export async function handleAssessCreditRisk(input: AssessCreditRiskInput) {
    // Input is validated and converted to the correct numeric types
    const validatedInput = { ... };
    const result = await assessCreditRisk(validatedInput);
    return result;
}
```

### Step 3: AI-Powered Assessment (`assessCreditRisk` Flow)

The server action invokes the core AI logic, which is encapsulated in a Genkit flow.

- **File**: `src/ai/flows/assess-credit-risk.ts`

This file defines the entire AI-powered assessment process:

1.  **Input & Output Schemas**: It uses `zod` to define strict schemas for the input data (`AssessCreditRiskInputSchema`) and the expected AI output (`AssessCreditRiskOutputSchema`). This ensures data consistency and type safety.

2.  **AI Prompt (`assessCreditRiskPrompt`)**: A Genkit prompt is defined to instruct the LLM. The prompt template is the crucial piece that guides the AI's decision-making process.

    - **Role**: The prompt assigns the AI the role of an "expert credit risk analyst."
    - **Instructions**: It directs the AI to evaluate the applicant's data and perform three key tasks:
      1.  Assess the overall risk (Low, Medium, High) with justification.
      2.  Recommend an appropriate interest rate.
      3.  **Determine the approved loan amount, adjusting for risk. If the applicant is deemed too risky, the AI is instructed to set this amount to zero.**

3.  **Genkit Flow (`assessCreditRiskFlow`)**: The flow orchestrates the process. It receives the validated applicant data, calls the LLM with the defined prompt, and receives the structured output. Because the prompt specifies an output schema, Genkit automatically parses the LLM's response into a clean, typed `AssessCreditRiskOutput` object.

### Step 4: Displaying the Results

The result from the Genkit flow is returned to the frontend.

- The `DashboardPage` component (`src/app/dashboard/page.tsx`) receives the `AssessmentResult`.
- This result, which includes the AI-determined `approvedLoanAmount`, is passed to the `RiskAssessmentResults` component.
- **File**: `src/app/dashboard/components/risk-assessment-results.tsx`
- The `RiskAssessmentResults` component then displays the approved amount, risk level, interest rate, and a comparative chart showing the requested vs. approved loan amounts.

## 4. Conclusion

The "WatchTheRisk" application determines a loanee's approved loan amount by delegating the complex decision-making process to a Large Language Model. By providing the AI with a clear role, structured data, and explicit instructions through a Genkit prompt, the application can transform raw financial data into an actionable credit risk assessment. The use of schemas and server actions ensures that this process is both reliable and secure.
