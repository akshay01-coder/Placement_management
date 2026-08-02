import React from 'react'
import { Search } from 'lucide-react';

const SearchCompanies = ({ search, setSearch, category, setCategory }) => {

  return (
    <div>
      <div className='bg-indigo-950 h-20 w-330 rounded-2xl ml-32 mt-10 flex'>

        <div className='ml-8 mt-1.7 relative flex items-center gap-2 text-gray-400'>
          <Search />

          <input className='border p-2 rounded-2xl h-13 w-250 text-white bg-transparent outline-none border-white/20'
            type="text"
            placeholder="Search drives by name, role, location, or skills..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className='flex gap-2 ml-4'>
            <button
              onClick={() => setCategory("All")}
              className={`h-8 w-18 rounded-xl font-bold text-xs active:scale-95 transition-all duration-300 cursor-pointer ${
                category === "All"
                  ? "bg-pink-600 text-white shadow-lg"
                  : "bg-white/10 text-gray-300 hover:bg-white/20"
              }`}
            >
              All
            </button>
            
            <button
              onClick={() => setCategory("Tech")}
              className={`h-8 w-18 rounded-xl font-bold text-xs active:scale-95 transition-all duration-300 cursor-pointer ${
                category === "Tech"
                  ? "bg-pink-600 text-white shadow-lg"
                  : "bg-white/10 text-gray-300 hover:bg-white/20"
              }`}
            > 
              Tech
            </button>

            <button
              onClick={() => setCategory("Sales")}
              className={`h-8 w-18 rounded-xl font-bold text-xs active:scale-95 transition-all duration-300 cursor-pointer ${
                category === "Sales"
                  ? "bg-pink-600 text-white shadow-lg"
                  : "bg-white/10 text-gray-300 hover:bg-white/20"
              }`}
            >
              Sales
            </button>
          </div>         
        </div>
      </div>
    </div>
  )
}

export default SearchCompanies