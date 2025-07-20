import { useEffect } from 'react'
import BloodInformation from './BloodInformation'
import BloodDonationNavbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { motion } from 'framer-motion'
import { FaTint } from 'react-icons/fa';

function BloodInfoPage() {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])
  return (
    <div className="overflow-x-hidden">
      <BloodDonationNavbar />
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        {/* Animated Gradient Background */}
        <motion.div
          initial={{ backgroundPosition: '0% 50%', backgroundSize: '180% 180%' }}
          animate={{
            backgroundPosition: [
              '0% 50%',
              '100% 60%',
              '80% 100%',
              '0% 50%'
            ],
            backgroundSize: [
              '180% 180%',
              '220% 200%',
              '200% 220%',
              '180% 180%'
            ]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute inset-0 bg-gradient-to-br from-[#C14B53] via-[#a83a42] to-[#7a2328] opacity-20 z-0"
        />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="inline-flex items-center justify-center w-20 h-20 bg-[#C14B53] rounded-full mb-6 shadow-lg"
          >
            <FaTint className="w-10 h-10 text-white" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-bold text-gray-900 mb-4"
          >
            Thông Tin Về Máu & Hiến Máu
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg text-gray-700 max-w-2xl mx-auto mb-8"
          >
            Khám phá các nhóm máu, sự tương thích và quy trình hiến máu với giao diện hiện đại, sinh động và dễ hiểu.
          </motion.p>
        </div>
      </section>
      <div className="-mt-16 mb-8">
        <BloodInformation />
      </div>
      <Footer />
    </div>
  )
}

export default BloodInfoPage
