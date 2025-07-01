'use client';

import React, { useEffect, useState } from 'react';
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isToday,
  parseISO,
} from 'date-fns';
import { fr } from 'date-fns/locale';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Brain, Calendar } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

import { JournalEntry } from '@/types/trading';
import { Trade } from '@/types/trading';
import { DayData } from '@/types/trading';
import { useTrading } from '@/lib/hooks/useTrading';
import { PsychoAnalysis } from '@/components/dashboard/ai/psycho-analysis';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { TradingDrawer } from './tradeform/trading-drawer';

export const TradingCalendar = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [dayData, setDayData] = useState<DayData | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isPsychoDrawerOpen, setIsPsychoDrawerOpen] = useState(false);
  const { useTradingDays } = useTrading();

  const { data: tradingDaysData, isLoading } = useTradingDays();

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const prevMonth = () => {
    setCurrentMonth(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1)
    );
  };

  const nextMonth = () => {
    setCurrentMonth(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1)
    );
  };

  const goToToday = () => {
    setCurrentMonth(new Date());
  };

  const handleDayClick = (day: Date) => {
    setSelectedDate(day);
    const dateStr = format(day, 'yyyy-MM-dd');
    const existingDay = tradingDaysData?.data?.find(
      (data) => data.date === dateStr
    );

    setDayData(
      existingDay || {
        date: dateStr,
        trades: [],
        journal: null,
        psycho_analyses: null,
      }
    );

    setIsDrawerOpen(true);
    setErrorMessage(null);
  };

  const handleTradesUpdate = (trades: Trade[]) => {
    setDayData((prev) => (prev ? { ...prev, trades } : null));
  };
  const handleJournalUpdate = (journal: JournalEntry) => {
    setDayData((prev) => (prev ? { ...prev, journal } : null));
  };

  const handlePsychoAnalysis = (day: Date) => {
    const dateStr = format(day, 'yyyy-MM-dd');
    const existingDay = tradingDaysData?.data?.find(
      (data) => data.date === dateStr
    );
    setSelectedDate(day);
    setDayData(
      existingDay || {
        date: dateStr,
        trades: [],
        journal: null,
        psycho_analyses: null,
      }
    );
    setIsPsychoDrawerOpen(true);
  };

  return (
    <div className="mx-auto w-[50%] space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="mb-4 text-2xl font-bold text-foreground">
            Suivi de Trading
          </h2>
          <p className="text-muted-foreground">
            Visualise tes performances quotidiennes
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 rounded-lg bg-muted/50 px-3 py-1.5">
            <div className="h-2 w-2 rounded-full bg-green-500"></div>
            <span className="text-sm text-muted-foreground">Profit</span>
          </div>
          <div className="flex items-center gap-2 rounded-lg bg-muted/50 px-3 py-1.5">
            <div className="h-2 w-2 rounded-full bg-red-500"></div>
            <span className="text-sm text-muted-foreground">Perte</span>
          </div>
        </div>
      </div>
      <div className="rounded-2xl bg-gradient-to-r from-[#8e2de2] to-[#5dbfe0] p-px">
        <Card className="relative rounded-2xl bg-background/90 p-6 shadow-lg backdrop-blur-sm">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex space-x-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={prevMonth}
                className="rounded-full hover:bg-muted"
              >
                <ChevronLeft className="size-5" />
              </Button>
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentMonth.toISOString()}
                  initial={{ x: 100, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -100, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="text-xl font-semibold"
                >
                  {format(currentMonth, 'MMMM yyyy', { locale: fr })}
                </motion.div>
              </AnimatePresence>
              <Button
                variant="ghost"
                size="icon"
                onClick={nextMonth}
                className="rounded-full hover:bg-muted"
              >
                <ChevronRight className="size-5" />
              </Button>
              <Button
                variant="ghost"
                onClick={goToToday}
                className="gap-2 text-xs text-muted-foreground"
              >
                <Calendar className="size-4" />
                Aujourd&apos;hui
              </Button>
            </div>
          </div>

          <div className="mb-2 grid grid-cols-7 gap-2">
            {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map((day) => (
              <div
                key={day}
                className="text-center text-sm font-medium text-muted-foreground"
              >
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-2">
            {days.map((day, i) => {
              const dayData = tradingDaysData?.data?.find(
                (data) => data.date === format(day, 'yyyy-MM-dd')
              );
              const profit = dayData?.trades.reduce(
                (acc, trade) =>
                  acc +
                  (trade.isProfit
                    ? Number(trade.amount)
                    : -Number(trade.amount)),
                0
              );
              const hasPsychoAnalysis = dayData?.psycho_analyses;

              return (
                <TooltipProvider key={i}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <motion.button
                        onClick={() => handleDayClick(day)}
                        className={`relative flex aspect-square flex-col items-center justify-center rounded-xl p-2 text-center ${isToday(day) ? 'bg-primary/20' : 'hover:bg-muted'} ${!isSameMonth(day, currentMonth) ? 'opacity-30' : ''} transition-all duration-200`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <span
                          className={`text-sm font-medium ${hasPsychoAnalysis ? 'text-[#9e40f0]' : isToday(day) ? 'text-foreground' : 'text-muted-foreground'}`}
                        >
                          {format(day, 'd')}
                        </span>
                        {dayData && (
                          <div className="absolute bottom-1 flex flex-col items-center justify-center gap-1">
                            {profit !== undefined && (
                              <div
                                className={`size-2 rounded-full ${profit >= 0 ? 'bg-green-500' : 'bg-red-500'}`}
                              />
                            )}
                          </div>
                        )}
                      </motion.button>
                    </TooltipTrigger>
                    <TooltipContent
                      className="space-y-2 rounded-2xl border border-border/50 bg-background/95 p-3 shadow-lg backdrop-blur-sm"
                      sideOffset={5}
                    >
                      <div className="text-sm text-muted-foreground">
                        {dayData && profit !== undefined ? (
                          <>
                            <div className="mb-1 font-medium text-foreground">
                              {format(parseISO(dayData.date), 'd MMMM yyyy')}
                            </div>
                            <div className="flex items-center gap-2 text-xs">
                              <div
                                className={`size-2 rounded-full ${profit >= 0 ? 'bg-green-500' : 'bg-red-500'}`}
                              />
                              <span>
                                {profit >= 0 ? '+' : ''}
                                {profit}€
                              </span>
                            </div>
                          </>
                        ) : (
                          'Aucun trade ce jour'
                        )}
                      </div>

                      {dayData && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full rounded-xl bg-primary/10 text-primary transition-all duration-200 hover:bg-primary/20"
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePsychoAnalysis(day);
                          }}
                        >
                          {hasPsychoAnalysis ? (
                            <div className="flex items-center gap-2">
                              <Brain className="size-4" />
                              <span>Voir analyse</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <Brain className="size-4" />
                              <span>Analyser avec TradeTalk</span>
                            </div>
                          )}
                        </Button>
                      )}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              );
            })}
          </div>
        </Card>
      </div>

      <TradingDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        trades={dayData?.trades || []}
        date={selectedDate ? format(selectedDate, 'yyyy-MM-dd') : ''}
        journal={dayData?.journal || null}
        tradingDayId={dayData?.id || ''}
        handleTradesUpdate={handleTradesUpdate}
        handleJournalUpdate={handleJournalUpdate}
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
        isCreation={
          (tradingDaysData?.data &&
            tradingDaysData.data.some((day) => day.date === dayData?.date)) ||
          true
        }
        dayData={dayData}
      />

      <PsychoAnalysis
        isOpen={isPsychoDrawerOpen}
        onClose={() => setIsPsychoDrawerOpen(false)}
        trades={dayData?.trades || []}
        date={selectedDate ? format(selectedDate, 'yyyy-MM-dd') : ''}
        journal={dayData?.journal || null}
        tradingDayId={dayData?.id || ''}
      />
    </div>
  );
};
