import React, { useState } from 'react'
import { motion } from "framer-motion"
import { ArrowDownRight } from 'lucide-react'
import MainContainer from './MainContainer'
import { templates } from '@/data/templates'


const TemplateSearch = () => {


    const [ searchQuery, setSearchQuery ] = useState("")

    const filteredTemplates = Object.entries(templates).filter(([key]) =>
        key.toLowerCase().replace(/-/g, ' ').includes(searchQuery.toLowerCase())
    );


  return (
    <motion.div>
        <div>
            <motion.div>
                <motion.input
                    type='text'
                    placeholder='Search template'
                    value={searchQuery}
                    onChange={ (e) => setSearchQuery(e.target.value)}
                    className='rounded-3xl '
                />

                <motion.span>
                    <ArrowDownRight  className='w-4 h-4'/>
                </motion.span>

                
            </motion.div>
        </div>
        {
            filteredTemplates.length < 1 ? <div className='min-h-[30vh] max-sm:min-h-[50vh]'><p>No templates found</p></div>
            : <MainContainer />
        }
    </motion.div>
  )
}

export default TemplateSearch