'use client'
import React from 'react'
import { toggleTheme } from '../context/ToggleTheme'

const Themetoggle = () => {
  return (
    <button
      className='bottom-5 left-5 fixed bg-white shadow-lg px-4 py-2 rounded-md font-semibold text-black  cursor-target'
      onClick={() => toggleTheme()}
    >
      Theme
    </button>
  )
}

export default Themetoggle
