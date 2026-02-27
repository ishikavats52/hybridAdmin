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
const mockWallets = [];
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
    const [activeTab, setActiveTab] = useState('all');
    const [withdrawals, setWithdrawals] = useState(mockWithdrawals);
    const [refunds, setRefunds] = useState(mockRefunds);
    const [wallets, setWallets] = useState([]);
    const [financeData, setFinanceData] = useState({
        totalCollection: 0,
        totalCommission: 0,
        totalPayouts: 0,
        netProfit: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('adminToken');
                const [finRes, walletRes] = await Promise.all([
                    axios.get('https://hybridride.onrender.com/api/admin/financial-overview', { headers: { Authorization: `Bearer ${token}` } }),
                    axios.get('https://hybridride.onrender.com/api/admin/driver-wallets', { headers: { Authorization: `Bearer ${token}` } })
                ]);

                if (finRes.data.success) {
                    setFinanceData(finRes.data.data);
                }
                if (walletRes.data.success) {
                    setWallets(walletRes.data.data);
                }
            } catch (err) {
                console.error('Failed to fetch data:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Actions
    const handleWithdrawalAction = (id, newStatus) => {
        if (window.confirm(`Are you sure you want to ${newStatus} this request?`)) {
            setWithdrawals(withdrawals.map(w => w.id === id ? { ...w, status: newStatus } : w));
        }
    };

    const handleRefundAction = (id, newStatus) => {
        setRefunds(refunds.map(r => r.id === id ? { ...r, status: newStatus } : r));
    };

    // --- Views ---

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
                        <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Total Refunds</p>
                        <ArrowDownLeft size={18} className="text-rose-500" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900">₹0.00</h3>
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
                            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Payment ID</th>
                            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Ride ID</th>
                            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Passenger</th>
                            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Gateway</th>
                            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Date</th>
                            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Amount</th>
                            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {mockPayments.map(payment => (
                            <tr key={payment.id} className="hover:bg-slate-50">
                                <td className="px-6 py-4 font-mono text-xs text-slate-600">{payment.id}</td>
                                <td className="px-6 py-4 font-mono text-xs text-blue-600">{payment.rideId}</td>
                                <td className="px-6 py-4 text-sm text-slate-900">{payment.passenger}</td>
                                <td className="px-6 py-4 text-sm text-slate-600">{payment.gateway}</td>
                                <td className="px-6 py-4 text-sm text-slate-500">{payment.date}</td>
                                <td className="px-6 py-4 font-medium text-slate-900">₹{payment.amount.toFixed(2)}</td>
                                <td className="px-6 py-4"><StatusBadge status={payment.status} /></td>
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

    const renderPayouts = () => (
        <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Driver Wallets - B */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="p-6 border-b border-slate-100 bg-slate-50">
                        <h3 className="font-bold text-slate-900">Driver Wallets</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 border-b border-slate-200">
                                <tr>
                                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Driver</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Current Balance</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Total Earned</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Commission Due</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {wallets.map(wallet => (
                                    <tr key={wallet.driverId} className="hover:bg-slate-50">
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-medium text-slate-900">{wallet.driverName}</div>
                                            <div className="text-xs text-slate-500">{wallet.driverId}</div>
                                        </td>
                                        <td className="px-6 py-4 font-medium text-slate-900">₹{wallet.balance.toFixed(2)}</td>
                                        <td className="px-6 py-4 text-sm text-slate-600">₹{wallet.totalEarned.toFixed(2)}</td>
                                        <td className="px-6 py-4 text-sm text-rose-600">₹{wallet.commissionDue.toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Withdrawal Requests - C */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="p-6 border-b border-slate-100 bg-slate-50">
                        <h3 className="font-bold text-slate-900">Withdrawal Requests</h3>
                    </div>
                    <div className="overflow-y-auto max-h-[400px]">
                        <div className="divide-y divide-slate-100">
                            {withdrawals.map(request => (
                                <div key={request.id} className="p-4 hover:bg-slate-50 flex flex-col gap-3">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h4 className="font-bold text-slate-900">{request.driverName}</h4>
                                            <p className="text-sm text-slate-500">{request.bank}</p>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-lg font-bold text-slate-900">₹{request.amount.toFixed(2)}</div>
                                            <div className="text-xs text-slate-500">{request.date}</div>
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <StatusBadge status={request.status} />
                                        {request.status === 'pending' && (
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleWithdrawalAction(request.id, 'approved')}
                                                    className="px-3 py-1.5 bg-emerald-600 text-white text-xs font-medium rounded hover:bg-emerald-700"
                                                >
                                                    Approve
                                                </button>
                                                <button
                                                    onClick={() => handleWithdrawalAction(request.id, 'rejected')}
                                                    className="px-3 py-1.5 border border-slate-200 text-slate-600 text-xs font-medium rounded hover:bg-slate-50"
                                                >
                                                    Reject
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                    {request.remark && (
                                        <div className="text-xs text-slate-500 bg-slate-100 p-2 rounded">
                                            Admin Remark: {request.remark}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-2xl font-bold text-slate-900">
                    {view === 'dashboard' && 'Financial Overview'}
                    {view === 'transactions' && 'Transactions & Refunds'}
                    {view === 'payouts' && 'Driver Payouts & Wallets'}
                    {view === 'commissions' && 'Commission Settings'}
                </h1>
            </div>

            {view === 'dashboard' && renderDashboard()}
            {view === 'transactions' && renderTransactions()}
            {view === 'payouts' && renderPayouts()}

            {view === 'commissions' && (
                <div className="bg-white p-12 text-center rounded-xl border border-slate-200 border-dashed">
                    <h3 className="text-lg font-bold text-slate-900">Commission Configuration</h3>
                </div>
            )}
        </div>
    );
};

export default PaymentManagement;
