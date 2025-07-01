'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowRight, Calendar, TrendingUp } from 'lucide-react';

import { Button, buttonVariants } from '@/components/ui/button';
import { DockDemo } from '@/components/dock-demo';
import LineChart from '@/components/line-chart';
import { TradingCalendar } from '@/components/dashboard/calendar';
import { BackgroundEffects } from '@/components/background-effects';

const MotionLink = motion(Link);

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function Dashboard() {
  const [hasTradingPlan, setHasTradingPlan] = React.useState(false);
  const router = useRouter();

  useEffect(() => {
    const tradingPlans = JSON.parse(
      localStorage.getItem('tradingPlans') || '[]'
    );
    setHasTradingPlan(tradingPlans.length > 0);
  }, []);

  return (
    <>
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -left-1/4 -top-1/4 h-1/2 w-1/2 animate-pulse rounded-full bg-indigo-700 opacity-30 blur-[100px] filter"></div>
        <div className="absolute -bottom-1/4 -right-1/4 h-1/2 w-1/2 animate-pulse rounded-full bg-purple-700 opacity-30 blur-[100px] filter"></div>
        <div className="animate-spin-slow absolute left-1/2 top-1/2 h-full w-full -translate-x-1/2 -translate-y-1/2 transform rounded-full bg-gradient-to-br from-indigo-500/10 to-purple-500/10 blur-[100px] filter"></div>
      </div>

      <div className="container relative z-10 flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
        <DockDemo hasTradingPlan={hasTradingPlan} />
      </div>
      {/* <BackgroundEffects /> */}
      <motion.div
        className="relative z-10 mx-auto flex w-[94%] flex-col flex-wrap gap-4 px-4 py-5 lg:flex-row"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        transition={{ duration: 0.5 }}
      >
        {/* <motion.div
          className="w-full lg:flex-1 min-w-[250px] max-w-auto lg:max-w-[200px]"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Sidebar
            setActiveTab={function (tab: string): void {
              throw new Error("Function not implemented.")
            }}
          />
        </motion.div> */}

        <motion.div
          className="w-full lg:flex-1"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="max-w-auto mt-10 w-full">
            {hasTradingPlan ? (
              <div className="flex flex-col gap-4">
                <TradingCalendar />
              </div>
            ) : (
              <div className="flex min-h-[70vh] w-full flex-col items-center justify-center p-4">
                <h1 className="mt-2 w-full max-w-[700px] px-4 text-center text-base font-normal text-gray-500 sm:text-lg md:text-xl">
                  Vous n&apos;avez pas encore enregistré de plan de trading.
                  <br />
                  <br />
                  Afin de commencer à utiliser Trade Talk.AI, veuillez
                  enregistrer ci-dessous un plan de trading.
                </h1>
                <MotionLink
                  href="dashboard/trading-plan"
                  className="mt-10 w-full cursor-pointer rounded-3xl bg-gradient-to-r from-indigo-500 to-purple-500 p-4 px-8 text-xl font-semibold text-white transition-all duration-300 ease-in-out hover:scale-105 sm:w-auto"
                  whileHover={{
                    scale: 1.05,
                    boxShadow: '0 0 15px rgba(139, 92, 246, 0.5)',
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  Enregistrer un plan de trading
                </MotionLink>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </>
  );
}
