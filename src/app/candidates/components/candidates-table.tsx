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

  if (data.length === 0) {
    return (
      <div className="text-center text-muted-foreground p-8 rounded-md border">
        No candidates have been saved yet.
      </div>
    )
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[40%]">Candidate</TableHead>
            <TableHead className="hidden sm:table-cell">Risk</TableHead>
            <TableHead className="hidden md:table-cell">Credit Score</TableHead>
            <TableHead>Loan Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-[80px] text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((candidate) => (
            <TableRow key={candidate.id}>
              <TableCell>
                <div className="font-medium">{candidate.name}</div>
                <div className="text-sm text-muted-foreground mb-2">{candidate.email}</div>
                <p className="text-xs text-muted-foreground whitespace-pre-wrap lg:max-w-md">
                  {candidate.riskFactors}
                </p>
              </TableCell>
              <TableCell className="hidden sm:table-cell align-top">
                <Badge variant={getRiskBadgeVariant(candidate.risk)}>{candidate.risk}</Badge>
              </TableCell>
              <TableCell className="hidden md:table-cell align-top">{candidate.creditScore}</TableCell>
              <TableCell className="align-top">${candidate.loanAmount.toLocaleString()}</TableCell>
              <TableCell className="align-top">
                <Badge variant={getStatusBadgeVariant(candidate.status)}>{candidate.status}</Badge>
              </TableCell>
              <TableCell className="text-right align-top">
                <Button variant="ghost" size="icon" onClick={() => onDelete(candidate.id, candidate.name)}>
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">Delete</span>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
