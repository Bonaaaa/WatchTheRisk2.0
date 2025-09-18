"use client";

import { useState } from 'react';
import { handleAssessCreditRisk } from './actions';
import RiskAssessmentForm from './components/risk-assessment-form';
import RiskAssessmentResults from './components/risk-assessment-results';
import type { AssessmentResult } from '@/lib/types';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { useToast } from "@/hooks/use-toast";

export default function DashboardPage() {
  const [assessmentResult, setAssessmentResult] = useState<AssessmentResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const onAssess = async (data: any) => {
    setIsLoading(true);
    setAssessmentResult(null);
    try {
      const result = await handleAssessCreditRisk(data);
      setAssessmentResult({ ...result, requestedLoanAmount: Number(data.loanAmount) });
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
        <RiskAssessmentResults result={assessmentResult} isLoading={isLoading} />
      </div>
    </div>
  );
}
