import React from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { toggleTheme } from '../context/ToggleTheme'
const Anchor = () => {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 1500) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [isScrolled])
  return (
    <div className='cursor-target'>
      {isScrolled && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          whileTap={{ opacity: 0.8, y: 40 }}
          transition={{ duration: 0.5 }}
          className='right-10 bottom-10 fixed'
        >
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className='bg-white shadow-md p-2 rounded-full text-black transition cursor-pointer'
          >
            <Image
              src='/assets/images/rocket.png'
              alt='Scroll to top'
              className='w-6 h-6'
              width={24}
              height={24}
            />
          </button>
        </motion.div>
      )}
    </div>
  )
}

export default Anchor
// window.scrollTo({ top: 0, behavior: 'smooth' })