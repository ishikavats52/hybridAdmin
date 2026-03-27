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
        success: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
        approved: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
        completed: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
        failed: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
        rejected: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
        pending: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
        refunded: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    };
    return (
        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${styles[status] || 'bg-slate-500/10 text-slate-400 border-slate-500/20'}`}>
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
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('adminToken');
                const headers = { Authorization: `Bearer ${token}` };
                
                const [finRes, driverWalletRes, passengerWalletRes, withdrawalRes, transRes] = await Promise.all([
                    axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/admin/financial-overview`, { headers }),
                    axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/admin/driver-wallets`, { headers }),
                    axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/admin/passenger-wallets`, { headers }),
                    axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/admin/withdrawals`, { headers }),
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
                const res = await axios.put(`${import.meta.env.VITE_API_BASE_URL}/api/admin/withdrawals/${id}`, 
                    { status: newStatus === 'approved' ? 'approved' : 'rejected' },
                    { headers: { Authorization: `Bearer ${token}` } }
                );

                if (res.data.success) {
                    setWithdrawals(withdrawals.map(w => w._id === id ? { ...w, status: res.data.data.status } : w));
                    alert(`Request ${newStatus} successfully`);
                }
            } catch (err) {
                console.error(err);
                alert(err.response?.data?.message || 'Failed to update request');
            }
        }
    };

    const renderPassengerWallets = () => (
        <div className="glass-panel rounded-[40px] overflow-hidden border-white/5 shadow-2xl">
            <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/5">
                <div>
                    <h3 className="text-xl font-black text-white tracking-tight">Passenger Wallets</h3>
                    <p className="text-xs font-bold text-white/30 uppercase tracking-widest mt-1">User Balance Repository</p>
                </div>
                <div className="px-4 py-2 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
                    <span className="text-xs font-black text-emerald-500 tracking-tighter uppercase">Total: {passengerWallets.length} Users</span>
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left border-separate border-spacing-y-2 px-6 pb-6">
                    <thead>
                        <tr className="text-white/20">
                            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em]">Passenger Details</th>
                            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em]">Contact</th>
                            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em]">Wallet Balance</th>
                            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em]">Tier</th>
                        </tr>
                    </thead>
                    <tbody className="space-y-4">
                        {passengerWallets.map((wallet, idx) => (
                            <tr key={wallet.passengerId || idx} className="glass-card">
                                <td className="px-6 py-5 first:rounded-l-3xl">
                                    <div className="text-sm font-black text-white">{wallet.passengerName}</div>
                                    <div className="text-[10px] text-white/30 font-bold font-mono tracking-tighter mt-0.5 uppercase">{wallet.passengerId}</div>
                                </td>
                                <td className="px-6 py-5 text-sm font-bold text-white/60">{wallet.phone || '—'}</td>
                                <td className="px-6 py-5">
                                    <span className="text-lg font-black text-emerald-400">₹{parseFloat(wallet.balance || 0).toLocaleString()}</span>
                                </td>
                                <td className="px-6 py-5 last:rounded-r-3xl">
                                    <span className={`px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest ${wallet.balance > 1000 ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'bg-white/5 text-white/40 border border-white/10'}`}>
                                        {wallet.balance > 1000 ? 'Premium' : 'Standard'}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );

    const renderDriverWalletsWithHistory = () => (
        <div className="space-y-8">
            <div className="glass-panel rounded-[40px] overflow-hidden border-white/5 shadow-2xl">
                <div className="p-8 border-b border-white/5 bg-white/5">
                    <h3 className="text-xl font-black text-white tracking-tight">Driver Capital Overview</h3>
                    <p className="text-xs font-bold text-white/30 uppercase tracking-widest mt-1">Earnings & Liquid Balances</p>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-separate border-spacing-y-2 px-6 pb-6">
                        <thead>
                            <tr className="text-white/20">
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em]">Provider</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em]">Platform Balance</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em]">Lifetime Earnings</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em]">Payouts</th>
                            </tr>
                        </thead>
                        <tbody>
                            {wallets.map((wallet, idx) => (
                                <tr key={wallet.driverId || idx} className="glass-card">
                                    <td className="px-6 py-5 first:rounded-l-3xl">
                                        <div className="text-sm font-black text-white">{wallet.driverName}</div>
                                        <div className="text-[10px] text-white/30 font-bold tracking-tighter uppercase">{wallet.driverId}</div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-sky-500 shadow-[0_0_8px_rgba(14,165,233,0.5)]" />
                                            <span className="text-lg font-black text-sky-400">₹{parseFloat(wallet.balance || 0).toLocaleString()}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 text-sm font-black text-emerald-400 italic">₹{parseFloat(wallet.totalEarned || 0).toLocaleString()}</td>
                                    <td className="px-6 py-5 last:rounded-r-3xl">
                                        <div className="flex items-center gap-2">
                                            <ArrowUpRight size={14} className="text-white/20" />
                                            <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">
                                                {withdrawals?.filter(w => w.driver?._id === wallet.driverId).length || 0} Request Cycle
                                            </span>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="glass-panel rounded-[40px] overflow-hidden border-white/5 shadow-2xl">
                <div className="p-8 border-b border-white/5 bg-white/5 flex justify-between items-center">
                    <div>
                        <h3 className="text-xl font-black text-white tracking-tight">Withdrawal Vault</h3>
                        <p className="text-xs font-bold text-white/30 uppercase tracking-widest mt-1">Provider Settlement Queue</p>
                    </div>
                    <Download size={20} className="text-white/20 cursor-pointer hover:text-white transition-colors" />
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-separate border-spacing-y-2 px-6 pb-6">
                        <thead>
                            <tr className="text-white/20">
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em]">REQ ID</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em]">Provider</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em]">Current Balance</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em]">Payable Amount</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em]">Bank Details</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em]">Status</th>
                                <th className="px-6 py-4 text-xs text-right uppercase tracking-[0.2em]">Operation</th>
                            </tr>
                        </thead>
                        <tbody>
                            {withdrawals.map(req => (
                                <tr key={req._id} className="glass-card">
                                    <td className="px-6 py-5 first:rounded-l-3xl font-mono text-[10px] font-black text-white/20">#{req._id.slice(-8).toUpperCase()}</td>
                                    <td className="px-6 py-5 text-sm font-black text-white">{req.driver?.name}</td>
                                    <td className="px-6 py-5">
                                        <span className="text-sm font-black text-white/60">₹{parseFloat(req.driver?.walletBalance || 0).toLocaleString()}</span>
                                    </td>
                                    <td className="px-6 py-5 font-black text-emerald-400 italic">₹{req.amount}</td>
                                    <td className="px-6 py-5">
                                        <div className="text-[10px] font-bold text-white/60">
                                            {req.bankDetails?.bankName || 'N/A'}<br/>
                                            A/C: {req.bankDetails?.accountNumber || 'N/A'}
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <StatusBadge status={req.status} />
                                        {req.processedAt && (
                                            <div className="text-[9px] font-bold text-white/20 mt-1 uppercase">Settled: {new Date(req.processedAt).toLocaleDateString()}</div>
                                        )}
                                    </td>
                                    <td className="px-6 py-5 last:rounded-r-3xl text-right">
                                        {req.status === 'pending' && (
                                            <div className="flex justify-end gap-3">
                                                <button onClick={() => handleWithdrawalAction(req._id, 'approved')} className="px-4 py-2 grad-emerald text-white text-[10px] font-black rounded-xl shadow-lg shadow-emerald-500/20 active:scale-95 transition-all">SETTLE</button>
                                                <button onClick={() => handleWithdrawalAction(req._id, 'rejected')} className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white/40 text-[10px] font-black rounded-xl border border-white/5 transition-all">DENY</button>
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
        <div className="space-y-10">
            {/* KPI Cards - Platinum Style */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: 'Total Volume', value: financeData.totalCollection, icon: CreditCard, grad: 'grad-sky', color: 'text-sky-400' },
                    { label: 'Platform Revenue', value: financeData.totalCommission, icon: DollarSign, grad: 'grad-emerald', color: 'text-emerald-400' },
                    { label: 'Provider Payouts', value: financeData.totalPayouts, icon: Wallet, grad: 'grad-indigo', color: 'text-indigo-400' },
                    { label: 'Net Liquidity', value: financeData.netProfit, icon: Activity, grad: 'grad-sky', color: 'text-white' }
                ].map((kpi, i) => (
                    <div key={i} className="glass-panel p-8 rounded-[40px] border-white/5 relative overflow-hidden group">
                        <div className={`absolute top-0 right-0 w-32 h-32 blur-3xl opacity-10 ${kpi.grad}`} />
                        <div className="flex justify-between items-start mb-6">
                            <div className={`p-4 rounded-2xl ${kpi.grad} text-white shadow-xl rotate-3 group-hover:rotate-0 transition-transform duration-500`}>
                                <kpi.icon size={20} strokeWidth={2.5} />
                            </div>
                            <TrendIndicator />
                        </div>
                        <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-2">{kpi.label}</p>
                        <h3 className={`text-3xl font-black italic tracking-tighter ${kpi.color}`}>
                            ₹{kpi.value.toLocaleString()}
                        </h3>
                    </div>
                ))}
            </div>

            {/* Revenue Analytics Curve */}
            <div className="glass-panel p-10 rounded-[48px] border-white/5 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 grad-emerald opacity-20" />
                <div className="flex justify-between items-end mb-10">
                    <div>
                        <h3 className="text-2xl font-black text-white tracking-tight">Growth Velocity</h3>
                        <p className="text-xs font-bold text-white/30 uppercase tracking-[0.3em] mt-1">Real-time Revenue Telemetry</p>
                    </div>
                    <div className="flex gap-2">
                        {['1D', '1W', '1M', '1Y'].map(t => (
                            <button key={t} className={`px-4 py-2 rounded-xl text-[10px] font-black transition-all ${t === '1W' ? 'grad-emerald text-white' : 'bg-white/5 text-white/20 hover:text-white'}`}>{t}</button>
                        ))}
                    </div>
                </div>
                <div className="h-96 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={revenueData}>
                            <defs>
                                <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="10 10" vertical={false} stroke="rgba(255,255,255,0.03)" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'rgba(255,255,255,0.2)', fontSize: 10, fontWeight: 900 }} />
                            <YAxis hide />
                            <Tooltip 
                                contentStyle={{ backgroundColor: '#0f172a', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 20px 40px rgba(0,0,0,0.4)' }} 
                                itemStyle={{ color: '#10b981', fontWeight: 900 }}
                            />
                            <Area type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={4} fillOpacity={1} fill="url(#colorRev)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );

    const renderTransactions = () => (
        <div className="space-y-8">
            <div className="flex justify-between items-center gap-6">
                <div className="relative flex-1 group">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-emerald-500 transition-colors" size={20} />
                    <input 
                        type="text" 
                        placeholder="Search Ledger (Description, Name, Role)..." 
                        className="w-full pl-16 pr-8 py-5 rounded-[24px] bg-white/5 border border-white/5 text-white font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all placeholder:text-white/10" 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="glass-panel rounded-[40px] overflow-hidden border-white/5 shadow-2xl">
                <div className="p-8 border-b border-white/5 bg-white/5">
                    <h3 className="text-xl font-black text-white tracking-tight">Ledger Operations</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-separate border-spacing-y-2 px-6 pb-6">
                        <thead>
                            <tr className="text-white/20">
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em]">Transaction</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em]">User Origin</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em]">Timestamp</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em]">Amount</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em]">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions
                                .filter(tx => 
                                    tx.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                    tx.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                    tx.userRole?.toLowerCase().includes(searchTerm.toLowerCase())
                                )
                                .map((tx, idx) => (
                                <tr key={tx._id || idx} className="glass-card hover:border-emerald-500/30">
                                    <td className="px-6 py-5 first:rounded-l-3xl">
                                        <div className="text-sm font-black text-white">{tx.description || 'Wallet Logic'}</div>
                                        <div className="text-[10px] text-white/20 font-bold uppercase tracking-widest mt-0.5">{tx.userRole}</div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="text-sm font-bold text-white/80">{tx.userName}</div>
                                        <div className="text-[9px] font-mono text-white/20 uppercase">ID: {tx.userId?.slice(-6)}</div>
                                    </td>
                                    <td className="px-6 py-5 text-[11px] font-black text-white/40">{new Date(tx.timestamp).toLocaleString()}</td>
                                    <td className={`px-6 py-5 font-black italic text-lg ${tx.type === 'credit' ? 'text-emerald-400' : 'text-rose-400'}`}>
                                        {tx.type === 'credit' ? '+' : '-'}₹{tx.amount.toFixed(2)}
                                    </td>
                                    <td className="px-6 py-5 last:rounded-r-3xl">
                                        <div className={`w-3 h-3 rounded-full ${tx.type === 'credit' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]'}`} />
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
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-700">
            <div className="flex flex-col gap-2 mb-12">
                <h1 className="text-5xl font-black text-white tracking-tighter uppercase italic">
                    {view === 'dashboard' && 'Neural Financial Engine'}
                    {view === 'transactions' && 'Ledger Records'}
                    {view === 'driver-wallets' && 'Capital Distribution'}
                    {view === 'passenger-wallets' && 'Network Credit'}
                </h1>
                <div className="h-1.5 w-32 grad-emerald rounded-full" />
            </div>

            {view === 'dashboard' && renderDashboard()}
            {view === 'transactions' && renderTransactions()}
            {view === 'driver-wallets' && renderDriverWalletsWithHistory()}
            {view === 'passenger-wallets' && renderPassengerWallets()}
        </div>
    );
};

const TrendIndicator = () => (
    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
        <TrendingUp size={12} className="text-emerald-400" />
        <span className="text-[10px] font-black text-emerald-400">+12.4%</span>
    </div>
);

export default PaymentManagement;


