import React, { useState } from 'react'
import SearchCompanies from './SearchCompanies'
import UpcomingCompanies from './UpcomingCompanies'

const Upcoming = ({ companies = [], loading = false }) => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const filteredCompanies = companies.filter((company) => {
    const matchesSearch =
      company.name.toLowerCase().includes(search.toLowerCase()) ||
      company.role.toLowerCase().includes(search.toLowerCase()) ||
      company.location.toLowerCase().includes(search.toLowerCase()) ||
      (company.skills && company.skills.some(s => s.toLowerCase().includes(search.toLowerCase())));

    const matchesCategory =
      category === "All" ||
      (company.category && company.category.toLowerCase() === category.toLowerCase()) ||
      company.role.toLowerCase().includes(category.toLowerCase());

    return matchesSearch && matchesCategory;
  });

  return (
    <div>
    <div className='font-bold flec-col h-20 w-85 mt-10 ml-30'>
     <h1 className='font-bold text-white text-3xl'>Upcoming Companies</h1>
     <h6 className='font-bold text-white '>Browse All Placement Opportunities</h6>
    </div>
    <SearchCompanies search={search} setSearch={setSearch} category={category} setCategory={setCategory} />
    <UpcomingCompanies companies={filteredCompanies} loading={loading} />
    </div>
  )
}

export default Upcoming