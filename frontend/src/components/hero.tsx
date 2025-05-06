
import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Hero() {
  return (
    <section className="flex flex-col items-center justify-center min-h-screen text-center space-y-6">
        <motion.h1
          className="text-4xl md:text-6xl font-extrabold"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Prisoner's Dilemma
        </motion.h1>

        <motion.p
          className="text-lg md:text-xl max-w-2xl text-gray-300"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          A psychological game of trust, betrayal, and logic. Inspired by Game
          Theory and popularized by experiments and thinkers like John Nash.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Link href="/start" passHref>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="outline"
                className="text-lg px-8 py-4 rounded-2xl border-white text-white hover:bg-white hover:text-black transition-all duration-300 shadow-md cursor-pointer"
              >
                Get Started
              </Button>
            </motion.div>
          </Link>
        </motion.div>
      </section>
  )
}