import React, { useState, useEffect } from 'react';
import {
    DollarSign, TrendingUp, TrendingDown,
    CreditCard, Download, Search, Filter,
    CheckCircle, XCircle, Clock, AlertTriangle,
    Wallet, ChevronDown, FileText, ArrowUpRight, ArrowDownLeft,
    PieChart, Activity
} from 'lucide-react';
import axios from 'axios';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

// --- Mock Data ---

const mockPayments = [];
// const mockWallets = []; // Removed as unused
const mockWithdrawals = [];
const mockRefunds = [];

const revenueData = [
    { name: 'Mon', revenue: 4000 },
    { name: 'Tue', revenue: 3000 },
    { name: 'Wed', revenue: 5000 },
    { name: 'Thu', revenue: 4500 },
    { name: 'Fri', revenue: 6000 },
    { name: 'Sat', revenue: 7500 },
    { name: 'Sun', revenue: 7000 },
];

// --- Components ---

const StatusBadge = ({ status }) => {
    const styles = {
        success: 'bg-emerald-100 text-emerald-700 border-emerald-200',
        approved: 'bg-emerald-100 text-emerald-700 border-emerald-200',
        failed: 'bg-rose-100 text-rose-700 border-rose-200',
        rejected: 'bg-rose-100 text-rose-700 border-rose-200',
        pending: 'bg-amber-100 text-amber-700 border-amber-200',
        refunded: 'bg-purple-100 text-purple-700 border-purple-200',
    };
    return (
        <span className={`px-2 py-1 rounded-full text-xs font-semibold uppercase tracking-wider border ${styles[status] || 'bg-slate-100 text-slate-700 border-slate-200'}`}>
            {status}
        </span>
    );
};

