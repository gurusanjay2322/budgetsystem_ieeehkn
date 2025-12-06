import React, { useEffect, useState } from 'react';
import axiosInstance from '../api/axiosInstance';
import CreateDeadlineModal from './CreateDeadlineModal';

const DeadlineList = () => {
    const [deadlines, setDeadlines] = useState([]);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        fetchDeadlines();
    }, []);

    const fetchDeadlines = async () => {
        try {
            const response = await axiosInstance.get('/api/deadlines');
            setDeadlines(response.data);
        } catch (error) {
            console.error('Error fetching deadlines:', error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this deadline?')) {
            try {
                await axiosInstance.delete(`/api/deadlines/${id}`);
                fetchDeadlines();
            } catch (error) {
                console.error('Error deleting deadline:', error);
            }
        }
    };

    const role = localStorage.getItem('role');

    return (
        <div className="p-6 bg-white rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Upcoming Deadlines</h2>
                {['ADMIN', 'TREASURER'].includes(role) && (
                    <button
                        onClick={() => setShowModal(true)}
                        className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
                    >
                        + Add Deadline
                    </button>
                )}
            </div>

            {deadlines.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No deadlines found.</p>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {deadlines.map((deadline) => (
                        <div key={deadline.id} className="border border-gray-200 p-4 rounded-lg hover:shadow-lg transition-shadow">
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">{deadline.title}</h3>
                            <p className="text-gray-600 text-sm mb-3 line-clamp-3">{deadline.description}</p>
                            <div className="flex justify-between items-center mt-auto">
                                <span className="text-xs font-medium text-indigo-500 bg-indigo-50 px-2 py-1 rounded">
                                    Due: {new Date(deadline.dueTimestamp).toLocaleDateString()}
                                </span>
                                {role === 'ADMIN' && (
                                    <button
                                        onClick={() => handleDelete(deadline.id)}
                                        className="text-red-500 hover:text-red-700 text-sm font-medium"
                                    >
                                        Delete
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {showModal && (
                <CreateDeadlineModal
                    onClose={() => setShowModal(false)}
                    onSuccess={() => {
                        setShowModal(false);
                        fetchDeadlines();
                    }}
                />
            )}
        </div>
    );
};

export default DeadlineList;
