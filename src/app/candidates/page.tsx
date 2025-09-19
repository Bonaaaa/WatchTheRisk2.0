import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { CandidatesTable } from "./components/candidates-table";
import { getCandidates } from "./service";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

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
        <Button>
            <Upload className="mr-2 h-4 w-4"/>
            Import CSV
        </Button>
      </CardHeader>
      <CardContent>
        <CandidatesTable data={candidates} />
      </CardContent>
    </Card>
  );
}
