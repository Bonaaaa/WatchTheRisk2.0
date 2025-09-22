"use client";

import * as React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { Badge, type BadgeProps } from "@/components/ui/badge";
import type { Candidate } from "../service";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { handleDeleteCandidate } from "../actions";
import { useToast } from "@/hooks/use-toast";


type CandidatesTableProps = {
  data: Candidate[];
};

export function CandidatesTable({ data }: CandidatesTableProps) {
  const { toast } = useToast();

  const getRiskBadgeVariant = (risk: "Low" | "Medium" | "High"): BadgeProps['variant'] => {
    switch (risk) {
      case 'Low': return 'default';
      case 'Medium': return 'secondary';
      case 'High': return 'destructive';
      default: return 'outline';
    }
  };

  const getStatusBadgeVariant = (status: "Approved" | "Rejected"): BadgeProps['variant'] => {
    switch (status) {
        case 'Approved': return 'default';
        case 'Rejected': return 'destructive';
    }
  };

  const onDelete = async (id: string, name: string) => {
    const result = await handleDeleteCandidate(id);
    if (result.success) {
      toast({
        title: "Candidate Deleted",
        description: `${name} has been removed from the list.`,
      });
    } else {
      toast({
        variant: "destructive",
        title: "Deletion Failed",
        description: result.message,
      });
    }
  }

  return (
    <Accordion type="single" collapsible className="w-full">
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                <TableRow>
                    <TableHead>Candidate</TableHead>
                    <TableHead className="hidden sm:table-cell">Risk</TableHead>
                    <TableHead className="hidden md:table-cell">Credit Score</TableHead>
                    <TableHead>Loan Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-[80px] text-right">Actions</TableHead>
                    <TableHead className="w-[40px]"></TableHead>
                </TableRow>
                </TableHeader>
                <TableBody>
                {data.map((candidate) => (
                    <AccordionItem value={candidate.id} key={candidate.id} className="border-b">
                         <TableRow>
                            <TableCell>
                                <div className="font-medium">{candidate.name}</div>
                                <div className="text-sm text-muted-foreground hidden sm:inline">{candidate.email}</div>
                            </TableCell>
                            <TableCell className="hidden sm:table-cell">
                                <Badge variant={getRiskBadgeVariant(candidate.risk)}>{candidate.risk}</Badge>
                            </TableCell>
                            <TableCell className="hidden md:table-cell">{candidate.creditScore}</TableCell>
                            <TableCell>${candidate.loanAmount.toLocaleString()}</TableCell>
                            <TableCell>
                                <Badge variant={getStatusBadgeVariant(candidate.status)}>{candidate.status}</Badge>
                            </TableCell>
                            <TableCell className="text-right">
                                <Button variant="ghost" size="icon" onClick={() => onDelete(candidate.id, candidate.name)}>
                                    <Trash2 className="h-4 w-4" />
                                    <span className="sr-only">Delete</span>
                                </Button>
                            </TableCell>
                             <TableCell>
                                 <AccordionTrigger className="p-0 [&[data-state=open]>svg]:rotate-180" />
                             </TableCell>
                        </TableRow>
                        <AccordionContent>
                            <div className="p-4 bg-muted/50">
                                <h4 className="font-semibold mb-2 text-sm">Key Risk Factors</h4>
                                <p className="text-sm text-muted-foreground whitespace-pre-wrap">{candidate.riskFactors}</p>
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                ))}
                </TableBody>
            </Table>
        </div>
    </Accordion>
  );
}
