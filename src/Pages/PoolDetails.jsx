import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
    ArrowLeft, MapPin, Calendar, Clock, CreditCard, User,
    Phone, ShieldAlert, Check, Star, Car, AlertCircle, Users,
    TrendingUp, ShieldCheck
} from 'lucide-react';

const PoolDetails = () => {
    const { poolId } = useParams();
    const navigate = useNavigate();

    const [pool, setPool] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchPoolDetails = useCallback(async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('adminToken');
            const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/admin/pools/${poolId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.data.success) {
                setPool(res.data.data);
            } else {
                setError(res.data.message);
            }
        } catch (err) {
            console.error('Failed to fetch pool details:', err);
            setError(err.response?.data?.message || 'Failed to connect to server');
        } finally {
            setLoading(false);
        }
    }, [poolId]);

    useEffect(() => {
        fetchPoolDetails();
    }, [fetchPoolDetails]);

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500">
                        <ArrowLeft size={24} />
                    </button>
                    <h1 className="text-2xl font-bold text-slate-900">Pool Details</h1>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center text-slate-500">
                    Loading pool details...
                </div>
            </div>
        );
    }

    if (error || !pool) {
        return (
            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500">
                        <ArrowLeft size={24} />
                    </button>
                    <h1 className="text-2xl font-bold text-slate-900">Pool Details</h1>
                </div>
                <div className="bg-red-50 text-red-600 border border-red-200 rounded-xl p-6 flex items-center gap-3">
                    <AlertCircle size={24} />
                    <div>
                        <h3 className="font-bold">Error</h3>
                        <p className="text-sm">{error || 'Pool details not found'}</p>
                    </div>
                </div>
            </div>
        );
    }

    const scheduledDate = new Date(pool.scheduledTime).toLocaleDateString([], { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    const scheduledTime = new Date(pool.scheduledTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    return (
        <div className="space-y-6 relative">
            {/* Header */}
            <div className="flex items-center gap-4">
                <button
                    onClick={() => navigate(-1)}
                    className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500 hover:text-slate-900"
                >
                    <ArrowLeft size={24} />
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 capitalize">{pool.type} Pool Details</h1>
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                        <span className="font-mono">{pool._id}</span>
                        <span>•</span>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold uppercase
                            ${pool.status === 'completed' ? 'bg-emerald-100 text-emerald-700' :
                                pool.status === 'cancelled' ? 'bg-rose-100 text-rose-700' :
                                    pool.status === 'ongoing' ? 'bg-blue-100 text-blue-700' :
                                        'bg-amber-100 text-amber-700'}`}>
                            {pool.status}
                        </span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column: Host & Vehicle */}
                <div className="space-y-6">
                    {/* Host Card */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Host Details</h3>
                        <div className="flex items-center gap-4 mb-4">
                            <img
                                src={pool.host?.profileImage || `https://ui-avatars.com/api/?name=${pool.host?.name}`}
                                alt={pool.host?.name}
                                className="w-16 h-16 rounded-full object-cover border-2 border-slate-100"
                            />
                            <div>
                                <div className="font-bold text-lg text-slate-900">{pool.host?.name}</div>
                                <div className="flex items-center gap-1 text-sm text-slate-500">
                                    <Phone size={14} /> {pool.host?.phone}
                                </div>
                            </div>
                        </div>
                        <div className="bg-slate-50 p-3 rounded-lg flex items-center gap-3">
                            <Car className="text-slate-400" size={18} />
                            <div>
                                <div className="text-sm font-medium text-slate-900">{pool.vehicle || 'Vehicle Info N/A'}</div>
                                <div className="text-xs text-slate-500">Host Vehicle</div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Ride Economics</h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-slate-500">Price per Seat</span>
                                <span className="text-lg font-bold text-emerald-600">₹{pool.pricePerSeat}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-slate-500">Occupancy</span>
                                <span className="text-sm font-semibold text-slate-900">
                                    {pool.totalSeats - pool.availableSeats} / {pool.totalSeats} Seats Booked
                                </span>
                            </div>
                            <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                                <span className="text-sm font-bold text-slate-900">Estimated Revenue</span>
                                <span className="text-lg font-bold text-slate-900">₹{(pool.totalSeats - pool.availableSeats) * pool.pricePerSeat}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Route, Passengers, Timeline */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Route & Schedule */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                        <div className="flex justify-between items-start mb-6">
                            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                                <MapPin size={16} className="text-blue-500" /> Route & Schedule
                            </h3>
                            <div className="text-right">
                                <div className="text-sm font-bold text-slate-900">{scheduledDate}</div>
                                <div className="text-xs text-slate-500">{scheduledTime}</div>
                            </div>
                        </div>

                        <div className="relative pl-8 space-y-8 before:absolute before:left-3.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100">
                            <div>
                                <div className="absolute left-2 top-2 w-3 h-3 rounded-full bg-blue-500 ring-4 ring-white shadow-sm" />
                                <h4 className="text-xs font-bold text-slate-400 uppercase mb-1">Origin</h4>
                                <p className="text-slate-900 font-medium">{pool.origin?.name}</p>
                            </div>
                            <div>
                                <div className="absolute left-2 top-2 w-3 h-3 rounded-full bg-rose-500 ring-4 ring-white shadow-sm" />
                                <h4 className="text-xs font-bold text-slate-400 uppercase mb-1">Destination</h4>
                                <p className="text-slate-900 font-medium">{pool.destination?.name}</p>
                            </div>
                        </div>
                    </div>

                    {/* Passengers */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                                <Users size={16} className="text-slate-400" /> Passengers ({pool.passengers?.length || 0})
                            </h3>
                        </div>
                        <div className="divide-y divide-slate-100">
                            {pool.passengers?.length === 0 ? (
                                <div className="p-12 text-center text-slate-400">
                                    No passengers have joined this pool yet.
                                </div>
                            ) : (
                                pool.passengers.map((p, index) => (
                                    <div key={index} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <img
                                                src={p.user?.profileImage || `https://ui-avatars.com/api/?name=${p.user?.name}`}
                                                className="w-10 h-10 rounded-full border border-slate-100"
                                                alt=""
                                            />
                                            <div>
                                                <div className="text-sm font-bold text-slate-900">{p.user?.name}</div>
                                                <div className="text-xs text-slate-500">{p.user?.phone}</div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-6">
                                            <div className="text-right">
                                                <div className="text-sm font-bold text-slate-900">{p.seatsBooked} Seat(s)</div>
                                                <div className="text-xs text-slate-500">₹{p.seatsBooked * pool.pricePerSeat}</div>
                                            </div>
                                            <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase border
                                                ${p.bookingStatus === 'confirmed' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                                    p.bookingStatus === 'cancelled' ? 'bg-rose-50 text-rose-600 border-rose-100' :
                                                        'bg-slate-50 text-slate-600 border-slate-100'}`}>
                                                {p.bookingStatus}
                                            </span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PoolDetails;
