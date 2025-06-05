'use client';

import React from 'react';
import { Template } from '@/types/templates';

import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

type TemplateSelectorProps = {
    templates: Record<string, Template>;
    onSelect: (key: string) => void;
};

export default function TemplateSelector({ templates, onSelect }: TemplateSelectorProps) {
    return (
        <section className='grid grid-cols-3 max-sm:grid-cols-1 gap-6 grid-flow-dense'>
            <AnimatePresence mode="popLayout">

                {Object.entries(templates).map(([key, tpl], index) => (
                    <motion.div
                        key={key}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{
                            duration: 0.3,
                            delay: index * 0.05,
                            ease: [0.22, 1, 0.36, 1]
                        }}

                        onClick={() => onSelect(key)}
                    >
                        {/* change div to motion.div */}
                        <motion.div 
                            whileHover={{ scale: 1.02}}
                            transition={{ duration : 0.2 }}
                        className='relative aspect-square'>
                            <Image
                                src={tpl.image}
                                alt={key}
                                fill // Specify width
                                
                                className=" object-cover rounded-2xl shadow-xl/20"
                                loading='lazy'
                            />

                        </motion.div>
                        <p
                         className='text-center text-lg font-medium mt-2 capitalize'
                         >
                            {key.replace(/-/g, " ")}
                        </p>

                    </motion.div>

                ))}
            </AnimatePresence>


        </section>
    );
}