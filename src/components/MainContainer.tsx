import { Template } from '@/types/templates';
import React from 'react'



type MainContainerProps = {
  templates : Record<string, Template>;
};

const MainContainer = ({templates} : MainContainerProps) => {
  return (
    <div>MainContainer</div>
  )
}

export default MainContainer