"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Loader2, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getCandidates, type Candidate } from '@/app/candidates/service';

export function Exporter() {
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();

    const handleExport = async () => {
        setIsLoading(true);
        try {
            const candidates = await getCandidates();
            if (candidates.length === 0) {
                toast({
                    title: "No Data to Export",
                    description: "There are no candidates to export.",
                });
                return;
            }

            const csvContent = convertToCSV(candidates);
            downloadCSV(csvContent);

            toast({
                title: "Export Successful",
                description: `${candidates.length} candidates have been exported to CSV.`,
            });

        } catch (error: any) {
            console.error(error);
            toast({
                variant: "destructive",
                title: "Export Failed",
                description: "An unexpected error occurred during export.",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const convertToCSV = (data: Candidate[]): string => {
        const headers = ['id', 'name', 'email', 'creditScore', 'loanAmount', 'risk', 'status'];
        const rows = data.map(candidate => 
            headers.map(header => JSON.stringify(candidate[header as keyof Candidate])).join(',')
        );
        return [headers.join(','), ...rows].join('\n');
    };

    const downloadCSV = (csvContent: string) => {
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", "candidates.csv");
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div>
            <Button onClick={handleExport} disabled={isLoading}>
                {isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                    <Download className="mr-2 h-4 w-4" />
                )}
                Export CSV
            </Button>
        </div>
    );
}
