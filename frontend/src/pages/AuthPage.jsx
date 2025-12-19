import React, { useState } from 'react';
import { BookOpen } from 'lucide-react';
import Login from '../components/auth/Login';
import SignUp from '../components/auth/SignUp';

const AuthPage = () => {
    const [isSignUp, setIsSignUp] = useState(false);

    return (
        <div className="min-h-screen bg-linear-to-br from-green-600 to-green-700 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
                {/* Logo */}
                <div className="flex justify-center mb-6">
                    <div className="bg-green-100 p-4 rounded-full">
                        <BookOpen className="w-12 h-12 text-green-600" />
                    </div>
                </div>

                {/* Title */}
                <h1 className="text-3xl font-bold text-center mb-2">PageTurner</h1>
                <p className="text-gray-600 text-center mb-8">Track your reading journey</p>

                {/* Tab Navigation */}
                <div className="flex gap-2 mb-6">
                    <button
                        onClick={() => setIsSignUp(false)}
                        className={`flex-1 py-3 rounded-lg font-medium transition-colors ${!isSignUp
                                ? 'bg-white text-gray-900 shadow'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                    >
                        Login
                    </button>
                    <button
                        onClick={() => setIsSignUp(true)}
                        className={`flex-1 py-3 rounded-lg font-medium transition-colors ${isSignUp
                                ? 'bg-white text-gray-900 shadow'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                    >
                        Sign Up
                    </button>
                </div>

                {/* Forms */}
                {isSignUp ? (
                    <SignUp onSwitchToLogin={() => setIsSignUp(false)} />
                ) : (
                    <Login onSwitchToSignUp={() => setIsSignUp(true)} />
                )}
            </div>
        </div>
    );
};

export default AuthPage;