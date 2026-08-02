import React from 'react'
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Eligible = () => {
  return (
    <div className='border border-black text-teal-50 h-18 w-328 mt-8 ml-29 rounded-2xl px-4 flex items-center justify-between'>
      
      <h1 className='text-2xl font-bold'>
        Eligible Companies
      </h1>

      <Link to="/upcoming"><button className='bg-purple-900 text-white h-10 w-28 rounded-lg flex items-center justify-center gap-2 active:scale-90 transition-transform duration-150'>
        <span className='font-bold'>VIEW</span>
        <ArrowRight size={18} />
      </button> </Link> 

    </div>
  )
}

export default Eligible