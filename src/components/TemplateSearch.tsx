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
                    className="rounded-3xl py-2 px-4 w-full  border border-white/20 focus:outline-none focus:ring-2 focus:ring-[#6a7bd1] "
                    whileFocus={{
                            boxShadow: "0 0 0 2px rgba(106,123,209,0.5), 0 4px 24px 0px rgba(106,123,209,0.7), 0 0 0 0 transparent",
                        }}
                />

                <motion.span
                    className="bg-white rounded-full p-1.5 text-black absolute right-2 top-1/2 -translate-y-1/2 flex items-center justify-center shadow-md"
                >
                    <ArrowDownRight  className='w-4 h-4'/>
                </motion.span>

                
            </motion.div>
        </div>
        {
            filteredTemplates.length < 1 ? <div className='min-h-[30vh] max-sm:min-h-[50vh]'><p className='text-center'>No templates found</p></div>
            : <MainContainer templates={Object.fromEntries(filteredTemplates)}/>
        }
    </motion.div>
  )
}

export default TemplateSearch