import React from 'react'
import { Target } from 'lucide-react';

const Perfectmatch = () => {
  return (
    <div className=' h-30 w-300 mt-10 ml-35'>
    
    <div className='flex gap-3 '>
       <Target  size={40} className=" text-purple-500" />
       <h1 className='text-white font-bold text-3xl'> Find Your Perfect Match</h1>
       </div>
       <h1 className='text-gray-500 mt-2'>Companies ranked by match score based on your profile</h1>
    </div>
  )
}

export default Perfectmatch