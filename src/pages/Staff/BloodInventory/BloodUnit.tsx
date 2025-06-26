import { motion } from "framer-motion";

interface BloodInventoryCardProps {
  type: string;
  unit: number;
  maxUnit?: number;
}

export const BloodUnit = ({ type, unit, maxUnit = 200 }: BloodInventoryCardProps) => {
  const percentage = Math.min(unit / maxUnit, 1);

  return (
    <motion.div whileHover={{ scale: 1.03 }} className="w-33 h-43 rounded-xl shadow-md shadow-gray-500 bg-white flex flex-col items-center justify-between p-3">
      <div className="relative w-21 h-21 rounded-full overflow-hidden bg-pink-100 border border-gray-200 flex items-center justify-center">
        <motion.div
          className="absolute bottom-0 left-0 w-full bg-red-700"
          initial={{ height: 0 }}
          animate={{ height: `${percentage * 100}%` }}
          transition={{ duration: 1 }}
        />
        <div className="absolute inset-[7px] flex items-center justify-center text-gray-600 text-lg font-normal bg-white w-17 h-17 rounded-full">{type}</div>
      </div>
      <div className="text-2xl font-bold text-gray-800">{unit}</div>
      <div className="text-sm text-gray-500">Đơn vị</div>
    </motion.div>
  );
};
