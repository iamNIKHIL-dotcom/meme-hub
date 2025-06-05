import useSelected from '@/hooks/useSelected';
import { Template } from '@/types/templates';
import { AnimatePresence,motion } from 'framer-motion';
import React from 'react'
import TemplateSelector from './TemplateSelector';
import MemeEditor from './MemeEditor';


type TemplateKey = string;

type MainContainerProps = {
  templates : Record<string, Template>;
};

const MainContainer = ({templates} : MainContainerProps) => {

  const { selected, setSelected } = useSelected();
  const handleSelect = (key : string ) =>{
    if(key in templates){
      setSelected(key as TemplateKey);
    }
  };

  return (
    <div className='"max-w-5xl max-sm:w-full mx-auto p-4 max-sm:p-1'>
      <AnimatePresence mode='wait'>
          {!selected ? (
            <motion.div 
              key = "selector"
              initial= {{ opacity:0 ,y:20 }}
              animate = {{opacity : 1, y : 0}}
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
            <div>
              { selected && templates[selected] ? (
                <MemeEditor template= {templates[selected]}
                            onReset= {() => setSelected("")} 
                />

              ) : (
                <div
                 className='text-center text-lg'
                 >
                  template not found,try again
                </div>
              )}
            </div>
          )
          }
      </AnimatePresence>
    </div>
  )
}

export default MainContainer