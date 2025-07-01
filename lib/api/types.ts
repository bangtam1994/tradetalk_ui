import { JournalEntry, PsychoAnalysis } from '@/types/trading';

import { Trade } from '@/types/trading';

export type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
};

export interface TradingDay {
  id: string;
  date: string;
  trades: Trade[];
  journal: JournalEntry | null;
  psycho_analyses: PsychoAnalysis | null;
}

export interface CreateTradingDayDto {
  date: string;
  trades: Trade[];
  journal: JournalEntry | null;
  psycho_analyses: PsychoAnalysis | null;
}

export interface UpdateTradingDayDto {
  trades?: Trade[];
  journal?: JournalEntry | null;
  psycho_analyses?: PsychoAnalysis | null;
}
