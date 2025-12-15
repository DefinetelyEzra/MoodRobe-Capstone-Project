import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { getErrorMessage } from '@/utils/errorHandler';
import { AlertCircle, X } from 'lucide-react';
import { FaMedium, FaFacebookF, FaLinkedinIn, FaTwitter } from 'react-icons/fa';
import { IconType } from 'react-icons';

export const LoginPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (field: 'email' | 'password', value: string) => {
        if (field === 'email') setEmail(value);
        if (field === 'password') setPassword(value);
        // Clear error when user starts typing
        if (error) setError('');
    };

    const validateForm = (): boolean => {
        if (!email.trim()) {
            setError('Please enter your email address');
            return false;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setError('Please enter a valid email address');
            return false;
        }

        if (!password) {
            setError('Please enter your password');
            return false;
        }

        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsLoading(true);

        try {
            await login({ email: email.trim(), password });
            navigate('/');
        } catch (err) {
            setError(getErrorMessage(err));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen relative overflow-hidden">
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                <img
                    src="/images/auth-background.png"
                    alt="Background"
                    className="hidden md:block w-full h-full object-cover"
                />
                <img
                    src="/images/auth-background-mobile.png"
                    alt="Background"
                    className="md:hidden w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/20" />
            </div>

            {/* Login Card */}
            <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-12">
                <div className="w-full max-w-md">
                    {/* Logo */}
                    <div className="text-center mb-8">
                        <div className="flex justify-center">
                            <img
                                src="/images/logo.png"
                                alt="MoodRobe Logo"
                                className="h-16 w-16 object-contain"
                            />
                        </div>
                    </div>

                    {/* Login Card */}
                    <div className="bg-white/70 backdrop-blur-md rounded-2xl shadow-2xl p-8 border border-white/50">
                        <div className="text-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-900 mb-1">LOG IN</h2>
                            <p className="text-sm text-gray-600">Welcome back to your style journey</p>
                        </div>

                        {/* Persistent Error Alert */}
                        {error && (
                            <div className="mb-6 bg-red-50/95 backdrop-blur-sm border border-red-200 rounded-lg p-4 animate-shake">
                                <div className="flex items-start">
                                    <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 mr-3 shrink-0" />
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-red-800">{error}</p>
                                    </div>
                                    <button
                                        onClick={() => setError('')}
                                        className="ml-2 text-red-600 hover:text-red-800 transition-colors"
                                        aria-label="Dismiss error"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <input
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => handleChange('email', e.target.value)}
                                disabled={isLoading}
                                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                                required
                            />

                            <input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => handleChange('password', e.target.value)}
                                disabled={isLoading}
                                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                                required
                            />

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-lg transition-all duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                            >
                                {isLoading ? 'LOGGING IN...' : 'LOGIN'}
                            </button>
                        </form>

                        {/* Forgot Password Link */}
                        <div className="mt-4 text-right">
                            <Link
                                to="/forgot-password"
                                className="text-sm text-teal-600 hover:text-teal-700 font-medium transition-colors"
                            >
                                Forgot password?
                            </Link>
                        </div>

                        {/* Switch to Register */}
                        <div className="mt-6 text-center">
                            <p className="text-sm text-gray-600">
                                Don't have an account?{' '}
                                <Link
                                    to="/register"
                                    className="text-teal-600 hover:text-teal-700 font-semibold underline transition-colors"
                                >
                                    Register
                                </Link>
                            </p>
                        </div>
                    </div>

                    {/* Social Icons */}
                    <SocialIcons />
                </div>
            </div>
        </div>
    );
};

// Social Icons Component (Shared)
const SocialIcons: React.FC = () => {
    const socials: Array<{
        id: string;
        icon: IconType;
        label: string;
        href: string;
        color: string;
    }> = [
            {
                id: 'medium',
                icon: FaMedium,
                label: 'Medium',
                href: 'https://medium.com',
                color: 'hover:text-gray-900',
            },
            {
                id: 'facebook',
                icon: FaFacebookF,
                label: 'Facebook',
                href: 'https://facebook.com',
                color: 'hover:text-blue-600',
            },
            {
                id: 'linkedin',
                icon: FaLinkedinIn,
                label: 'LinkedIn',
                href: 'https://linkedin.com',
                color: 'hover:text-blue-700',
            },
            {
                id: 'twitter',
                icon: FaTwitter,
                label: 'Twitter',
                href: 'https://twitter.com',
                color: 'hover:text-blue-400',
            },
        ];

    const handleSocialClick = (href: string, label: string) => {
        console.log(`Navigating to ${label}`);
        window.open(href, '_blank', 'noopener noreferrer');
    };

    return (
        <div className="mt-8 flex justify-center space-x-4">
            {socials.map((social) => {
                const Icon = social.icon;
                return (
                    <button
                        key={social.id}
                        onClick={() => handleSocialClick(social.href, social.label)}
                        className={`w-10 h-10 bg-white/80 backdrop-blur-sm hover:bg-white rounded-full flex items-center justify-center text-gray-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-1 ${social.color}`}
                        aria-label={`Follow us on ${social.label}`}
                        title={`Follow us on ${social.label}`}
                    >
                        <Icon size={16} />
                    </button>
                );
            })}
        </div>
    );
};