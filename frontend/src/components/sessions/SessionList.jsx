import React, { useState, useEffect } from 'react';
import { Clock, BookOpen, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import sessionService from '../../services/sessionService';
import Loading from '../common/Loading';

const SessionList = () => {
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchSessions();
    }, []);

    const fetchSessions = async () => {
        try {
            setLoading(true);
            const data = await sessionService.getSessions();
            setSessions(data);
        } catch (err) {
            setError('Failed to load reading history');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <Loading text="Loading history..." />;

    if (sessions.length === 0) {
        return (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-gray-100 rounded-full mb-4">
                    <Clock className="w-6 h-6 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-1">No reading sessions yet</h3>
                <p className="text-gray-500">Log a session to track your progress!</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-200 bg-gray-50">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Recent Reading Activity
                </h3>
            </div>
            <div className="divide-y divide-gray-100">
                {sessions.map((session) => (
                    <div key={session._id} className="p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex items-start justify-between">
                            <div className="flex items-start gap-3">
                                <div className="mt-1 bg-primary-50 p-2 rounded-lg">
                                    <BookOpen className="w-4 h-4 text-green-600" />
                                </div>
                                <div>
                                    <h4 className="font-medium text-gray-900">
                                        {session.book?.title || 'Unknown Book'}
                                    </h4>
                                    <p className="text-sm text-gray-600 mb-1">
                                        by {session.book?.author || 'Unknown Author'}
                                    </p>
                                    <div className="flex items-center gap-4 text-xs text-gray-500">
                                        <span className="flex items-center gap-1">
                                            <Calendar className="w-3 h-3" />
                                            {format(new Date(session.date), 'MMM d, yyyy')}
                                        </span>
                                        <span>
                                            {session.endPage - session.startPage} pages read
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <span className="text-xs font-medium bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                                {session.startPage} - {session.endPage}
                            </span>
                        </div>
                        {session.notes && (
                            <p className="mt-3 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-100 italic">
                                "{session.notes}"
                            </p>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SessionList;
