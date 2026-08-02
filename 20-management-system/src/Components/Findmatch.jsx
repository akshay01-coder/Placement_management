import React from 'react'
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Findmatch = () => {
  return (
   <div className='bg-indigo-950 h-25 w-328 ml-29 mt-15 rounded-2xl relative p-2'>

  <h1 className='font-bold text-3xl text-white'>
    Find Your Perfect Match
  </h1>

  <h1 className='mt-2 text-white'>
    Discover companies that match your profile and skills
  </h1>

 <Link to="/findmatch"> <button className='bg-purple-700 px-4 py-2 rounded-lg absolute right-5 top-1/2 -translate-y-1/2 w-45 flex gap-2 active:scale-90'>
    <h1 className='font-bold ml-2'>FIND MATCH</h1>
    <ArrowRight />  
  </button> </Link>

</div>

  )
}

export default Findmatch