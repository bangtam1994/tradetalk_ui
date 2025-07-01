'use client';

import React, { useState, useEffect } from 'react';
import { Brain } from 'lucide-react';
import { toast } from 'sonner';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Trade, JournalEntry } from '@/types/trading';
import { analyzeTradingDay } from '@/lib/api/groq';
import {
  createPsychoAnalysis,
  getPsychoAnalysis,
} from '@/lib/api/psycho-analysis';

interface PsychoAnalysisDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  trades: Trade[];
  date: string;
  journal: JournalEntry | null;
  tradingDayId: string;
}

export const PsychoAnalysis = ({
  isOpen,
  onClose,
  trades,
  date,
  journal,
  tradingDayId,
}: PsychoAnalysisDrawerProps) => {
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [recommendation, setRecommendation] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadExistingAnalysis = async () => {
      if (tradingDayId) {
        const result = await getPsychoAnalysis(tradingDayId);
        if (result.success && result.data) {
          const parts = result.data.analysis.split('Recommandation:');
          setAnalysis(parts[0].trim());
          if (parts[1]) {
            setRecommendation(parts[1].trim());
          }
        }
      }
    };
    loadExistingAnalysis();
  }, [tradingDayId]);

  const handleAnalyze = async () => {
    setIsLoading(true);
    try {
      const result = await analyzeTradingDay(trades, journal);
      const parts = result.split('Recommandation:');
      setAnalysis(parts[0].trim());
      if (parts[1]) {
        setRecommendation(parts[1].trim());
      }

      const saveResult = await createPsychoAnalysis(tradingDayId, result);

      if (!saveResult.success) {
        throw new Error(saveResult.error);
      }

      toast.success('Analyse sauvegardée avec succès !');
    } catch (error) {
      console.error('Error:', error);
      toast.error("Erreur lors de la sauvegarde de l'analyse");
    } finally {
      setIsLoading(false);
    }
  };

  const formatAnalysis = (text: string) => {
    // Diviser le texte en sections
    const sections = text.split('\n\n');

    return sections.map((section, index) => {
      // Trouver le titre de la section (texte entre **)
      const titleMatch = section.match(/\*\*(.*?)\*\*/);
      if (!titleMatch) return <p key={index}>{section}</p>;

      const title = titleMatch[1];
      const content = section.replace(/\*\*.*?\*\*/, '').trim();

      // Si c'est la première section (Techniquement), ne pas inclure les recommandations
      if (title === 'Techniquement') {
        const contentWithoutReco = content.split('\n').slice(0, -1).join('\n');
        return (
          <div key={index} className="mb-4">
            <h3 className="mb-2 text-lg font-bold">{title}</h3>
            <div className="space-y-1">
              {contentWithoutReco.split('\n').map((line, i) => (
                <p key={i}>{line}</p>
              ))}
            </div>
          </div>
        );
      }

      // Pour les autres sections
      return (
        <div key={index} className="mb-4">
          <h3 className="mb-2 text-lg font-bold">{title}</h3>
          <div className="space-y-1">
            {content.split('\n').map((line, i) => (
              <p key={i}>{line}</p>
            ))}
          </div>
        </div>
      );
    });
  };
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent
        side="left"
        className="w-[70vw] min-w-[600px] bg-background/70 p-0 backdrop-blur-md dark:bg-background/50"
      >
        <div className="flex h-full flex-col">
          <SheetHeader className="border-b p-6">
            <SheetTitle>Analyse de TradeTalk</SheetTitle>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto p-6">
            <div className="space-y-4">
              <div className="space-y-2">
                {trades.map((trade, index) => (
                  <div
                    key={index}
                    className={`flex items-center gap-2 rounded-xl border p-4 ${
                      trade.isProfit
                        ? 'border-l-4 border-l-green-500'
                        : 'border-l-4 border-l-red-500'
                    }`}
                  >
                    <div className="flex-1">
                      <div className="font-medium">{trade.pair}</div>
                      <div className="text-sm text-muted-foreground">
                        {trade.time} - {trade.amount}€
                      </div>
                    </div>
                    <div
                      className={`font-medium ${
                        trade.isProfit ? 'text-green-500' : 'text-red-500'
                      }`}
                    >
                      {trade.isProfit ? '+' : '-'}
                      {trade.amount}€
                    </div>
                  </div>
                ))}
              </div>

              {analysis && (
                <div className="mt-6 rounded-xl border bg-card p-6">
                  <div className="prose prose-sm dark:prose-invert max-w-none">
                    <div className="whitespace-pre-wrap">
                      {formatAnalysis(analysis)}
                    </div>
                  </div>
                </div>
              )}

              {recommendation && (
                <div className="mt-6 rounded-xl border border-primary/20 bg-primary/5 p-6">
                  <h3 className="mb-4 text-lg font-semibold text-primary">
                    Recommandation
                  </h3>
                  <div className="prose prose-sm dark:prose-invert max-w-none">
                    <div className="whitespace-pre-wrap">{recommendation}</div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="border-t p-6">
            <Button
              className="w-full gap-2"
              onClick={handleAnalyze}
              disabled={isLoading}
            >
              <Brain className="h-4 w-4" />
              {isLoading ? 'Analyse en cours...' : 'Analyser la journée'}
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
