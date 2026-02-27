import React, { useState } from 'react';
import { X } from 'lucide-react';

const AddEventModal = ({ isOpen, onClose, onSave, eventToEdit }) => {
    const [formData, setFormData] = useState({
        title: '',
        date: '',
        time: '',
        attendees: 0,
        status: 'pending' // default status
    });

    React.useEffect(() => {
        if (eventToEdit) {
            setFormData({
                title: eventToEdit.title,
                date: eventToEdit.date,
                time: eventToEdit.time,
                attendees: eventToEdit.attendees,
                status: eventToEdit.status
            });
        } else {
            setFormData({
                title: '',
                date: '',
                time: '',
                attendees: 0,
                status: 'pending'
            });
        }
    }, [eventToEdit, isOpen]);

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
        onClose();
        // Reset form
        setFormData({
            title: '',
            date: '',
            time: '',
            attendees: 0,
            status: 'pending'
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-full max-w-md shadow-xl border border-slate-100">
                <div className="flex items-center justify-between p-6 border-b border-slate-100">
                    <h2 className="text-xl font-bold text-slate-900">{eventToEdit ? 'Edit Event' : 'Add New Event'}</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500 hover:text-slate-700"
                    >
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-600 mb-1">Event Title</label>
                        <input
                            type="text"
                            name="title"
                            required
                            value={formData.title}
                            onChange={handleChange}
                            className="w-full px-4 py-2 rounded-xl border text-slate-600 border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                            placeholder="e.g. Science Fair"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Date</label>
                            <input
                                type="date"
                                name="date"
                                required
                                value={formData.date}
                                onChange={handleChange}
                                className="w-full px-4 py-2 rounded-xl border text-slate-600 border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Time</label>
                            <input
                                type="time"
                                name="time"
                                required
                                value={formData.time}
                                onChange={handleChange}
                                className="w-full px-4 py-2 rounded-xl border text-slate-600 border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Expected Attendees</label>
                        <input
                            type="number"
                            name="attendees"
                            min="0"
                            value={formData.attendees}
                            onChange={handleChange}
                            className="w-full px-4 py-2 rounded-xl border border-slate-200 text-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                            placeholder="e.g. 100"
                        />
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-medium hover:bg-slate-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-4 py-2.5 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors shadow-sm shadow-blue-200"
                        >
                            {eventToEdit ? 'Update Event' : 'Add Event'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddEventModal;
