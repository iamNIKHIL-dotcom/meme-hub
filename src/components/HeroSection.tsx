"use client"

import useSelected from "@/hooks/useSelected"


const HeroSection = () => {

  const { selected } = useSelected()


  return (
    <section className={`justify-center pt-12 pb-8 relative ${selected ? 'hidden' : 'flex'}`}>
        <div className='flex flex-col gap-4'>
            <h1 className="text-5xl md:text-[5rem] max-w-2xl tracking-tighter text-center font-regular">
                <span className="text-spektr-cyan-50 ">Generate memes in <span className="font-bold animate-gradient bg-gradient-to-r from-[#6a7bd1] via-[#8a9cf1] to-[#6a7bd1] pr-2 bg-clip-text text-transparent animate-gradient-flow">Seconds</span></span>
            </h1>
            <p className='text-lg md:text-xl leading-relaxed tracking-tight text-muted-foreground text-center'>
                without dealing with a messy UI
            </p>
        </div>
    </section>
  )
}

export default HeroSection