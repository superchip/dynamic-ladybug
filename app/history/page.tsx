"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import HistoryList from "@/components/HistoryList";
import { getEntries } from "@/lib/storage";
import { EmotionEntry } from "@/types";

export default function HistoryPage() {
  const [entries, setEntries] = useState<EmotionEntry[]>([]);

  const load = () => setEntries(getEntries());

  useEffect(() => {
    load();
  }, []);

  return (
    <main className="min-h-screen px-4 py-16 max-w-xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-4 mb-10"
      >
        <Link href="/" className="text-white/40 hover:text-white/70 transition text-sm">
          ← back
        </Link>
        <h1 className="text-2xl font-bold text-white">History</h1>
      </motion.div>

      <HistoryList entries={entries} onUpdate={load} />
    </main>
  );
}
