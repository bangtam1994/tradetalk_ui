"use client"

import React from "react"
import Link from "next/link"
import { motion, useScroll, useTransform } from "framer-motion"
import { ArrowRight, Baseline, BookOpen, Code, Github } from "lucide-react"

import { siteConfig } from "@/config/site"
import { buttonVariants } from "@/components/ui/button"

const MotionLink = motion(Link)

// @ts-ignore
const FeatureCard = ({ feature, icon: Icon, delay, text }) => (
  <motion.div
    className="bg-white/5 backdrop-blur-xl rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out border border-white/10"
    whileHover={{
      scale: 1.05,
      rotateY: 15,
      borderColor: "rgba(255,255,255,0.2)",
    }}
    whileTap={{ scale: 0.95 }}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
  >
    <Icon className="w-12 h-12 mb-4 text-indigo-400" />
    <h3 className="text-xl font-bold mb-2 dark:text-white text-indigo-500">{feature}</h3>
    <p className="dark:text-gray-300 text-gray-600">
      {text}
    </p>
  </motion.div>
)

const ScrollProgress = () => {
  const { scrollYProgress } = useScroll()
  const width = useTransform(scrollYProgress, [0, 1], ["0%", "100%"])

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 z-50"
      style={{ scaleX: width, transformOrigin: "0%" }}
    />
  )
}

export default function AnimatedLanding() {
  return (
    <div className="relative min-h-screen overflow-hidden text-white">
      {/* <ScrollProgress /> */}

      {/* Enhanced background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 bg-indigo-700 rounded-full filter blur-[100px] opacity-30 animate-pulse -z-10"></div>
        <div className="absolute -bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-purple-700 rounded-full filter blur-[100px] opacity-30 animate-pulse -z-10"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-full filter blur-[100px] animate-spin-slow -z-10"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 mt-5 lg:mt-0">
        <section className="container min-h-screen flex flex-col justify-center items-center gap-8 pb-8 pt-6 md:py-10">
          <motion.div
            className="flex max-w-[980px] flex-col items-center gap-4 text-center"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <motion.h1
              className="text-5xl font-extrabold leading-tight tracking-tighter md:text-7xl bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            >
              Elève ton trading spirit avec Trade Talk.AI
            </motion.h1>

            <motion.p
              className="max-w-[700px] text-xl text-gray-500 mt-2 font-normal"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              Trade Talk.AI est une plateforme qui vous permet de journaliser
              vos trades et de suivre votre progression avec la puissance de
              l&apos;IA.
            </motion.p>
          </motion.div>

          <motion.div
            className="flex gap-6"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <MotionLink
              href="/dashboard"
              className={
                buttonVariants({ size: "lg", variant: "default" }) +
                " bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold px-8 py-4 rounded-xl"
              }
              whileHover={{
                scale: 1.05,
                boxShadow: "0 0 15px rgba(139, 92, 246, 0.5)",
              }}
              whileTap={{ scale: 0.95 }}
            >
              Commencer
              <ArrowRight className="ml-2 h-5 w-5" />
            </MotionLink>
            <MotionLink
              target="_blank"
              rel="noreferrer"
              href={siteConfig.links.github}
              className={
                buttonVariants({ variant: "outline", size: "lg" }) +
                " border-2 border-white/20 dark:text-white text-indigo-500 font-semibold px-8 py-4 rounded-xl"
              }
              whileHover={{ scale: 1.05, borderColor: "rgba(255,255,255,0.5)" }}
              whileTap={{ scale: 0.95 }}
            >
              <Github className="mr-2 h-5 w-5" />
              <span>GitHub</span>
            </MotionLink>
          </motion.div>

          <motion.div
            className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1 }}
          >
            <FeatureCard feature="Journal" icon={BookOpen} delay={1.2} text="Un journal de trading facile à utiliser"/>
            <FeatureCard feature="Psychologie" icon={Baseline} delay={1.4} text="Des conseils pour améliorer votre psychologie de trading"/>
            <FeatureCard feature="Coaching" icon={Code} delay={1.6} text="Une IA mentor pour améliorer votre trading et votre mindset"/>
          </motion.div>
        </section>
      </div>
    </div>
  )
}
