
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard, Users, GraduationCap, School, Banknote,
    CalendarCheck, Settings, LogOut, ChevronDown, ChevronRight,
    UserCog, Building2, UsersRound, FileText, CreditCard, Key, ClipboardList,
    ShieldCheck, Bell, Activity, UserPlus, Shield, Mail, Calendar, MapPin, List, Car, AlertCircle, User
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Sidebar = ({ isOpen, toggleSidebar }) => {
    const location = useLocation();
    const navigate = useNavigate();

    const adminUser = JSON.parse(localStorage.getItem('adminUser') || '{}');

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
        navigate('/login');
    };
    // Initialize with the top-level group managed expanded
    const [expandedGroups, setExpandedGroups] = useState(['finance']);

    const toggleGroup = (groupId) => {
        setExpandedGroups(prev =>
            prev.includes(groupId)
                ? prev.filter(id => id !== groupId)
                : [...prev, groupId]
        );
    };

    const isActive = (path) => location.pathname === path;

    // Helper to check if any child of a group is active
    const isGroupActive = (item) => {
        if (item.path && isActive(item.path)) return true;
        if (item.subMenus) {
            return item.subMenus.some(subItem => isGroupActive(subItem));
        }
        return false;
    };

    const menuGroups = [
        {
            id: 'dashboard',
            title: 'Dashboard',
            icon: LayoutDashboard,
            path: '/',
            type: 'single'
        },
        {
            id: 'user-management',
            title: 'User Management',
            icon: Users,
            type: 'group',
            subMenus: [
                { title: 'Passengers', path: '/passengers', icon: User },
                { title: 'Drivers', path: '/drivers', icon: UserCog },
            ]
        },
        {
            id: 'ride-management',
            title: 'Ride Management',
            icon: MapPin,
            type: 'group',
            subMenus: [
                { title: 'Live Rides', path: '/rides/live', icon: Activity },
                { title: 'Pool Management', path: '/rides/pools', icon: List },
                { title: 'Ride History', path: '/rides/history', icon: CalendarCheck },
                { title: 'Disputes', path: '/rides/disputes', icon: AlertCircle },
            ]
        },
        {
            id: 'payments',
            title: 'Payments & Earnings',
            icon: Banknote,
            type: 'group',
            subMenus: [
                { title: 'Driver Payouts', path: '/payments/payouts', icon: CreditCard },
                { title: 'Transactions', path: '/payments/transactions', icon: FileText },
            ]
        },
    ];

    // Recursive render function for menu items
    const renderMenuItem = (item, level = 0) => {
        // Level 0 = Top Level, Level 1 = Inside Group, Level 2 = Nested Group

        // Case 1: Simple Link Item
        if (!item.subMenus) {
            const active = isActive(item.path);
            return (
                <li key={item.path || item.title}>
                    <Link
                        to={item.path}
                        className={`flex items-center gap-4 rounded-xl transition-all duration-300
              ${level === 0 ? 'px-4 py-3' : 'px-4 py-2 text-sm'}
              ${level > 0 ? 'ml-0' : ''}
              ${active
                                ? 'neu-pressed text-blue-600 font-semibold'
                                : 'text-slate-500 hover:text-blue-600'
                            } `}
                    >
                        <item.icon size={level === 0 ? 20 : 16} />
                        <span className="font-medium">{item.title}</span>
                        {active && <motion.div layoutId="active-dot" className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-600" />}
                    </Link>
                </li>
            );
        }

        // Case 2: Group Item (Collapsible)
        const isExpanded = expandedGroups.includes(item.id);
        const hasActiveChild = isGroupActive(item);
        const GroupIcon = item.icon;

        return (
            <li key={item.id}>
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        toggleGroup(item.id);
                    }}
                    className={`w-full flex items-center justify-between rounded-xl transition-all duration-300
            ${level === 0 ? 'px-4 py-3' : 'px-4 py-2 text-sm'}
            ${(hasActiveChild || isExpanded) && level === 0 ? 'neu-pressed text-blue-600' : 'text-slate-500 hover:text-blue-600'}
            ${level > 0 && isExpanded ? 'text-blue-600' : ''}
`}
                >
                    <div className="flex items-center gap-3">
                        <GroupIcon size={level === 0 ? 20 : 16} />
                        <span className="font-medium">{item.title}</span>
                    </div>
                    {isExpanded ? (
                        <ChevronDown size={14} className="opacity-70" />
                    ) : (
                        <ChevronRight size={14} className="opacity-70" />
                    )}
                </button>

                {/* Render Children */}
                <AnimatePresence>
                    {isExpanded && (
                        <motion.ul
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className={`mt-2 space-y-1 ${level === 0 ? 'ml-4 pl-2 border-l border-white/50' : 'ml-4 pl-2 border-l border-white/50'} `}
                        >
                            {item.subMenus.map(subItem => renderMenuItem(subItem, level + 1))}
                        </motion.ul>
                    )}
                </AnimatePresence>
            </li>
        );
    };



    return (
        <motion.div
            initial={{ x: -250 }}
            animate={{ x: 0 }}
            transition={{ type: "easeInOut", stiffness: 80 }}

            className={`h-screen w-72 bg-[#eef2f6] flex flex-col fixed left-0 top-0 z-50 transition-transform duration-300 rounded-r-3xl neu-flat-sm ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>

            <div className="p-6 border-b border-white/50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-gradient-to-br from-blue-600 to-blue-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
                        <GraduationCap size={24} strokeWidth={3} />
                    </div>
                    <div >
                        <h1 className="text-xl font-bold text-slate-800 leading-none">EduAdmin</h1>
                        <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">Management</p>
                    </div>
                </div>
                <button onClick={toggleSidebar} className="lg:hidden text-slate-400 hover:text-slate-600">
                    <ChevronRight className="rotate-180" size={24} />
                </button>
            </div>

            <nav className="flex-1 overflow-y-auto py-6 px-4 scrollbar-hide">
                <ul className="space-y-2">
                    {menuGroups.map(group => renderMenuItem(group, 0))}
                </ul>
            </nav>

            <div className="p-4 border-t border-white/50">
                <div
                    className="neu-flat rounded-2xl p-3 flex items-center gap-3 cursor-pointer group hover:opacity-90 transition-opacity"
                    onClick={handleLogout}
                    title="Logout"
                >
                    <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold shadow-md">
                        {adminUser?.name?.charAt(0)?.toUpperCase() || 'A'}
                    </div>
                    <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-bold text-slate-800 truncate">{adminUser?.name || 'Admin User'}</h4>
                        <p className="text-xs text-slate-500 truncate">{adminUser?.email || 'admin@hybridride.com'}</p>
                    </div>
                    <LogOut size={18} className="text-slate-400 group-hover:text-red-500 transition-colors" />
                </div>
            </div>
        </motion.div>
    );
};

export default Sidebar;
