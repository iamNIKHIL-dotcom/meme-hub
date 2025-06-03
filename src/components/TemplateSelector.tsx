'use client';

import React from 'react';
import { Template } from '@/types/templates';

import { motion, AnimatePresence } from 'framer-motion';

type TemplateSelectorProps = {
    templates: Record<string, Template>;
    onSelect: (key: string) => void;
};

export default function TemplateSelector({ templates, onSelect }: TemplateSelectorProps) {
    return (
        <section>

            
        </section>
    );
}