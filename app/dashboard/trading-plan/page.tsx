"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { AnimatePresence, motion } from "framer-motion"
import { ArrowLeft, ArrowLeftCircle, ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

const stepVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 1000 : -1000,
    opacity: 0,
    height: "auto",
  }),
  center: {
    x: 0,
    opacity: 1,
    height: "auto",
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 1000 : -1000,
    opacity: 0,
    height: "auto",
  }),
}

export default function TradingPlan() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [direction, setDirection] = useState(0)
  const [data, setData] = useState({
    currencyPairs: "",
    strategy: "",
    riskPerTrade: "",
    maxDailyLoss: "",
    monthlyGoal: "",
    yearlyGoal: "",
    startTime: "",
    endTime: "",
    journal: "",
    tradingRules: "",
    review: "",
  })

  const nextStep = () => {
    console.log("nextStep")
    setDirection(1)
    setStep((prev) => prev + 1)
  }

  const prevStep = () => {
    setDirection(-1)
    setStep((prev) => prev - 1)
  }

  console.log("step", step)
  console.log("data", data)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const tradingPlan = {
      ...data,
      createdAt: new Date().toISOString(),
      id: crypto.randomUUID()
    }
    
    const existingPlans = JSON.parse(localStorage.getItem('tradingPlans') || '[]')
    
    const updatedPlans = [...existingPlans, tradingPlan]
    
    localStorage.setItem('tradingPlans', JSON.stringify(updatedPlans))
    
    router.push('/dashboard')
  }

  return (
    <div className="min-h-screen">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-purple-700 rounded-full filter blur-[100px] opacity-30 animate-pulse -z-10"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-full filter blur-[100px] animate-spin-slow -z-10"></div>
      </div>

      <div className="container relative z-10">
        <Button
          variant="ghost"
          className="mt-10 rounded-2xl hover:bg-white/10 transition-all duration-300"
          onClick={() => router.push("/dashboard")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour
        </Button>

        <motion.div
          className="flex flex-col items-center justify-center min-h-[80vh] w-full p-2 "
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          transition={{ duration: 0.5 }}
        >
          <div className="w-full max-w-2xl dark:bg-white/5 bg-indigo-500/5 backdrop-blur-xl rounded-2xl p-8 shadow-lg border border-indigo-500/10 dark:border-white/10">
            <h1 className="text-3xl font-bold text-center mb-8 ">
              Créer votre plan de trading
            </h1>

            <div className="flex justify-center mb-8">
              <div className="flex space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      step === i ? "bg-indigo-500 scale-125" : "bg-white/20"
                    }`}
                  />
                ))}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="relative overflow-hidden min-h-[400px]">
                <AnimatePresence custom={direction} initial={false} mode="wait">
                  {step === 1 && (
                    <motion.div
                      key="step1"
                      custom={direction}
                      variants={stepVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 30,
                        height: { duration: 0.2 },
                      }}
                      className="absolute inset-0 space-y-6"
                    >
                      <div className="space-y-3">
                        <Label
                          htmlFor="currencyPairs"
                          className=" text-lg"
                        >
                          Paires de devises
                        </Label>
                        <Select
                          value={data.currencyPairs}
                          onValueChange={(value) =>
                            setData({ ...data, currencyPairs: value })
                          }
                        >
                          <SelectTrigger className="dark:bg-white/5   rounded-xl">
                            <SelectValue placeholder="Sélectionnez vos paires de devises" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="eurusd">EUR/USD</SelectItem>
                            <SelectItem value="gbpusd">GBP/USD</SelectItem>
                            <SelectItem value="usdjpy">USD/JPY</SelectItem>
                            <SelectItem value="audusd">AUD/USD</SelectItem>
                            <SelectItem value="usdcad">USD/CAD</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-3">
                        <Label
                          htmlFor="strategy"
                          className=" text-lg"
                        >
                          Stratégie de trading
                        </Label>
                        <Textarea
                          id="strategy"
                          placeholder="Décrivez votre stratégie de trading (scalping, day trading, swing trading)..."
                          className="dark:bg-white/5   rounded-xl min-h-[120px]"
                          value={data.strategy}
                          onChange={(e) =>
                            setData({ ...data, strategy: e.target.value })
                          }
                        />
                      </div>
                    </motion.div>
                  )}

                  {step === 2 && (
                    <motion.div
                      key="step2"
                      custom={direction}
                      variants={stepVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 30,
                        height: { duration: 0.2 },
                      }}
                      className="absolute inset-0 space-y-6"
                    >
                      <div className="space-y-3">
                        <Label htmlFor="risk" className=" text-lg">
                          Gestion du risque
                        </Label>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label
                              htmlFor="riskPerTrade"
                              className=""
                            >
                              Risque par trade (%)
                            </Label>
                            <Input
                              id="riskPerTrade"
                              type="number"
                              placeholder="Ex: 1-2%"
                              className="dark:bg-white/5   rounded-xl"
                              value={data.riskPerTrade}
                              onChange={(e) =>
                                setData({
                                  ...data,
                                  riskPerTrade: e.target.value,
                                })
                              }
                            />
                          </div>
                          <div className="space-y-2">
                            <Label
                              htmlFor="maxDailyLoss"
                              className=""
                            >
                              Perte maximale journalière (%)
                            </Label>
                            <Input
                              id="maxDailyLoss"
                              type="number"
                              placeholder="Ex: 5%"
                              className="dark:bg-white/5   rounded-xl"
                              value={data.maxDailyLoss}
                              onChange={(e) =>
                                setData({
                                  ...data,
                                  maxDailyLoss: e.target.value,
                                })
                              }
                            />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <Label htmlFor="goals" className=" text-lg">
                          Objectifs
                        </Label>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="monthlyGoal" >
                              Objectif mensuel (%)
                            </Label>
                            <Input
                              id="monthlyGoal"
                              type="number"
                              placeholder="Ex: 5%"
                              className="dark:bg-white/5  rounded-xl"
                              value={data.monthlyGoal}
                              onChange={(e) =>
                                setData({
                                  ...data,
                                  monthlyGoal: e.target.value,
                                })
                              }
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="yearlyGoal" >
                              Objectif annuel (%)
                            </Label>
                            <Input
                              id="yearlyGoal"
                              type="number"
                              placeholder="Ex: 50%"
                              className="dark:bg-white/5  rounded-xl"
                              value={data.yearlyGoal}
                              onChange={(e) =>
                                setData({
                                  ...data,
                                  yearlyGoal: e.target.value,
                                })
                              }
                            />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {step === 3 && (
                    <motion.div
                      key="step3"
                      custom={direction}
                      variants={stepVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 30,
                        height: { duration: 0.2 },
                      }}
                      className="absolute inset-0 space-y-6"
                    >
                      <div className="space-y-3">
                        <Label
                          htmlFor="tradingHours"
                          className="text-lg"
                        >
                          Horaires de trading
                        </Label>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="startTime" >
                              Heure de début
                            </Label>
                            <Input
                              id="startTime"
                              type="time"
                              className="dark:bg-white/5  rounded-xl m-1"
                              value={data.startTime}
                              onChange={(e) =>
                                setData({ ...data, startTime: e.target.value })
                              }
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="endTime" >
                              Heure de fin
                            </Label>
                            <Input
                              id="endTime"
                              type="time"
                              className=" dark:bg-white/5 rounded-xl focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0 cursor-pointer"
                              value={data.endTime}
                              onChange={(e) =>
                                setData({ ...data, endTime: e.target.value })
                              }
                            />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <Label htmlFor="journal" className="text-lg">
                          Journal de trading
                        </Label>
                        <Textarea
                          id="journal"
                          placeholder="Notes sur vos trades, analyses post-trade..."
                          className="dark:bg-white/5  rounded-xl min-h-[120px]"
                          value={data.journal}
                          onChange={(e) =>
                            setData({ ...data, journal: e.target.value })
                          }
                        />
                      </div>
                    </motion.div>
                  )}

                  {step === 4 && (
                    <motion.div
                      key="step4"
                      custom={direction}
                      variants={stepVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 30,
                        height: { duration: 0.2 },
                      }}
                      className="absolute inset-0 space-y-6"
                    >
                      <div className="space-y-3">
                        <Label
                          htmlFor="tradingRules"
                          className="text-lg"
                        >
                          Règles de trading
                        </Label>
                        <Textarea
                          id="tradingRules"
                          placeholder="Listez vos règles de trading (entrée, sortie, gestion des positions)..."
                          className="dark:bg-white/5  rounded-xl min-h-[120px]"
                          value={data.tradingRules}
                          onChange={(e) =>
                            setData({ ...data, tradingRules: e.target.value })
                          }
                        />
                      </div>

                      <div className="space-y-3">
                        <Label htmlFor="review" className="text-lg">
                          Revue hebdomadaire
                        </Label>
                        <Textarea
                          id="review"
                          placeholder="Plan de revue hebdomadaire de vos performances..."
                          className="dark:bg-white/5  rounded-xl min-h-[120px]"
                          value={data.review}
                          onChange={(e) =>
                            setData({ ...data, review: e.target.value })
                          }
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="flex justify-between pt-4">
                <Button
                  type="button"
                  variant="ghost"
                  className="rounded-xl hover:bg-white/10 transition-all duration-300"
                  onClick={prevStep}
                  disabled={step === 1}
                >
                  <ArrowLeftCircle className="mr-2 h-4 w-4" />
                  Précédent
                </Button>

                {step < 4 ? (
                  <Button
                    type="button"
                    className="bg-gradient-to-r from-indigo-500 to-purple-500 font-semibold py-2 px-6 rounded-xl hover:opacity-90 transition-all duration-300 hover:scale-[1.02]"
                    onClick={nextStep}
                  >
                    Suivant
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                ) : (
                  <Button
                    onClick={handleSubmit}
                    type="button"
                    className="bg-gradient-to-r from-indigo-500 to-purple-500 font-semibold py-2 px-6 rounded-xl hover:opacity-90 transition-all duration-300 hover:scale-[1.02]"
                  >
                    Enregistrer le plan
                  </Button>
                )}
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
