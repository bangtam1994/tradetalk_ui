import { supabase } from '@/lib/supabase';
import { PsychoAnalysis } from '@/types/trading';
import { ApiResponse } from './types';

export const createPsychoAnalysis = async (
  tradingDayId: string,
  analysis: string
): Promise<ApiResponse<PsychoAnalysis>> => {
  try {
    const { data, error } = await supabase
      .from('psycho_analyses')
      .insert({
        trading_day_id: tradingDayId,
        analysis,
      })
      .select()
      .single();

    if (error) throw error;

    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error('Error creating psycho analysis:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
};

export const getPsychoAnalysis = async (
  tradingDayId: string
): Promise<ApiResponse<PsychoAnalysis>> => {
  try {
    const { data, error } = await supabase
      .from('psycho_analyses')
      .select('*')
      .eq('trading_day_id', tradingDayId)
      .single();

    if (error) throw error;

    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error('Error fetching psycho analysis:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
};
