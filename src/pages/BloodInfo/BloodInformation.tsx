import { useState } from "react";
import { FaCheck } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

type BloodType = "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-";
type BloodComponent = "whole-blood" | "red-blood-cells" | "plasma" | "platelets";

interface CompatibilityInfo {
  donateTo: BloodType[];
  receiveFrom: BloodType[];
}

type BloodCompatibility = {
  [key in BloodType]: {
    [component in BloodComponent]: CompatibilityInfo;
  };
};

interface BloodTypeDistribution {
  type: BloodType;
  percentage: string;
  description: string;
}

const BloodInformation = () => {
  const [activeTab, setActiveTab] = useState<"blood-types" | "compatibility" | "donation-process">("blood-types");
  const [compatibilityType, setCompatibilityType] = useState<"whole-blood" | "blood-component">("whole-blood");
  const [selectedBloodType, setSelectedBloodType] = useState<BloodType>("A+");
  const [selectedComponent, setSelectedComponent] = useState<BloodComponent>("red-blood-cells");

  // Blood type distribution data
  const bloodTypeDistribution: BloodTypeDistribution[] = [
    { type: "O+", percentage: "38%", description: "Phổ biến nhất" },
    { type: "A+", percentage: "34%", description: "Phổ biến thứ hai" },
    { type: "B+", percentage: "9%", description: "Ít phổ biến" },
    { type: "AB+", percentage: "3%", description: "Hiếm nhất" },
    { type: "O-", percentage: "7%", description: "Nhóm máu hiến phổ quát" },
    { type: "A-", percentage: "6%", description: "Ít phổ biến" },
    { type: "B-", percentage: "2%", description: "Rất hiếm" },
    { type: "AB-", percentage: "1%", description: "Cực kỳ hiếm" },
  ];

  // Complete compatibility data for all blood types
  const compatibilityData: BloodCompatibility = {
    "A+": {
      "whole-blood": {
        donateTo: ["A+", "AB+"],
        receiveFrom: ["A+", "A-", "O+", "O-"],
      },
      "red-blood-cells": {
        donateTo: ["A+", "AB+"],
        receiveFrom: ["A+", "A-", "O+", "O-"],
      },
      plasma: {
        donateTo: ["A+", "A-", "O+", "O-"],
        receiveFrom: ["A+", "AB+"],
      },
      platelets: {
        donateTo: ["A+", "AB+"],
        receiveFrom: ["A+", "A-", "O+", "O-", "B+", "B-", "AB+", "AB-"],
      },
    },
    "A-": {
      "whole-blood": {
        donateTo: ["A+", "A-", "AB+", "AB-"],
        receiveFrom: ["A-", "O-"],
      },
      "red-blood-cells": {
        donateTo: ["A+", "A-", "AB+", "AB-"],
        receiveFrom: ["A-", "O-"],
      },
      plasma: {
        donateTo: ["A-", "O-"],
        receiveFrom: ["A+", "A-", "AB+", "AB-"],
      },
      platelets: {
        donateTo: ["A+", "A-", "AB+", "AB-"],
        receiveFrom: ["A-", "O-"],
      },
    },
    "B+": {
      "whole-blood": {
        donateTo: ["B+", "AB+"],
        receiveFrom: ["B+", "B-", "O+", "O-"],
      },
      "red-blood-cells": {
        donateTo: ["B+", "AB+"],
        receiveFrom: ["B+", "B-", "O+", "O-"],
      },
      plasma: {
        donateTo: ["B+", "B-", "O+", "O-"],
        receiveFrom: ["B+", "AB+"],
      },
      platelets: {
        donateTo: ["B+", "AB+"],
        receiveFrom: ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"],
      },
    },
    "B-": {
      "whole-blood": {
        donateTo: ["B+", "B-", "AB+", "AB-"],
        receiveFrom: ["B-", "O-"],
      },
      "red-blood-cells": {
        donateTo: ["B+", "B-", "AB+", "AB-"],
        receiveFrom: ["B-", "O-"],
      },
      plasma: {
        donateTo: ["B-", "O-"],
        receiveFrom: ["B+", "B-", "AB+", "AB-"],
      },
      platelets: {
        donateTo: ["B+", "B-", "AB+", "AB-"],
        receiveFrom: ["B-", "O-"],
      },
    },
    "AB+": {
      "whole-blood": {
        donateTo: ["AB+"],
        receiveFrom: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
      },
      "red-blood-cells": {
        donateTo: ["AB+"],
        receiveFrom: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
      },
      plasma: {
        donateTo: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
        receiveFrom: ["AB+"],
      },
      platelets: {
        donateTo: ["AB+"],
        receiveFrom: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
      },
    },
    "AB-": {
      "whole-blood": {
        donateTo: ["AB+", "AB-"],
        receiveFrom: ["A-", "B-", "AB-", "O-"],
      },
      "red-blood-cells": {
        donateTo: ["AB+", "AB-"],
        receiveFrom: ["A-", "B-", "AB-", "O-"],
      },
      plasma: {
        donateTo: ["A-", "B-", "AB-", "O-"],
        receiveFrom: ["AB+", "AB-"],
      },
      platelets: {
        donateTo: ["AB+", "AB-"],
        receiveFrom: ["A-", "B-", "AB-", "O-"],
      },
    },
    "O+": {
      "whole-blood": {
        donateTo: ["A+", "B+", "AB+", "O+"],
        receiveFrom: ["O+", "O-"],
      },
      "red-blood-cells": {
        donateTo: ["A+", "B+", "AB+", "O+"],
        receiveFrom: ["O+", "O-"],
      },
      plasma: {
        donateTo: ["O+", "O-"],
        receiveFrom: ["A+", "B+", "AB+", "O+"],
      },
      platelets: {
        donateTo: ["A+", "B+", "AB+", "O+"],
        receiveFrom: ["O+", "O-"],
      },
    },
    "O-": {
      "whole-blood": {
        donateTo: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
        receiveFrom: ["O-"],
      },
      "red-blood-cells": {
        donateTo: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
        receiveFrom: ["O-"],
      },
      plasma: {
        donateTo: ["O-"],
        receiveFrom: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
      },
      platelets: {
        donateTo: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
        receiveFrom: ["O-"],
      },
    },
  };

  const bloodTypes: BloodType[] = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
  const bloodComponents = [
    { name: "Máu Toàn Phần", value: "whole-blood" },
    { name: "Hồng Cầu", value: "red-blood-cells" },
    { name: "Huyết Tương", value: "plasma" },
    { name: "Tiểu Cầu", value: "platelets" },
  ];


  const currentCompatibilityInfo =
    compatibilityData[selectedBloodType][compatibilityType === "whole-blood" ? "whole-blood" : selectedComponent];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Navigation Toggle */}
      <div className="flex justify-center mb-8">
        <motion.div
          className="flex bg-white rounded-full shadow-sm border border-gray-200 overflow-hidden"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setActiveTab("blood-types")}
            className={`flex-1 px-6 py-2 text-sm font-medium cursor-pointer relative ${
              activeTab === "blood-types" ? "text-white" : "text-gray-700 hover:bg-gray-50"
            }`}
          >
            {activeTab === "blood-types" && (
              <motion.div
                layoutId="activeTab"
                className="absolute inset-0 bg-[#C14B53] z-0 rounded-full"
                initial={false}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
            <span className="relative z-10">Nhóm Máu</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setActiveTab("compatibility")}
            className={`flex-1 px-6 py-2 text-sm font-medium cursor-pointer relative ${
              activeTab === "compatibility" ? "text-white" : "text-gray-700 hover:bg-gray-50"
            }`}
          >
            {activeTab === "compatibility" && (
              <motion.div
                layoutId="activeTab"
                className="absolute inset-0 bg-[#C14B53] z-0 rounded-full"
                initial={false}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
            <span className="relative z-10">Tương Thích</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setActiveTab("donation-process")}
            className={`flex-1 px-6 py-2 text-sm font-medium cursor-pointer relative ${
              activeTab === "donation-process" ? "text-white" : "text-gray-700 hover:bg-gray-50"
            }`}
          >
            {activeTab === "donation-process" && (
              <motion.div
                layoutId="activeTab"
                className="absolute inset-0 bg-[#C14B53] z-0 rounded-full"
                initial={false}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
            <span className="relative z-10">Quy Trình Hiến</span>
          </motion.button>
        </motion.div>
      </div>

      {/* Conditional Rendering of Content */}
      <AnimatePresence mode="wait">
        {/* Blood types */}
        {activeTab === "blood-types" && (
          <motion.div
            key="blood-types"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-md shadow-sm p-8 border border-gray-200"
          >
            <h2 className="text-2xl font-bold text-[#C14B53] mb-6">Hiểu Về Các Nhóm Máu</h2>
            <p className="text-gray-700 mb-6">
              Tìm hiểu về các nhóm máu khác nhau và sự phân bố của chúng trong dân số.
            </p>

            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 mb-8">
              <h3 className="text-xl font-semibold mb-4 text-[#C14B53]">Nhóm máu là gì?</h3>
              <div className="bg-white p-4 rounded-md shadow-sm border border-gray-100 mb-4">
                <p className="text-gray-700">
                  Nhóm máu được xác định bởi sự có mặt hoặc vắng mặt của các kháng nguyên nhất định trên bề mặt hồng
                  cầu. Hai hệ thống phân loại chính là hệ thống ABO và hệ thống Rh.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-md shadow-sm border border-gray-100">
                  <h4 className="text-lg font-medium mb-2 text-[#C14B53]">Hệ Thống Nhóm Máu ABO</h4>
                  <p className="text-gray-700">
                    Hệ thống ABO phân loại máu thành bốn loại: A, B, AB và O, dựa trên sự hiện diện của kháng nguyên A
                    và B.
                  </p>
                </div>

                <div className="bg-white p-4 rounded-md shadow-sm border border-gray-100">
                  <h4 className="text-lg font-medium mb-2 text-[#C14B53]">Yếu Tố Rh</h4>
                  <p className="text-gray-700">
                    Yếu tố Rh là một kháng nguyên khác trên hồng cầu. Nếu có, nhóm máu là dương tính (+); nếu không có,
                    nó là âm tính (-).
                  </p>
                </div>
              </div>
            </div>

            <h3 className="text-xl font-semibold mb-6 text-[#C14B53]">Phân Bố Nhóm Máu</h3>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {bloodTypeDistribution.map((item) => (
                <motion.div
                  key={item.type}
                  whileHover={{ y: -5, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
                  className="bg-white rounded-lg shadow-md p-6 border border-gray-100 text-center"
                >
                  <div className="text-3xl font-bold text-[#C14B53] mb-2">{item.type}</div>
                  <div className="text-2xl font-semibold mb-1">{item.percentage}</div>
                  <div className="text-gray-600 text-sm">{item.description}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
        {/* Compatibility */}
        {activeTab === "compatibility" && (
          <motion.div
            key="compatibility"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-md shadow-sm p-8 border border-gray-200"
          >
            <h2 className="text-2xl font-bold text-[#C14B53] mb-6">Tương Thích Nhóm Máu</h2>
            <p className="text-gray-700 mb-6">Hiểu về các nhóm máu có thể hiến và nhận từ nhau.</p>

            {/* Tab selector */}
            <div className="flex justify-center mb-8">
              <motion.div className="flex bg-white rounded-full shadow-sm border border-gray-200 overflow-hidden">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setCompatibilityType("whole-blood")}
                  className={`flex-1 px-6 py-2 text-sm font-medium cursor-pointer relative ${
                    compatibilityType === "whole-blood" ? "text-white" : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {compatibilityType === "whole-blood" && (
                    <motion.div
                      layoutId="compatibilityTab"
                      className="absolute inset-0 bg-[#C14B53] z-0 rounded-full"
                      initial={false}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">Máu Toàn Phần</span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setCompatibilityType("blood-component")}
                  className={`flex-1 px-6 py-2 text-sm font-medium cursor-pointer relative ${
                    compatibilityType === "blood-component" ? "text-white" : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {compatibilityType === "blood-component" && (
                    <motion.div
                      layoutId="compatibilityTab"
                      className="absolute inset-0 bg-[#C14B53] z-0 rounded-full"
                      initial={false}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">Thành Phần Máu</span>
                </motion.button>
              </motion.div>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 mb-8">
              {compatibilityType === "whole-blood" ? (
                <div>
                  <h3 className="text-xl font-semibold mb-4 text-[#C14B53]">Tương Thích Máu Toàn Phần</h3>
                  <p className="text-gray-700 mb-6">Tìm hiểu nhóm máu nào tương thích để truyền máu toàn phần.</p>

                  {/* Blood type dropdown */}
                  <div className="mb-8 max-w-md mx-auto">
                    <label htmlFor="blood-type" className="block text-sm font-medium text-gray-700 mb-2">
                      Chọn Nhóm Máu
                    </label>
                    <select
                      id="blood-type"
                      value={selectedBloodType}
                      onChange={(e) => setSelectedBloodType(e.target.value as BloodType)}
                      className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#C14B53] focus:border-[#C14B53]"
                    >
                      {bloodTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Compatibility results */}
                  <div className="flex flex-col md:flex-row gap-6 justify-center">
                    {/* Can Donate To */}
                    <div className="flex-1 bg-white p-6 rounded-md shadow-sm border border-gray-100">
                      <h4 className="text-lg font-medium mb-4 text-[#C14B53]">Có Thể Hiến Cho</h4>
                      <div className="flex flex-wrap gap-2">
                        {currentCompatibilityInfo.donateTo.map((type: string) => (
                          <span
                            key={`donate-${type}`}
                            className="inline-flex items-center bg-gray-50 px-3 py-1 rounded"
                          >
                            <FaCheck className="text-green-500 mr-2" />
                            <span className="font-medium">{type}</span>
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Can Receive From */}
                    <div className="flex-1 bg-white p-6 rounded-md shadow-sm border border-gray-100">
                      <h4 className="text-lg font-medium mb-4 text-[#C14B53]">Có Thể Nhận Từ</h4>
                      <div className="flex flex-wrap gap-2">
                        {currentCompatibilityInfo.receiveFrom.map((type: string) => (
                          <span
                            key={`receive-${type}`}
                            className="inline-flex items-center bg-gray-50 px-3 py-1 rounded"
                          >
                            <FaCheck className="text-green-500 mr-2" />
                            <span className="font-medium">{type}</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  {compatibilityType === "blood-component" && (
                    <div>
                      <h3 className="text-xl font-semibold mb-4 text-[#C14B53]">Tương Thích Thành Phần Máu</h3>
                      <p className="text-gray-700 mb-6">
                        Tìm hiểu nhóm máu nào tương thích để truyền các thành phần máu cụ thể.
                      </p>

                      {/* Blood type and component dropdowns */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <div>
                          <label
                            htmlFor="component-blood-type"
                            className="block text-sm font-medium text-gray-700 mb-2"
                          >
                            Chọn Nhóm Máu
                          </label>
                          <select
                            id="component-blood-type"
                            value={selectedBloodType}
                            onChange={(e) => setSelectedBloodType(e.target.value as BloodType)}
                            className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#C14B53] focus:border-[#C14B53]"
                          >
                            {bloodTypes.map((type) => (
                              <option key={type} value={type}>
                                {type}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label htmlFor="blood-component" className="block text-sm font-medium text-gray-700 mb-2">
                            Chọn Thành Phần
                          </label>
                          <select
                            id="blood-component"
                            value={selectedComponent}
                            onChange={(e) => setSelectedComponent(e.target.value as BloodComponent)}
                            className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#C14B53] focus:border-[#C14B53]"
                          >
                            {bloodComponents.map((component) => (
                              <option key={component.value} value={component.value}>
                                {component.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* Compatibility results */}
                      <div className="flex flex-col md:flex-row gap-6 justify-center">
                        {/* Can Donate To */}
                        <div className="flex-1 bg-white p-6 rounded-md shadow-sm border border-gray-100">
                          <h4 className="text-lg font-medium mb-4 text-[#C14B53]">Có Thể Hiến Cho</h4>
                          <div className="flex flex-wrap gap-2">
                            {currentCompatibilityInfo.donateTo.map((type: string) => (
                              <span
                                key={`donate-${type}`}
                                className="inline-flex items-center bg-gray-50 px-3 py-1 rounded"
                              >
                                <FaCheck className="text-green-500 mr-2" />
                                <span className="font-medium">{type}</span>
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Can Receive From */}
                        <div className="flex-1 bg-white p-6 rounded-md shadow-sm border border-gray-100">
                          <h4 className="text-lg font-medium mb-4 text-[#C14B53]">Có Thể Nhận Từ</h4>
                          <div className="flex flex-wrap gap-2">
                            {currentCompatibilityInfo.receiveFrom.map((type: string) => (
                              <span
                                key={`receive-${type}`}
                                className="inline-flex items-center bg-gray-50 px-3 py-1 rounded"
                              >
                                <FaCheck className="text-green-500 mr-2" />
                                <span className="font-medium">{type}</span>
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Special notes section */}
            <div className="bg-blue-50 p-6 rounded-lg border border-blue-100">
              <h3 className="text-xl font-semibold mb-3 text-[#C14B53]">Lưu Ý Đặc Biệt Về Tương Thích</h3>
              <p className="text-gray-700 mb-4">Thông tin quan trọng về tương thích nhóm máu.</p>

              <div className="space-y-4">
                <div className="bg-white p-4 rounded-md shadow-sm border border-gray-100">
                  <h4 className="font-medium text-[#C14B53] mb-2">Người Hiến Phổ Quát</h4>
                  <p className="text-gray-700 text-sm">
                    Nhóm máu O- được gọi là người hiến phổ quát vì có thể truyền cho bệnh nhân có bất kỳ nhóm máu nào
                    trong trường hợp khẩn cấp. Điều này làm cho người hiến nhóm máu O- đặc biệt quý giá cho các trường
                    hợp truyền máu khẩn cấp khi không có thời gian xác định nhóm máu của bệnh nhân.
                  </p>
                </div>

                <div className="bg-white p-4 rounded-md shadow-sm border border-gray-100">
                  <h4 className="font-medium text-[#C14B53] mb-2">Người Nhận Phổ Quát</h4>
                  <p className="text-gray-700 text-sm">
                    Nhóm máu AB+ được gọi là người nhận phổ quát vì những người có nhóm máu này có thể nhận máu từ bất
                    kỳ người hiến nào. Tuy nhiên, họ chỉ có thể hiến máu cho những người có nhóm máu AB+ khác.
                  </p>
                </div>

                <div className="bg-white p-4 rounded-md shadow-sm border border-gray-100">
                  <h4 className="font-medium text-[#C14B53] mb-2">Tương Thích Theo Thành Phần</h4>
                  <p className="text-gray-700 text-sm">
                    Quy tắc tương thích có thể khác nhau đối với các thành phần máu khác nhau. Ví dụ, tương thích huyết
                    tương về cơ bản là ngược lại với tương thích hồng cầu. Huyết tương AB là người hiến huyết tương phổ
                    quát, trong khi huyết tương O có nhiều kháng thể và chỉ có thể truyền cho người nhận nhóm máu O.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
        {/* Donation process */}
        {activeTab === "donation-process" && (
          <motion.div
            key="donation-process"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-md shadow-sm p-8 border border-gray-200"
          >
            <h2 className="text-2xl font-bold text-[#C14B53] mb-6">Quy Trình Hiến Máu</h2>
            <p className="text-gray-700 mb-6">Những điều cần biết khi hiến máu tại cơ sở của chúng tôi.</p>

            {/* First Row - Before Donation and Eligibility Requirements */}
            <div className="flex flex-col md:flex-row gap-6 mb-8">
              <div className="flex-1 bg-gray-50 p-6 rounded-lg border border-gray-200">
                <h3 className="text-xl font-semibold mb-4 text-[#C14B53]">Trước Khi Hiến Máu</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <FaCheck className="text-green-500 mt-1 mr-2 flex-shrink-0" />
                    <span>Ngủ ngon trước ngày hiến máu.</span>
                  </li>
                  <li className="flex items-start">
                    <FaCheck className="text-green-500 mt-1 mr-2 flex-shrink-0" />
                    <span>Ăn bữa ăn lành mạnh trong vòng 3 giờ trước khi hiến.</span>
                  </li>
                  <li className="flex items-start">
                    <FaCheck className="text-green-500 mt-1 mr-2 flex-shrink-0" />
                    <span>Uống nhiều nước trước và sau khi hiến.</span>
                  </li>
                  <li className="flex items-start">
                    <FaCheck className="text-green-500 mt-1 mr-2 flex-shrink-0" />
                    <span>Mang theo giấy tờ tùy thân hợp lệ và danh sách thuốc đang dùng.</span>
                  </li>
                  <li className="flex items-start">
                    <FaCheck className="text-green-500 mt-1 mr-2 flex-shrink-0" />
                    <span>Mặc quần áo thoải mái có thể xắn tay lên được.</span>
                  </li>
                </ul>
              </div>

              <div className="flex-1 bg-gray-50 p-6 rounded-lg border border-gray-200">
                <h3 className="text-xl font-semibold mb-4 text-[#C14B53]">Yêu Cầu Đủ Điều Kiện</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <FaCheck className="text-green-500 mt-1 mr-2 flex-shrink-0" />
                    <span>Ít nhất 17 tuổi (16 tuổi với sự đồng ý của phụ huynh ở một số khu vực).</span>
                  </li>
                  <li className="flex items-start">
                    <FaCheck className="text-green-500 mt-1 mr-2 flex-shrink-0" />
                    <span>Cân nặng ít nhất 50kg.</span>
                  </li>
                  <li className="flex items-start">
                    <FaCheck className="text-green-500 mt-1 mr-2 flex-shrink-0" />
                    <span>Có sức khỏe tổng quát tốt.</span>
                  </li>
                  <li className="flex items-start">
                    <FaCheck className="text-green-500 mt-1 mr-2 flex-shrink-0" />
                    <span>Chưa hiến máu toàn phần trong vòng 56 ngày qua.</span>
                  </li>
                  <li className="flex items-start">
                    <FaCheck className="text-green-500 mt-1 mr-2 flex-shrink-0" />
                    <span>Đáp ứng các tiêu chí đủ điều kiện cụ thể cho một số loại hiến máu.</span>
                  </li>
                </ul>
              </div>
            </div>
            {/* Second Row - Donation Process and Types */}
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1 bg-gray-50 p-6 rounded-lg border border-gray-200">
                <h3 className="text-xl font-semibold mb-4 text-[#C14B53]">Quy Trình Hiến Máu</h3>

                <div className="space-y-4">
                  <div className="bg-white p-4 rounded-md shadow-sm border border-gray-100">
                    <h4 className="font-medium text-[#C14B53]">Đăng Ký</h4>
                    <p className="text-gray-700 text-sm mt-2">
                      Bạn sẽ hoàn thành mẫu đăng ký và xem tài liệu hướng dẫn. Nhân viên sẽ kiểm tra giấy tờ tùy thân và
                      trả lời mọi câu hỏi.
                    </p>
                  </div>

                  <div className="bg-white p-4 rounded-md shadow-sm border border-gray-100">
                    <h4 className="font-medium text-[#C14B53]">Kiểm Tra Sức Khỏe</h4>
                    <p className="text-gray-700 text-sm mt-2">
                      Nhân viên y tế sẽ kiểm tra nhiệt độ, mạch, huyết áp và nồng độ hemoglobin. Bạn cũng sẽ hoàn thành
                      bảng câu hỏi sức khỏe bảo mật.
                    </p>
                  </div>

                  <div className="bg-white p-4 rounded-md shadow-sm border border-gray-100">
                    <h4 className="font-medium text-[#C14B53]">Hiến Máu</h4>
                    <p className="text-gray-700 text-sm mt-2">
                      Quá trình hiến máu thực tế mất khoảng 8-10 phút. Một lần hiến máu toàn phần là khoảng một đơn vị
                      máu. Bạn sẽ nghỉ ngơi 10-15 phút sau đó với đồ ăn nhẹ.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex-1 bg-gray-50 p-6 rounded-lg border border-gray-200">
                <h3 className="text-xl font-semibold mb-4 text-[#C14B53]">Các Loại Hiến Máu</h3>

                <div className="space-y-4">
                  <div className="bg-white p-4 rounded-md shadow-sm border border-gray-100">
                    <h4 className="font-medium text-[#C14B53]">Hiến Máu Toàn Phần</h4>
                    <p className="text-gray-700 text-sm mt-2">
                      Loại hiến máu phổ biến nhất, thu khoảng một đơn vị máu. Mất khoảng 8-10 phút. Có thể hiến mỗi 56
                      ngày.
                    </p>
                  </div>

                  <div className="bg-white p-4 rounded-md shadow-sm border border-gray-100">
                    <h4 className="font-medium text-[#C14B53]">Hiến Tiểu Cầu</h4>
                    <p className="text-gray-700 text-sm mt-2">
                      Chỉ thu tiểu cầu và trả lại các thành phần máu khác. Mất khoảng 2-3 giờ. Có thể hiến mỗi 7 ngày,
                      tối đa 24 lần/năm.
                    </p>
                  </div>

                  <div className="bg-white p-4 rounded-md shadow-sm border border-gray-100">
                    <h4 className="font-medium text-[#C14B53]">Hiến Huyết Tương</h4>
                    <p className="text-gray-700 text-sm mt-2">
                      Thu huyết tương và trả lại các thành phần máu khác. Mất khoảng 1-2 giờ. Có thể hiến mỗi 28 ngày.
                    </p>
                  </div>

                  <div className="bg-white p-4 rounded-md shadow-sm border border-gray-100">
                    <h4 className="font-medium text-[#C14B53]">Hiến Hồng Cầu Kép</h4>
                    <p className="text-gray-700 text-sm mt-2">
                      Thu hai đơn vị hồng cầu và trả lại huyết tương và tiểu cầu. Mất khoảng 30 phút. Có thể hiến mỗi
                      112 ngày.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BloodInformation;
