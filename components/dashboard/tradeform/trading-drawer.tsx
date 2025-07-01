'use client';

import React, { useEffect, useCallback } from 'react';

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Trade, JournalEntry, DayData } from '@/types/trading';

import { fr } from 'date-fns/locale';
import { format } from 'date-fns';
import { TradeDayForm } from './trading-day-form';
import { JournalDayEditor } from './journal/journal-day-editor';
import { useTrading } from '@/lib/hooks/useTrading';

interface TradingDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  trades: Trade[];
  date: string;
  journal: JournalEntry | null;
  tradingDayId: string;
  errorMessage: string | null;
  setErrorMessage: (errorMessage: string | null) => void;
  handleTradesUpdate: (trades: Trade[]) => void;
  handleJournalUpdate: (journal: JournalEntry) => void;
  isCreation: boolean;
  dayData: DayData | null;
}

export const TradingDrawer = ({
  isOpen,
  onClose,
  trades,
  date,
  journal,
  tradingDayId,
  errorMessage,
  setErrorMessage,
  handleTradesUpdate,
  handleJournalUpdate,
  isCreation,
  dayData,
}: TradingDrawerProps) => {
  const { useCreateTradingDay, useUpdateTradingDay } = useTrading();
  const { mutate: createTradingDay } = useCreateTradingDay();
  const { mutate: updateTradingDay } = useUpdateTradingDay();

  const validateForm = useCallback(() => {
    if (!dayData) {
      setErrorMessage('Données manquantes');
      return false;
    }

    if (!dayData.journal?.mood) {
      setErrorMessage('Veuillez sélectionner votre humeur');
      return false;
    }

    if (dayData.trades.length === 0) {
      setErrorMessage('Veuillez ajouter au moins un trade');
      return false;
    }

    const invalidTrade = dayData.trades.find(
      (trade) =>
        !trade.pair ||
        !trade.amount ||
        !trade.time ||
        isNaN(Number(trade.amount)) ||
        Number(trade.amount) <= 0
    );

    if (invalidTrade) {
      if (!invalidTrade.pair) {
        setErrorMessage('Veuillez sélectionner une paire pour tous les trades');
        return false;
      }
      if (!invalidTrade.amount) {
        setErrorMessage('Veuillez entrer un montant pour tous les trades');
        return false;
      }
      if (!invalidTrade.time) {
        setErrorMessage('Veuillez entrer une heure pour tous les trades');
        return false;
      }
      if (isNaN(Number(invalidTrade.amount))) {
        setErrorMessage('Le montant doit être un nombre valide');
        return false;
      }
      if (Number(invalidTrade.amount) <= 0) {
        setErrorMessage('Le montant doit être supérieur à 0');
        return false;
      }
    }

    setErrorMessage(null);
    return true;
  }, [dayData]);

  useEffect(() => {
    validateForm();
  }, [dayData, validateForm]);

  const handleSubmit = () => {
    if (!validateForm()) return;

    if (!dayData) return;

    if (isCreation) {
      updateTradingDay({
        date: dayData.date,
        data: {
          trades: dayData.trades,
          journal: dayData.journal,
        },
      });
    } else {
      createTradingDay({
        date: dayData.date,
        trades: dayData.trades,
        journal: dayData.journal,
        psycho_analyses: null,
      });
    }

    onClose();
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-[90vw] min-w-[700px] bg-background/70 p-16 backdrop-blur-md dark:bg-background/50">
        <SheetHeader>
          <SheetTitle className="text-2xl text-foreground">
            {date && format(date, 'dd MMMM yyyy', { locale: fr })}
          </SheetTitle>
          <SheetDescription className="text-muted-foreground">
            Détails de votre journée de trading
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          <TradeDayForm
            trades={trades || []}
            onTradesUpdate={handleTradesUpdate}
          />
          <JournalDayEditor
            journal={journal || null}
            onJournalUpdate={handleJournalUpdate}
          />
          <div className="flex flex-col items-center gap-2">
            <Button
              className="rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 px-8 py-4 font-semibold text-white transition-all duration-300 hover:scale-105 hover:from-indigo-500/90 hover:to-purple-500/90 hover:shadow-[0_0_15px_rgba(139,92,246,0.5)] disabled:cursor-not-allowed disabled:opacity-50"
              onClick={handleSubmit}
              disabled={errorMessage !== null}
            >
              Valider
            </Button>
            {errorMessage && (
              <p className="text-center text-sm text-red-500">{errorMessage}</p>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
