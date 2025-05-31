"use client"

import useSelected from "@/hooks/useSelected"


const HeroSection = () => {

  const { selected } = useSelected()


  return (
    <section className={`justify-center pt-12 pb-8 relative ${selected ? 'hidden' : 'flex'}`}>
        <div className='flex flex-col gap-4'>
            <h1 className="text-center">
                <span>Generate memes in <span>Seconds</span></span>
            </h1>
            <p className='text-lg md:text-xl text-muted-foreground text-center'>
                without dealing with a messy UI
            </p>
        </div>
    </section>
  )
}

export default HeroSection