'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { ChevronDown, ChevronUp, Plus, X } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Trade } from '@/types/trading';
import { TradingViewWidget } from './trading-view-widget';

const PAIRS = [
  'EUR/USD',
  'GBP/USD',
  'USD/JPY',
  'USD/CHF',
  'AUD/USD',
  'USD/CAD',
  'NZD/USD',
  'EUR/GBP',
  'EUR/JPY',
  'GBP/JPY',
];

interface TradeDayFormProps {
  trades: Trade[];
  onTradesUpdate: (trades: Trade[]) => void;
}

export const TradeDayForm = ({ trades, onTradesUpdate }: TradeDayFormProps) => {
  const addTrade = () => {
    const now = new Date();
    const timeString = now.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });

    onTradesUpdate([
      ...trades,
      {
        id: Math.random().toString(),
        time: timeString,
        isProfit: true,
        amount: '',
        pair: '',
        isExpanded: true,
      },
    ]);
  };

  const removeTrade = (id: string) => {
    onTradesUpdate(trades.filter((trade) => trade.id !== id));
  };

  const updateTrade = (id: string, field: string, value: any) => {
    onTradesUpdate(
      trades.map((trade) =>
        trade.id === id ? { ...trade, [field]: value } : trade
      )
    );
  };

  const toggleExpand = (id: string) => {
    onTradesUpdate(
      trades.map((trade) =>
        trade.id === id ? { ...trade, isExpanded: !trade.isExpanded } : trade
      )
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Trades du jour</h3>
        <Button onClick={addTrade} variant="outline" size="sm">
          <Plus className="mr-2 h-4 w-4" />
          Ajouter un trade
        </Button>
      </div>

      {trades.map((trade, index) => (
        <div key={index} className="space-y-4">
          <Card className="rounded-xl border border-border/50 p-6 pt-4 dark:bg-gradient-to-b dark:from-[#3650e1]/5 dark:to-[#983eed]/15 dark:backdrop-blur-sm">
            <div className="mb-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleExpand(trade.id)}
                >
                  {trade.isExpanded ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </Button>
                <span className="font-medium">
                  {trade.pair || 'Nouveau trade'} - {trade.time}
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeTrade(trade.id)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {trade.isExpanded && (
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Heure</Label>
                  <Input
                    type="time"
                    value={trade.time}
                    onChange={(e) =>
                      updateTrade(trade.id, 'time', e.target.value)
                    }
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Paire</Label>
                  <Select
                    value={trade.pair}
                    onValueChange={(value) =>
                      updateTrade(trade.id, 'pair', value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner une paire" />
                    </SelectTrigger>
                    <SelectContent>
                      {PAIRS.map((pair) => (
                        <SelectItem key={pair} value={pair}>
                          {pair}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Résultat</Label>
                  <div className="flex gap-4">
                    <div className="flex overflow-hidden rounded-xl border">
                      <Button
                        variant={trade.isProfit ? 'default' : 'outline'}
                        onClick={() => updateTrade(trade.id, 'isProfit', true)}
                        className={`rounded-l-xl rounded-r-none border-0 ${
                          trade.isProfit
                            ? 'bg-green-500 hover:bg-green-600'
                            : 'hover:bg-green-500/10'
                        }`}
                      >
                        Profit
                      </Button>
                      <div className="w-px bg-border" />
                      <Button
                        variant={!trade.isProfit ? 'default' : 'outline'}
                        onClick={() => updateTrade(trade.id, 'isProfit', false)}
                        className={`rounded-l-none rounded-r-xl border-0 ${
                          !trade.isProfit
                            ? 'bg-red-500 hover:bg-red-600'
                            : 'hover:bg-red-500/10'
                        }`}
                      >
                        Loss
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Montant</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      {trade.isProfit ? '+' : '-'}
                    </span>
                    <Input
                      type="number"
                      value={trade.amount}
                      onChange={(e) =>
                        updateTrade(trade.id, 'amount', e.target.value)
                      }
                      className="pl-8"
                      placeholder="Montant"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tradingViewUrl">Lien TradingView</Label>
                  <Input
                    id="tradingViewUrl"
                    placeholder="https://www.tradingview.com/chart/..."
                    value={trade.tradingViewUrl || ''}
                    onChange={(e) =>
                      updateTrade(trade.id, 'tradingViewUrl', e.target.value)
                    }
                  />
                </div>

                {trade.tradingViewUrl && (
                  <div className="space-y-2">
                    <Label>Preview</Label>
                    <div className="flex items-center gap-2">
                      <TradingViewWidget imageUrl={trade.tradingViewUrl} />
                    </div>
                  </div>
                )}
              </div>
            )}
          </Card>
        </div>
      ))}
    </div>
  );
};
