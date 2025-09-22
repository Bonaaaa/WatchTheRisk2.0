import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { CandidatesTable } from "./components/candidates-table";
import { getCandidates } from "./service";
import { Exporter } from "./components/exporter";

export const dynamic = 'force-dynamic';

export default async function CandidatesPage() {
  const candidates = await getCandidates();

  return (
    <Card>
      <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
            <CardTitle className="font-headline">Loanee Candidates</CardTitle>
            <CardDescription>
                A preview of loanee candidates. Use the button to export a CSV file.
            </CardDescription>
        </div>
        <Exporter />
      </CardHeader>
      <CardContent>
        <CandidatesTable data={candidates} />
      </CardContent>
    </Card>
  );
}
