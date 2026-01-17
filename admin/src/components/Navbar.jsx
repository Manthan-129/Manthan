import React from 'react'
import {assets} from '../assets/assets'

const Navbar = ({setToken}) => {
  return (
    <div className="flex items-center justify-between px-[4%] py-2 border-b border-gray-300 bg-white shadow-sm">
        <img className="w-36 sm:w-44" src={assets.logo} alt="Brand Tag" />
        <button onClick={() => setToken("")} className="bg-gray-600 text-white px-5 py-2 sm:px-7 sm:py-2 rounded-full text-xs sm:text-sm hover:bg-gray-700 transition-all">Logout</button>
    </div>
  )
}

export default Navbar