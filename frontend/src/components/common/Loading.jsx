import React from 'react';
import { Loader2 } from 'lucide-react';

const Loading = ({ size = 'default', text = 'Loading...' }) => {
    const sizeClasses = {
        small: 'w-4 h-4',
        default: 'w-8 h-8',
        large: 'w-12 h-12',
    };

    return (
        <div className="flex flex-col items-center justify-center p-8">
            <Loader2 className={`${sizeClasses[size]} animate-spin text-primary-600`} />
            {text && <p className="mt-3 text-gray-600">{text}</p>}
        </div>
    );
};

export default Loading;