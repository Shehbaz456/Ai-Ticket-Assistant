import React from 'react'

function Navbar() {
  return (
    <div className="bg-base-100 shadow-md px-4">
      <div className="navbar max-w-7xl mx-auto">
        {/* Left: Brand */}
        <div className="flex-1">
          <a className=" text-xl font-bold text-primary">AI Ticket Agents 🤖 </a>
        </div>

        {/* Right: Desktop Nav & Avatar */}
        <div className="hidden md:flex items-center gap-4">
          <ul className="menu menu-horizontal px-1 font-medium text-base">
            <li><a>Home</a></li>
            <li><a>About</a></li>
            <li><a>Ticket Booking</a></li>
            <li><a>Fastag</a></li>
          </ul>


          {/* User Dropdown */}
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
              <div className="w-10 rounded-full">
                <img
                  alt="User avatar"
                  src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                />
              </div>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
            >
              <li><a className="justify-between">Profile <span className="badge">New</span></a></li>
              <li><a>Settings</a></li>
              <li><a className="text-error">Logout</a></li>
            </ul>
          </div>
        </div>

        {/* Mobile Nav */}
        <div className="dropdown md:hidden">
          <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
          >
            <li><a>Home</a></li>
            <li><a>About</a></li>
            <li><a>Ticket Booking</a></li>
            <li><a>Fastag</a></li>
            <li><a>Profile</a></li>
            <li><a>Settings</a></li>
            <li><a className="text-error">Logout</a></li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Navbar
