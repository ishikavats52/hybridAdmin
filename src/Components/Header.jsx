import React from 'react';
import { Bell, User, Menu } from 'lucide-react';

function Header({ toggleSidebar }) {
  return (
    <header className="flex justify-between items-center py-4 px-6 bg-white border-b border-slate-200 shadow-sm z-40 sticky top-0">

      <div className="flex items-center gap-4">
        <button onClick={toggleSidebar} className="p-2 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors">
          <Menu size={20} />
        </button>
      </div>

      <div className="flex items-center gap-4">
        {/* <button className="relative p-2 rounded-full hover:bg-slate-100 text-slate-500 transition-colors">
          <Bell size={20} />
          <span className="absolute top-1 right-2 h-2 w-2 bg-red-500 rounded-full border border-white"></span>
        </button> */}

        <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
          <div className="text-right hidden md:block">
            <p className="text-sm font-semibold text-slate-700">Admin User</p>
            <p className="text-xs text-slate-500">Super Admin</p>
          </div>
          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 border border-slate-200 shadow-sm">
            <User size={20} />
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
