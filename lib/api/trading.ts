import { supabase } from '@/lib/supabase';
import {
  TradingDay,
  CreateTradingDayDto,
  UpdateTradingDayDto,
  ApiResponse,
} from './types';

export const tradingApi = {
  // Récupérer tous les jours de trading
  getAllTradingDays: async (): Promise<ApiResponse<TradingDay[]>> => {
    const { data, error } = await supabase.from('trading_days').select(`
        *,
        psycho_analyses (
          id,
          analysis,
          created_at
        )
      `);

    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true, data };
  },

  // Récupérer un jour spécifique
  getTradingDay: async (date: string): Promise<ApiResponse<TradingDay>> => {
    const { data, error } = await supabase
      .from('trading_days')
      .select(
        `
        *,
        psycho_analyses (
          id,
          analysis,
          created_at
        )
      `
      )
      .eq('date', date)
      .single();

    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true, data };
  },

  // Créer un nouveau jour de trading
  createTradingDay: async (
    data: CreateTradingDayDto
  ): Promise<ApiResponse<TradingDay>> => {
    const { data: newData, error } = await supabase
      .from('trading_days')
      .insert({
        date: data.date,
        journal: data.journal,
        trades: data.trades,
      })
      .select()
      .single();

    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true, data: newData };
  },

  // Mettre à jour un jour de trading
  updateTradingDay: async (
    date: string,
    data: UpdateTradingDayDto
  ): Promise<ApiResponse<TradingDay>> => {
    const { data: updatedData, error } = await supabase
      .from('trading_days')
      .update({
        journal: data.journal,
        trades: data.trades,
      })
      .eq('date', date)
      .select()
      .single();

    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true, data: updatedData };
  },

  // Supprimer un jour de trading
  deleteTradingDay: async (date: string): Promise<ApiResponse<void>> => {
    const { error } = await supabase
      .from('trading_days')
      .delete()
      .eq('date', date);

    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true };
  },
};
