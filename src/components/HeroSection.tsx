import React from 'react'

const HeroSection = () => {
  return (
    <section className='justify-center pt-12 pb-8'>
        <div className='flex flex-col gap-4'>
            <h1>
                <span>Generate memes in seconds <span>Seconds</span></span>
            </h1>
            <p className='text-lg md:text-xl text-muted-foreground text-center'>
                without dealing with a messy UI
            </p>
        </div>
    </section>
  )
}

export default HeroSection