/**
 * Représente un trade individuel
 */
export interface Trade {
  /** Identifiant unique du trade */
  id: string;
  /** Heure du trade au format HH:mm */
  time: string;
  /** Indique si le trade est profitable */
  isProfit: boolean;
  /** Montant du trade */
  amount: string;
  /** Paire de devises tradée */
  pair: string;
  /** État d'expansion du formulaire de trade */
  isExpanded: boolean;
  /** URL TradingView associée au trade */
  tradingViewUrl?: string;
}

export interface JournalEntry {
  content: string;
  mood: string;
  psycho_analyses?: PsychoAnalysis | null;
}

export interface DayData {
  id?: string;
  date: string;
  trades: Trade[];
  journal: JournalEntry | null;
  psycho_analyses: PsychoAnalysis | null;
}

export interface PsychoAnalysis {
  id: string;
  trading_day_id: string;
  analysis: string;
  created_at: string;
  updated_at: string;
}
