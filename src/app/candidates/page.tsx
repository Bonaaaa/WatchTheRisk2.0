import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { CandidatesTable } from "./components/candidates-table";
import { getCandidates } from "./service";
import { Importer } from "./components/importer";

export const dynamic = 'force-dynamic';

export default function CandidatesPage() {
  const candidates = getCandidates();

  return (
    <Card>
      <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
            <CardTitle className="font-headline">Loanee Candidates</CardTitle>
            <CardDescription>
                A preview of loanee candidates. Use the button to import a CSV file.
            </CardDescription>
        </div>
        <Importer />
      </CardHeader>
      <CardContent>
        <CandidatesTable data={candidates} />
      </CardContent>
    </Card>
  );
}
