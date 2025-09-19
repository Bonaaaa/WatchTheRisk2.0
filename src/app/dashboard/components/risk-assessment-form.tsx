"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(1, { message: "Name is required." }),
  email: z.string().email({ message: "Invalid email address." }),
  income: z.string().min(1, { message: "Income is required." }),
  creditScore: z.string().min(1, { message: "Credit score is required." }),
  loanAmount: z.string().min(1, { message: "Loan amount is required." }),
  loanDuration: z.string().min(1, { message: "Loan duration is required." }),
  employmentHistory: z.enum(["Government", "Private Company"], {
    required_error: "You need to select an employment type.",
  }),
  debtToIncomeRatio: z.string().min(1, { message: "DTI ratio is required." }),
});

type RiskAssessmentFormProps = {
  onAssess: (data: z.infer<typeof formSchema>) => void;
  isLoading: boolean;
};

export default function RiskAssessmentForm({ onAssess, isLoading }: RiskAssessmentFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "John Doe",
      email: "john.doe@example.com",
      income: "75000",
      creditScore: "720",
      loanAmount: "20000",
      loanDuration: "36",
      employmentHistory: "Private Company",
      debtToIncomeRatio: "0.3",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    onAssess(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Applicant Name</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., John Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Applicant Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="e.g., john.doe@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="income"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Annual Income (USD)</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="e.g., 75000" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="creditScore"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Credit Score</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="e.g., 720" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="loanAmount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Loan Amount (USD)</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="e.g., 20000" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="loanDuration"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Loan Duration (months)</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="e.g., 36" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
           <FormField
            control={form.control}
            name="debtToIncomeRatio"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Debt-to-Income Ratio</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" placeholder="e.g., 0.3" {...field} />
                </FormControl>
                <FormDescription>
                  Total monthly debt divided by gross monthly income (e.g., 0.4 for 40%).
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="employmentHistory"
            render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Employment Type</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="Government" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Government
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="Private Company" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Private Company
                        </FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
          />
        </div>
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Assess Risk
        </Button>
      </form>
    </Form>
  );
}