const PaymentManagement = ({ view = 'dashboard' }) => {
    const [refunds, setRefunds] = useState(mockRefunds);
    const [wallets, setWallets] = useState([]);
    const [passengerWallets, setPassengerWallets] = useState([]);
    const [withdrawals, setWithdrawals] = useState([]);
    const [financeData, setFinanceData] = useState({
        totalCollection: 0,
        totalCommission: 0,
        totalPayouts: 0,
        netProfit: 0
    });
    const [transactions, setTransactions] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('adminToken');
                const headers = { Authorization: `Bearer ${token}` };
                
                const [finRes, driverWalletRes, passengerWalletRes, withdrawalRes, transRes] = await Promise.all([
                    axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/admin/financial-overview`, { headers }),
                    axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/admin/driver-wallets`, { headers }),
                    axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/admin/passenger-wallets`, { headers }),
                    axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/wallet/admin/withdrawals`, { headers }),
                    axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/admin/transactions`, { headers })
                ]);

                if (finRes.data.success) setFinanceData(finRes.data.data);
                if (driverWalletRes.data.success) setWallets(driverWalletRes.data.data);
                if (passengerWalletRes.data.success) setPassengerWallets(passengerWalletRes.data.data);
                if (withdrawalRes.data.success) setWithdrawals(withdrawalRes.data.data);
                if (transRes.data.success) setTransactions(transRes.data.data);
            } catch (err) {
                console.error('Failed to fetch data:', err);
            }
        };

        fetchData();
    }, []);

    // Actions
    const handleWithdrawalAction = async (id, newStatus) => {
        if (window.confirm(`Are you sure you want to ${newStatus} this request?`)) {
            try {
                const token = localStorage.getItem('adminToken');
                // Mocking the approval for now since we don't have a specific endpoint yet, 
                // but we update local state to show it.
                setWithdrawals(withdrawals.map(w => w._id === id ? { ...w, status: newStatus } : w));
            } catch (err) {
                console.error(err);
            }
        }
    };

    // --- Views ---

    const renderPassengerWallets = () => (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                <h3 className="font-bold text-slate-900">Passenger Wallets</h3>
                <div className="text-sm text-slate-500 font-medium">Total: {passengerWallets.length}</div>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Passenger</th>
                            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Phone</th>
                            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Current Balance</th>
                            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Level</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {passengerWallets.map((wallet, idx) => (
                            <tr key={wallet.passengerId || idx} className="hover:bg-slate-50">
                                <td className="px-6 py-4">
                                    <div className="text-sm font-medium text-slate-900">{wallet.passengerName}</div>
                                    <div className="text-xs text-slate-500 font-mono">{wallet.passengerId}</div>
                                </td>
                                <td className="px-6 py-4 text-sm text-slate-600">{wallet.phone || 'N/A'}</td>
                                <td className="px-6 py-4 font-bold text-slate-900">₹{parseFloat(wallet.balance || 0).toLocaleString()}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${wallet.balance > 1000 ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-700'}`}>
                                        {wallet.balance > 1000 ? 'Premium' : 'Regular'}
                                    </span>
                                </td>
                            </tr>
                        ))}
                        {passengerWallets.length === 0 && (
                            <tr>
                                <td colSpan="4" className="px-6 py-10 text-center text-slate-400">No passenger wallets found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );

    const renderDriverWalletsWithHistory = () => (
        <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-6 border-b border-slate-100 bg-slate-50">
                    <h3 className="font-bold text-slate-900">Driver Balance Overview</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Driver</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Current Balance</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Total Earned</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Withdrawals</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {wallets.map((wallet, idx) => (
                                <tr key={wallet.driverId || idx} className="hover:bg-slate-50">
                                    <td className="px-6 py-4">
                                        <div className="text-sm font-medium text-slate-900">{wallet.driverName}</div>
                                        <div className="text-xs text-slate-500">{wallet.driverId}</div>
                                    </td>
                                    <td className="px-6 py-4 font-bold text-blue-600">₹{parseFloat(wallet.balance || 0).toLocaleString()}</td>
                                    <td className="px-6 py-4 text-sm text-emerald-600 font-bold">₹{parseFloat(wallet.totalEarned || 0).toLocaleString()}</td>
                                    <td className="px-6 py-4 text-sm text-slate-500">
                                        {withdrawals?.filter(w => w.driver?._id === wallet.driverId).length || 0} Requests
                                    </td>
                                </tr>
                            ))}
                            {wallets.length === 0 && (
                                <tr>
                                    <td colSpan="4" className="px-6 py-10 text-center text-slate-400">No driver wallets found</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-6 border-b border-slate-100 bg-slate-50">
                    <h3 className="font-bold text-slate-900">Driver Withdrawal Requests</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">ID</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Driver</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Amount</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Fee (2%)</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Net Pay</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Status</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Method</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Date</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {withdrawals.map(req => (
                                <tr key={req._id} className="hover:bg-slate-50">
                                    <td className="px-6 py-4 font-mono text-[10px] text-slate-400">{req._id.slice(-8)}</td>
                                    <td className="px-6 py-4 text-sm font-medium text-slate-900">{req.driver?.name}</td>
                                    <td className="px-6 py-4 text-sm text-slate-900">₹{req.amount}</td>
                                    <td className="px-6 py-4 text-sm text-rose-500">₹{req.fee}</td>
                                    <td className="px-6 py-4 text-sm font-bold text-emerald-600">₹{req.netAmount}</td>
                                    <td className="px-6 py-4"><StatusBadge status={req.status} /></td>
                                    <td className="px-6 py-4"><span className="text-[10px] bg-slate-100 px-2 py-1 rounded font-bold uppercase">{req.method}</span></td>
                                    <td className="px-6 py-4 text-xs text-slate-500">{new Date(req.createdAt).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 text-right">
                                        {req.status === 'pending' && (
                                            <div className="flex justify-end gap-2">
                                                <button onClick={() => handleWithdrawalAction(req._id, 'approved')} className="p-1 px-2 bg-emerald-600 text-white text-[10px] font-bold rounded">APPROVE</button>
                                                <button onClick={() => handleWithdrawalAction(req._id, 'rejected')} className="p-1 px-2 border border-slate-200 text-slate-600 text-[10px] font-bold rounded">REJECT</button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );

    const renderDashboard = () => (
        <div className="space-y-6">
            {/* KPI Cards - Platform Revenue E */}
            <h3 className="font-bold text-slate-800 text-lg">Platform Revenue</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
                    <div className="flex justify-between items-start mb-2">
                        <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Total Online Collection</p>
                        <CreditCard size={18} className="text-blue-500" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900">₹{financeData.totalCollection.toLocaleString()}</h3>
                </div>

                <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
                    <div className="flex justify-between items-start mb-2">
                        <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Total Commission Earned</p>
                        <DollarSign size={18} className="text-emerald-500" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900">₹{financeData.totalCommission.toLocaleString()}</h3>
                </div>

                <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
                    <div className="flex justify-between items-start mb-2">
                        <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Total Payouts to Drivers</p>
                        <Wallet size={18} className="text-purple-500" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900">₹{financeData.totalPayouts.toLocaleString()}</h3>
                </div>

                <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
                    <div className="flex justify-between items-start mb-2">
                        <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Recent Withdrawals</p>
                        <ArrowDownLeft size={18} className="text-rose-500" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900">₹{withdrawals.reduce((sum, w) => sum + (w.status === 'completed' || w.status === 'approved' ? w.amount : 0), 0).toLocaleString()}</h3>
                </div>

                <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 bg-gradient-to-br from-slate-900 to-slate-800 text-white">
                    <div className="flex justify-between items-start mb-2">
                        <p className="text-slate-300 text-xs font-bold uppercase tracking-wider">Net Profit</p>
                        <Activity size={18} className="text-emerald-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-white">₹{financeData.netProfit.toLocaleString()}</h3>
                </div>
            </div>

            {/* Revenue Chart */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <h3 className="font-bold text-slate-900 mb-6">Revenue Trend</h3>
                <div className="h-80 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={revenueData}>
                            <defs>
                                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
                            <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                            <Area type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );

    const renderTransactions = () => (
        <div className="space-y-6">
            {/* Transaction Filters */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex justify-between gap-4">
                <div className="relative w-72">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input type="text" placeholder="Search by ID, Name..." className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div className="flex gap-2">
                    <button className="px-4 py-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 text-sm font-medium flex items-center gap-2">
                        <Filter size={16} /> Filter
                    </button>
                    <button className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 flex items-center gap-2">
                        <Download size={16} /> Export
                    </button>
                </div>
            </div>

            {/* Payments Table - A */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                    <h3 className="font-bold text-slate-900">Recent Payments</h3>
                </div>
                <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Description</th>
                            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">User</th>
                            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Role</th>
                            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Date</th>
                            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Amount</th>
                            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Type</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {transactions.map((tx, idx) => (
                            <tr key={tx._id || idx} className="hover:bg-slate-50">
                                <td className="px-6 py-4 text-sm font-medium text-slate-900">{tx.description || 'Wallet Transaction'}</td>
                                <td className="px-6 py-4">
                                    <div className="text-sm font-medium text-slate-900">{tx.userName}</div>
                                    <div className="text-[10px] text-slate-400 font-mono">{tx.userId}</div>
                                </td>
                                <td className="px-6 py-4 text-xs uppercase font-bold text-slate-500">{tx.userRole}</td>
                                <td className="px-6 py-4 text-sm text-slate-500">{new Date(tx.timestamp).toLocaleString()}</td>
                                <td className={`px-6 py-4 font-bold ${tx.type === 'credit' ? 'text-emerald-600' : 'text-rose-600'}`}>
                                    {tx.type === 'credit' ? '+' : '-'}₹{tx.amount.toFixed(2)}
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${tx.type === 'credit' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                                        {tx.type}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Refund Management - D */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-6 border-b border-slate-100 bg-slate-50">
                    <h3 className="font-bold text-slate-900">Refund Management</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Refund ID</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Ride/Payment ID</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Passenger</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Reason</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Refund Amount</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Status</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase text-right">Date</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {refunds.map(refund => (
                                <tr key={refund.id} className="hover:bg-slate-50">
                                    <td className="px-6 py-4 font-mono text-xs text-slate-600">{refund.id}</td>
                                    <td className="px-6 py-4 font-mono text-xs text-blue-600">{refund.paymentId}</td>
                                    <td className="px-6 py-4 text-sm text-slate-900">{refund.passenger}</td>
                                    <td className="px-6 py-4 text-sm text-slate-600">{refund.reason}</td>
                                    <td className="px-6 py-4 font-medium text-rose-600">₹{refund.amount.toFixed(2)}</td>
                                    <td className="px-6 py-4"><StatusBadge status={refund.status} /></td>
                                    <td className="px-6 py-4 text-xs text-slate-500 text-right">{refund.date}</td>
                                    <td className="px-6 py-4 text-right">
                                        {refund.status === 'pending' && (
                                            <div className="flex justify-end gap-2">
                                                <button onClick={() => handleRefundAction(refund.id, 'approved')} className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded"><CheckCircle size={18} /></button>
                                                <button onClick={() => handleRefundAction(refund.id, 'rejected')} className="p-1.5 text-rose-600 hover:bg-rose-50 rounded"><XCircle size={18} /></button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-2xl font-bold text-slate-900 uppercase">
                    {view === 'dashboard' && 'Financial Overview'}
                    {view === 'transactions' && 'Transactions & Refunds'}
                    {view === 'driver-wallets' && 'Driver Wallets & Withdrawals'}
                    {view === 'passenger-wallets' && 'Passenger Wallets'}
                    {view === 'commissions' && 'Commission Settings'}
                </h1>
            </div>

            {view === 'dashboard' && renderDashboard()}
            {view === 'transactions' && renderTransactions()}
            {view === 'driver-wallets' && renderDriverWalletsWithHistory()}
            {view === 'passenger-wallets' && renderPassengerWallets()}

            {view === 'commissions' && (
                <div className="bg-white p-12 text-center rounded-xl border border-slate-200 border-dashed">
                    <h3 className="text-lg font-bold text-slate-900">Commission Configuration</h3>
                </div>
            )}
        </div>
    );
};

export default PaymentManagement;
