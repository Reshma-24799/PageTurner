import React from 'react';

const StatsCard = ({ title, value, subtitle, icon: Icon, gradient, iconColor }) => {
    return (
        <div
            className={`rounded-xl p-6 shadow-sm transition-colors duration-200 ${gradient
                ? `bg-linear-to-br ${gradient} text-white`
                : 'bg-white border border-gray-200 dark:bg-gray-800 dark:border-gray-700'
                }`}
        >
            <div className="flex items-center justify-between mb-2">
                <span className={gradient ? 'text-white/80' : 'text-gray-600 dark:text-gray-400 transition-colors duration-200'}>
                    {title}
                </span>
                {Icon && (
                    <Icon
                        className={`w-5 h-5 ${gradient ? 'text-white/80' : iconColor || 'text-gray-400 dark:text-gray-500 transition-colors duration-200'
                            }`}
                    />
                )}
            </div>
            <div className={`text-4xl font-bold mb-1 ${!gradient && 'text-gray-900 dark:text-white transition-colors duration-200'}`}>{value}</div>
            <div className={`text-sm ${gradient ? 'text-white/80' : 'text-gray-500 dark:text-gray-400 transition-colors duration-200'}`}>
                {subtitle}
            </div>
        </div>
    );
};

export default StatsCard;