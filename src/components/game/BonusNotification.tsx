import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";

interface BonusNotificationProps {
  show: boolean;
  bonusAmount: number;
  onComplete: () => void;
}

export const BonusNotification = ({ show, bonusAmount, onComplete }: BonusNotificationProps) => {
  const [isVisible, setIsVisible] = useState(show);

  useEffect(() => {
    if (show) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
        onComplete();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [show, onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ scale: 0, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0, opacity: 0, y: -20 }}
          transition={{ type: "spring", duration: 0.5 }}
          className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50"
        >
          <div className="bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-500 text-white px-8 py-4 rounded-2xl shadow-2xl border-4 border-white/30 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <Sparkles className="w-8 h-8 animate-pulse" />
              <div className="text-center">
                <div className="text-2xl font-bold">BONUS!</div>
                <div className="text-sm">+{bonusAmount} Target Gems</div>
              </div>
              <Sparkles className="w-8 h-8 animate-pulse" />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
