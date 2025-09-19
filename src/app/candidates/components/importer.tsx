"use client";

import { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Loader2, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { handleBatchAssess } from '@/app/dashboard/actions';
import type { AssessCreditRiskInput } from '@/ai/flows/assess-credit-risk';

export function Importer() {
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setIsLoading(true);

        try {
            const text = await file.text();
            const rows = text.split('\n').filter(row => row.trim() !== '');
            const headers = rows.shift()?.split(',').map(h => h.trim());

            if (!headers || headers.join(',') !== 'name,email,income,creditScore,loanAmount,loanDuration,employmentHistory,debtToIncomeRatio') {
                throw new Error('Invalid CSV headers. Please ensure the headers are: name,email,income,creditScore,loanAmount,loanDuration,employmentHistory,debtToIncomeRatio');
            }

            const candidates: AssessCreditRiskInput[] = rows.map((row, index) => {
                const values = row.split(',').map(v => v.trim());
                if (values.length !== headers.length) {
                    throw new Error(`Row ${index + 1} has an incorrect number of columns.`);
                }
                
                return {
                    name: values[0],
                    email: values[1],
                    income: Number(values[2]),
                    creditScore: Number(values[3]),
                    loanAmount: Number(values[4]),
                    loanDuration: Number(values[5]),
                    employmentHistory: values[6],
                    debtToIncomeRatio: Number(values[7]),
                };
            });

            await handleBatchAssess(candidates);

            toast({
                title: "Import Successful",
                description: `${candidates.length} candidates have been imported and are being assessed.`,
            });

        } catch (error: any) {
            console.error(error);
            toast({
                variant: "destructive",
                title: "Import Failed",
                description: error.message || "An unexpected error occurred during import.",
            });
        } finally {
            setIsLoading(false);
            // Reset the file input so the same file can be uploaded again
            if(fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const handleButtonClick = () => {
        fileInputRef.current?.click();
    };

    return (
        <div>
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept=".csv"
                disabled={isLoading}
            />
            <Button onClick={handleButtonClick} disabled={isLoading}>
                {isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                    <Upload className="mr-2 h-4 w-4" />
                )}
                Import CSV
            </Button>
        </div>
    );
}
