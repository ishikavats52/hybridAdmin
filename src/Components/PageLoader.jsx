import React from 'react';
import { motion } from 'framer-motion';

const PageLoader = () => {
    return (
        <div className="flex items-center justify-center h-full w-full min-h-[500px]">
            {/* Outer Ring */}
            <motion.div
                className=" rounded-full neu-flat flex items-center justify-center"
                animate={{
                    boxShadow: [
                        "5px 5px 10px #d1d9e6, -5px -5px 10px #ffffff",
                        "inset 5px 5px 10px #d1d9e6, inset -5px -5px 10px #ffffff",
                        "5px 5px 10px #d1d9e6, -5px -5px 10px #ffffff"
                    ]
                }}
                transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
            >
                {/* Inner Spinning Indicator */}
                <motion.div
                    className="w-12 h-12 rounded-full border-4 border-blue-200 border-t-blue-600"
                    animate={{ rotate: 360 }}
                    transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                />
            </motion.div>
        </div>
    );
};

export default PageLoader;
