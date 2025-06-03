import useSelected from '@/hooks/useSelected';
import { Template } from '@/types/templates';
import { AnimatePresence,motion } from 'framer-motion';
import React from 'react'
import TemplateSelector from './TemplateSelector';


type TemplateKey = string;

type MainContainerProps = {
  templates : Record<string, Template>;
};

const MainContainer = ({templates} : MainContainerProps) => {

  const { selected, setselected } = useSelected();
  const handleSelect = (key : string ) =>{
    if(key in templates){
      setselected(key as TemplateKey);
    }
  };

  return (
    <div>
      <AnimatePresence mode='wait'>
          {!selected ? (
            <motion.div 
              key = "selector"
              initial= {{ opacity:0 ,y:20 }}
              animate {{opacity : 0, y : 0}}
              exit={{ opacity : 0, y : -20}}
              transition={{
                            duration: 0.4,
                            ease: [0.22, 1, 0.36, 1]
                        }}
            >
              <TemplateSelector templates={templates}
                            onSelect={handleSelect}/>
            </motion.div>
          ): (
            <></>
          )
          }
      </AnimatePresence>
    </div>
  )
}

export default MainContainer