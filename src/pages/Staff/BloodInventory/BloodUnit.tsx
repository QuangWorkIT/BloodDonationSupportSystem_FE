import { motion } from "framer-motion";

interface BloodInventoryCardProps {
  type: string;
  unit: number;
  maxUnit?: number;
}

export const BloodUnit = ({ type, unit, maxUnit = 200 }: BloodInventoryCardProps) => {
  const percentage = Math.min(unit / maxUnit, 1);

  // Color based on stock level
  const getStockColor = (p: number) => {
    if (p < 0.25) return "#ef4444"; // red-500
    if (p < 0.6) return "#f59e42"; // amber-500
    return "#22c55e"; // green-500
  };
  const stockColor = getStockColor(percentage);

  return (
        <motion.div
      whileHover={{ scale: 1.05, y: -5 }}
      className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-4 flex flex-col items-center justify-center text-center cursor-pointer"
      style={{ aspectRatio: '1 / 1.2', minWidth: 110 }}
    >
      <div className="relative flex flex-col items-center justify-center mb-2">
        {/* Circular progress background */}
        <svg width={64} height={64} className="block">
          <circle
            cx={32}
            cy={32}
            r={28}
            fill="#f3f4f6"
            stroke="#e5e7eb"
            strokeWidth={4}
          />
          {/* Progress arc */}
          <motion.circle
            cx={32}
            cy={32}
            r={28}
            fill="none"
            stroke={stockColor}
            strokeWidth={6}
            strokeDasharray={2 * Math.PI * 28}
            strokeDashoffset={2 * Math.PI * 28 * (1 - percentage)}
            strokeLinecap="round"
            initial={{ strokeDashoffset: 2 * Math.PI * 28 }}
            animate={{ strokeDashoffset: 2 * Math.PI * 28 * (1 - percentage) }}
          transition={{ duration: 1 }}
            style={{ filter: `drop-shadow(0 2px 8px ${stockColor}33)` }}
          />
        </svg>
        {/* Centered blood type */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xl font-bold text-gray-800 drop-shadow-sm">{type}</span>
          <span className="text-xs text-gray-400">{Math.round(percentage * 100)}%</span>
        </div>
      </div>
      <div className="text-lg font-semibold text-gray-800 mb-0.5">{unit}</div>
      <div className="text-xs text-gray-500 uppercase tracking-wider">Đơn vị</div>
    </motion.div>
  );
};
