import useSelected from '@/hooks/useSelected';
import { Template } from '@/types/templates';
import { AnimatePresence, motion } from 'framer-motion';
import React from 'react'
import TemplateSelector from './TemplateSelector';
import MemeEditor from './MemeEditor';
import CustomTemplateCreator from './CustomTemplateCreator';

type TemplateKey = string;

type MainContainerProps = {
  templates: Record<string, Template>;
};

const MainContainer = ({ templates }: MainContainerProps) => {
  const { selected, setSelected } = useSelected();
  const [showCustomCreator, setShowCustomCreator] = React.useState(false);

  const handleSelect = (key: string) => {
    if (key in templates) {
      setSelected(key as TemplateKey);
    }
  };

  return (
    <div className='max-w-5xl max-sm:w-full mx-auto p-4 max-sm:p-1'>
      <AnimatePresence mode='wait'>
        {!selected ? (
          <motion.div
            key="selector"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{
              duration: 0.4,
              ease: [0.22, 1, 0.36, 1]
            }}
          >
            {showCustomCreator ? (
              <CustomTemplateCreator onBack={() => setShowCustomCreator(false)} />
            ) : (
              <>
                <TemplateSelector templates={templates} onSelect={handleSelect} />
                <div className="mt-8 text-center">
                  <button
                    onClick={() => setShowCustomCreator(true)}
                    className="bg-[#6a7bd1] text-white py-2 px-6 rounded-lg hover:bg-[#5a6bc1] transition-colors"
                  >
                    Create Your Own Template
                  </button>
                </div>
              </>
            )}
          </motion.div>
        ) : (
          <div>
            {selected && templates[selected] ? (
              <MemeEditor
                template={templates[selected]}
                onReset={() => setSelected("")}
              />
            ) : (
              <div className='text-center text-lg'>
                template not found, try again
              </div>
            )}
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default MainContainer