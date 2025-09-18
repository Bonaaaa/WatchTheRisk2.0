import { config } from 'dotenv';
config({ path: '.env.local' });

import '@/ai/flows/assess-credit-risk.ts';
import '@/ai/flows/estimate-loan-limit-and-rate.ts';
