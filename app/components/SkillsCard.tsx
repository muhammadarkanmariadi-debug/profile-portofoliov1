import React from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'

interface SkillsCardProps {
  skillName: string
  iconUrl: string
}

const SkillsCard = ({ skillName, iconUrl }: SkillsCardProps) => {
  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -5 }}
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className='group flex flex-col justify-center items-center bg-surface border border-border hover:border-primary/50 shadow-lg hover:shadow-primary/20 w-28 h-28 sm:w-32 sm:h-32 md:w-36 md:h-36 rounded-3xl transition-all duration-300  cursor-target'
    >
      <div className='flex items-center justify-center w-full h-full p-6'>
        <Image
          src={iconUrl}
          alt={skillName}
          width={64}
          height={64}
          className='transition-transform duration-300 group-hover:scale-110 object-contain w-full h-full'
        />
      </div>
    </motion.div>
  )
}

export default SkillsCard