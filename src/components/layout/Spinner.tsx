'use client'

import { motion } from 'framer-motion'

const LoadingSpinner = () => {
    return (
        <div className="container flex items-center justify-center p-[40px] rounded-[8px]">
            <motion.div
                className='spinner'
                animate={{ rotate: 360 }}
                transition={{
                    duration: 0.5,
                    repeat: Infinity,
                    ease: 'easeIn'
                }}
            />
            <StyleSheet />
        </div>
    )
}
function StyleSheet() {
    return (
        <style>
            {`
            .spinner {
                width: 50px;
                height: 50px;
                border-radius: 50%;
                border: 4px solid #ccc;
                border-top-color: #ff0040;
                will-change: transform;
            }
            `}
        </style>
    )
}

export default LoadingSpinner