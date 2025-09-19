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

type CandidatesTableProps = {
  data: Candidate[];
};

export function CandidatesTable({ data }: CandidatesTableProps) {
  const getRiskBadgeVariant = (risk: "Low" | "Medium" | "High"): BadgeProps['variant'] => {
    switch (risk) {
      case 'Low': return 'default';
      case 'Medium': return 'secondary';
      case 'High': return 'destructive';
      default: return 'outline';
    }
  };

  const getStatusBadgeVariant = (status: "Pending" | "Approved" | "Rejected"): BadgeProps['variant'] => {
    switch (status) {
        case 'Approved': return 'default';
        case 'Pending': return 'secondary';
        case 'Rejected': return 'destructive';
    }
};

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Candidate</TableHead>
            <TableHead className="hidden sm:table-cell">Risk</TableHead>
            <TableHead className="hidden md:table-cell">Credit Score</TableHead>
            <TableHead>Loan Amount</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((candidate) => (
            <TableRow key={candidate.id}>
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
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
