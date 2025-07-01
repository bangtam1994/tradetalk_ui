import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { tradingApi } from '../api/trading';
import { CreateTradingDayDto, UpdateTradingDayDto } from '../api/types';

export const useTrading = () => {
  const queryClient = useQueryClient();

  // Query pour récupérer tous les jours de trading
  const useTradingDays = () => {
    return useQuery({
      queryKey: ['tradingDays'],
      queryFn: () => tradingApi.getAllTradingDays(),
    });
  };

  // Query pour récupérer un jour spécifique
  const useTradingDay = (date: string) => {
    return useQuery({
      queryKey: ['tradingDay', date],
      queryFn: () => tradingApi.getTradingDay(date),
      enabled: !!date,
    });
  };

  // Mutation pour créer un jour de trading
  const useCreateTradingDay = () => {
    return useMutation({
      mutationFn: (data: CreateTradingDayDto) => tradingApi.createTradingDay(data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['tradingDays'] });
      },
    });
  };

  // Mutation pour mettre à jour un jour de trading
  const useUpdateTradingDay = () => {
    return useMutation({
      mutationFn: ({ date, data }: { date: string; data: UpdateTradingDayDto }) =>
        tradingApi.updateTradingDay(date, data),
      onSuccess: (_, { date }) => {
        queryClient.invalidateQueries({ queryKey: ['tradingDays'] });
        queryClient.invalidateQueries({ queryKey: ['tradingDay', date] });
      },
    });
  };

  // Mutation pour supprimer un jour de trading
  const useDeleteTradingDay = () => {
    return useMutation({
      mutationFn: (date: string) => tradingApi.deleteTradingDay(date),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['tradingDays'] });
      },
    });
  };

  return {
    useTradingDays,
    useTradingDay,
    useCreateTradingDay,
    useUpdateTradingDay,
    useDeleteTradingDay,
  };
}; 