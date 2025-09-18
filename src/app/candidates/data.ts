export type Candidate = {
  id: string;
  name: string;
  email: string;
  risk: "Low" | "Medium" | "High";
  creditScore: number;
  loanAmount: number;
  status: "Pending" | "Approved" | "Rejected";
};

export const candidates: Candidate[] = [
  { id: "CAND-001", name: "Alex Johnson", email: "alex.j@example.com", risk: "Low", creditScore: 780, loanAmount: 15000, status: "Approved" },
  { id: "CAND-002", name: "Maria Garcia", email: "maria.g@example.com", risk: "Medium", creditScore: 650, loanAmount: 30000, status: "Pending" },
  { id: "CAND-003", name: "Samuel Chen", email: "sam.c@example.com", risk: "High", creditScore: 590, loanAmount: 5000, status: "Rejected" },
  { id: "CAND-004", name: "Emily White", email: "emily.w@example.com", risk: "Low", creditScore: 810, loanAmount: 50000, status: "Approved" },
  { id: "CAND-005", name: "Michael Green", email: "michael.g@example.com", risk: "Medium", creditScore: 690, loanAmount: 25000, status: "Pending" },
  { id: "CAND-006", name: "Jessica Black", email: "jessica.b@example.com", risk: "Low", creditScore: 760, loanAmount: 10000, status: "Approved" },
  { id: "CAND-007", name: "David Gray", email: "david.g@example.com", risk: "High", creditScore: 610, loanAmount: 40000, status: "Rejected" },
  { id: "CAND-008", name: "Olivia Taylor", email: "olivia.t@example.com", risk: "Low", creditScore: 795, loanAmount: 22000, status: "Approved" },
];
