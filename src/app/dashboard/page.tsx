"use client";

import { useState } from 'react';
import { handleAssessCreditRisk, handleSaveCandidate } from './actions';
import RiskAssessmentForm from './components/risk-assessment-form';
import RiskAssessmentResults from './components/risk-assessment-results';
import type { AssessmentResult } from '@/lib/types';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { useToast } from "@/hooks/use-toast";
import type { AssessCreditRiskInput } from '@/ai/flows/assess-credit-risk';

type FullResult = {
  applicantData: AssessCreditRiskInput,
  assessmentResult: AssessmentResult,
}

export default function DashboardPage() {
  const [fullResult, setFullResult] = useState<FullResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const { toast } = useToast();

  const onAssess = async (data: AssessCreditRiskInput) => {
    setIsLoading(true);
    setFullResult(null);
    setIsSaved(false);
    try {
      const result = await handleAssessCreditRisk(data);
      setFullResult({
        applicantData: data,
        assessmentResult: { ...result, requestedLoanAmount: Number(data.loanAmount) },
      });
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to assess credit risk. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onSave = async () => {
    if (!fullResult) return;
    try {
      await handleSaveCandidate(fullResult.applicantData, fullResult.assessmentResult);
      setIsSaved(true);
      toast({
        title: "Candidate Saved",
        description: `${fullResult.applicantData.name} has been added to the candidates list.`,
      });
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save candidate. Please try again.",
      });
    }
  }

  return (
    <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-5">
      <Card className="lg:col-span-2 h-fit">
        <CardHeader>
          <CardTitle className="font-headline">New Assessment</CardTitle>
          <CardDescription>Enter applicant details to assess credit risk.</CardDescription>
        </CardHeader>
        <CardContent>
          <RiskAssessmentForm onAssess={onAssess} isLoading={isLoading} />
        </CardContent>
      </Card>
      <div className="lg:col-span-3">
        <RiskAssessmentResults 
            result={fullResult?.assessmentResult ?? null} 
            isLoading={isLoading} 
            isSaved={isSaved}
            onSave={onSave}
        />
      </div>
    </div>
  );
}