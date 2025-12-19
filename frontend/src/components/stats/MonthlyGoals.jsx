import React, { useEffect, useState } from 'react';
import { Target, Edit2, Check, X } from 'lucide-react';
import statsService from '../../services/statsService';

const MonthlyGoals = ({ booksGoal = 3, pagesGoal = 500, onUpdate }) => {
    const [progress, setProgress] = useState({ pagesRead: 0, booksCompleted: 0 });
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({ booksGoal, pagesGoal });

    useEffect(() => {
        setEditForm({ booksGoal, pagesGoal });
    }, [booksGoal, pagesGoal]);

    useEffect(() => {
        fetchProgress();
    }, []);

    const fetchProgress = async () => {
        try {
            const data = await statsService.getGoalsProgress();
            setProgress(data);
        } catch (error) {
            console.error('Failed to fetch goals progress:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = () => {
        onUpdate(editForm);
        setIsEditing(false);
    };

    const handleCancel = () => {
        setEditForm({ booksGoal, pagesGoal });
        setIsEditing(false);
    };

    const booksProgress = Math.min((progress.booksCompleted / booksGoal) * 100, 100);
    const pagesProgress = Math.min((progress.pagesRead / pagesGoal) * 100, 100);

    const currentDate = new Date();
    const monthName = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });
    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    const daysRemaining = daysInMonth - currentDate.getDate();

    const pagesRemaining = pagesGoal - progress.pagesRead;
    const pagesPerDay = pagesRemaining > 0 ? Math.ceil(pagesRemaining / Math.max(daysRemaining, 1)) : 0;

    if (loading) {
        return (
            <div className="bg-linear-to-br from-purple-500 to-indigo-600 text-white rounded-xl p-6 shadow-lg animate-pulse">
                <div className="h-6 bg-white/20 rounded w-48 mb-4"></div>
                <div className="space-y-4">
                    <div className="h-16 bg-white/20 rounded"></div>
                    <div className="h-16 bg-white/20 rounded"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-linear-to-br from-purple-500 to-indigo-600 text-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold flex items-center gap-2">
                    <Target className="w-6 h-6" />
                    {monthName} Goals
                </h3>
                {onUpdate && (
                    <button
                        onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                        className="p-1 hover:bg-white/20 rounded transition-colors"
                        title={isEditing ? "Save goals" : "Edit goals"}
                    >
                        {isEditing ? <Check className="w-5 h-5" /> : <Edit2 className="w-5 h-5" />}
                    </button>
                )}
            </div>

            {isEditing ? (
                <div className="space-y-4 mb-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Books Goal</label>
                        <input
                            type="number"
                            min="1"
                            value={editForm.booksGoal}
                            onChange={(e) => setEditForm(prev => ({ ...prev, booksGoal: parseInt(e.target.value) || 0 }))}
                            className="w-full bg-white/20 border border-white/30 rounded px-3 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Pages Goal</label>
                        <input
                            type="number"
                            min="1"
                            value={editForm.pagesGoal}
                            onChange={(e) => setEditForm(prev => ({ ...prev, pagesGoal: parseInt(e.target.value) || 0 }))}
                            className="w-full bg-white/20 border border-white/30 rounded px-3 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50"
                        />
                    </div>
                    <button
                        onClick={handleCancel}
                        className="w-full py-2 bg-white/10 hover:bg-white/20 rounded text-sm transition-colors"
                    >
                        Cancel
                    </button>
                </div>
            ) : (

                <div className="space-y-4">
                    {/* Books Goal */}
                    <div>
                        <div className="flex justify-between text-sm mb-2">
                            <span>
                                📚 Books Goal: {progress.booksCompleted}/{booksGoal} books completed
                            </span>
                            <span>{Math.round(booksProgress)}%</span>
                        </div>
                        <div className="bg-white/20 rounded-full h-3 overflow-hidden">
                            <div
                                className="bg-white h-full rounded-full transition-all duration-500"
                                style={{ width: `${booksProgress}%` }}
                            />
                        </div>
                    </div>

                    {/* Pages Goal */}
                    <div>
                        <div className="flex justify-between text-sm mb-2">
                            <span>
                                📖 Pages Goal: {progress.pagesRead}/{pagesGoal} pages
                            </span>
                            <span>{Math.round(pagesProgress)}%</span>
                        </div>
                        <div className="bg-white/20 rounded-full h-3 overflow-hidden">
                            <div
                                className="bg-white h-full rounded-full transition-all duration-500"
                                style={{ width: `${pagesProgress}%` }}
                            />
                        </div>
                    </div>

                    {/* Motivation Text */}
                    {pagesRemaining > 0 && daysRemaining > 0 && (
                        <div className="text-sm mt-4 bg-white/10 rounded-lg p-3">
                            💪 You need {pagesPerDay} pages/day to reach your goal!
                        </div>
                    )}

                    {progress.pagesRead >= pagesGoal && progress.booksCompleted >= booksGoal && (
                        <div className="text-sm mt-4 bg-white/10 rounded-lg p-3">
                            🎉 Congratulations! You've achieved your monthly goals!
                        </div>
                    )}

                    <div className="text-xs opacity-80 mt-2">
                        ⏰ {daysRemaining} days remaining
                    </div>
                </div>
            )}
        </div>
    );
};

export default MonthlyGoals;