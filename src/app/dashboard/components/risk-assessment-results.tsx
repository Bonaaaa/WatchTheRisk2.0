import type { AssessmentResult } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import ResultsChart from './results-chart';

type RiskAssessmentResultsProps = {
  result: AssessmentResult | null;
  isLoading: boolean;
};

function getRiskBadgeVariant(risk: string) : "default" | "secondary" | "destructive" | "outline" {
  switch (risk.toLowerCase()) {
    case 'low': return 'default';
    case 'medium': return 'secondary';
    case 'high': return 'destructive';
    default: return 'outline';
  }
}

export default function RiskAssessmentResults({ result, isLoading }: RiskAssessmentResultsProps) {
  if (isLoading) {
    return <ResultsSkeleton />;
  }

  if (!result) {
    return (
      <Card className="flex items-center justify-center h-full min-h-[400px] bg-card">
        <div className="text-center text-muted-foreground p-8">
          <h3 className="text-lg font-semibold text-foreground">Awaiting Assessment</h3>
          <p>Submit applicant data to view the AI-powered risk analysis.</p>
        </div>
      </Card>
    );
  }
  
  const riskBadgeVariant = getRiskBadgeVariant(result.riskAssessment);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Risk Assessment</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge variant={riskBadgeVariant} className="text-lg px-3 py-1">
              {result.riskAssessment}
            </Badge>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Approved Loan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              ${result.approvedLoanAmount.toLocaleString()}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Interest Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {result.recommendedInterestRate.toFixed(2)}%
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Loan Amount Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <ResultsChart 
            requested={result.requestedLoanAmount}
            approved={result.approvedLoanAmount}
          />
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Key Risk Factors</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-foreground/80 whitespace-pre-wrap">{result.riskFactors}</p>
        </CardContent>
      </Card>
    </div>
  );
}

function ResultsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card><CardHeader><Skeleton className="h-5 w-3/4" /></CardHeader><CardContent><Skeleton className="h-8 w-1/2" /></CardContent></Card>
        <Card><CardHeader><Skeleton className="h-5 w-3/4" /></CardHeader><CardContent><Skeleton className="h-8 w-1/2" /></CardContent></Card>
        <Card><CardHeader><Skeleton className="h-5 w-3/4" /></CardHeader><CardContent><Skeleton className="h-8 w-1/2" /></CardContent></Card>
      </div>
      <Card><CardHeader><Skeleton className="h-6 w-1/2" /></CardHeader><CardContent><Skeleton className="h-64 w-full" /></CardContent></Card>
      <Card><CardHeader><Skeleton className="h-6 w-1/2" /></CardHeader><CardContent><Skeleton className="h-4 w-full" /><Skeleton className="h-4 w-5/6 mt-2" /></CardContent></Card>
    </div>
  );
}
