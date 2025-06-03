"use client"
import React, { useState } from 'react'
import { motion } from "framer-motion"
import { ArrowDownRight } from 'lucide-react'
import MainContainer from './MainContainer'
import { templates } from '@/data/templates'
import useSelected from '@/hooks/useSelected'


const TemplateSearch = () => {


    const [ searchQuery, setSearchQuery ] = useState("")
    const { selected } = useSelected()


    const filteredTemplates = Object.entries(templates).filter(([key]) =>
        key.toLowerCase().replace(/-/g, ' ').includes(searchQuery.toLowerCase())
    );


  return (
    <motion.div>
        <div className={`justify-center pb-16 relative w-full ${selected ? 'hidden' : 'flex'}`}>
            <motion.div
                 className="relative w-full max-w-md"
            
            >
                <motion.input
                    type='text'
                    placeholder='Search template'
                    value={searchQuery}
                    onChange={ (e) => setSearchQuery(e.target.value)}
                    className='rounded-3xl '
                />

                <motion.span
                    className="bg-white rounded-full p-1 text-black absolute"
                >
                    <ArrowDownRight  className='w-4 h-4'/>
                </motion.span>

                
            </motion.div>
        </div>
        {
            filteredTemplates.length < 1 ? <div className='min-h-[30vh] max-sm:min-h-[50vh]'><p>No templates found</p></div>
            : <MainContainer templates={Object.fromEntries(filteredTemplates)}/>
        }
    </motion.div>
  )
}

export default TemplateSearch