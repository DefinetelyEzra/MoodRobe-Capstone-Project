import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { useApi } from '@/hooks/useApi';
import { getErrorInfo } from '@/utils/errorHandler';
import { Eye, EyeOff } from 'lucide-react';
import { FaMedium, FaFacebookF, FaLinkedinIn, FaTwitter } from 'react-icons/fa';
import { IconType } from 'react-icons';

interface LoginCredentials {
    email: string;
    password: string;
}

export const LoginPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState<string>('');

    const { login } = useAuth();
    const { showToast } = useToast();
    const navigate = useNavigate();

    // Use api hook for login
    const {
        isLoading,
        execute: performLogin
    } = useApi<void, LoginCredentials>((credentials) =>
        login(credentials)
    );

    const handleChange = (field: 'email' | 'password', value: string): void => {
        // Clear error when user starts typing
        if (error) setError('');
        if (field === 'email') setEmail(value);
        if (field === 'password') setPassword(value);
    };

    const validateForm = (): boolean => {
        if (!email.trim()) {
            showToast('Please enter your email address', 'warning', 4000);
            return false;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            showToast('Please enter a valid email address', 'warning', 4000);
            return false;
        }
        if (!password) {
            showToast('Please enter your password', 'warning', 4000);
            return false;
        }
        return true;
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();
        e.stopPropagation();

        if (!validateForm()) {
            return;
        }

        setError(''); // Clear previous errors

        try {
            await performLogin({ email: email.trim(), password });
            showToast('Login successful!', 'success', 3000);
            navigate('/');
        } catch (err) {
            const errorInfo = getErrorInfo(err);
            setError(errorInfo.message);
            showToast(errorInfo.message, errorInfo.type, 5000);
            console.error('Login error:', err);
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

            {/* Main Content*/}
            <div className="relative z-10 min-h-screen flex flex-col items-center px-4 pt-4 pb-8">
                {/* Logo */}
                <div className="-mb-25 md:-mb-25">
                    <div className="flex justify-center">
                        <img
                            src="/images/logo.png"
                            alt="MoodRobe Logo"
                            className="w-80 h-80 md:w-96 md:h-96 object-contain drop-shadow-[0_0_15px_rgba(255,255,255,2)]"
                        />
                    </div>
                </div>

                {/* Login Card */}
                <div className="w-full max-w-md flex-1 flex flex-col justify-start">
                    <div className="bg-white/70 backdrop-blur-md rounded-2xl shadow-2xl p-8 border border-white/50">
                        {/* Card Header */}
                        <div className="text-center mb-4">
                            <h2 className="text-2xl font-bold text-gray-900 mb-1">LOG IN</h2>
                            <p className="text-sm text-gray-600">Welcome back to your style journey</p>
                        </div>

                        {/* Error Message Display */}
                        {error && (
                            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                                <p className="text-sm text-red-600 text-center">{error}</p>
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

                            {/* Password Input */}
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => handleChange('password', e.target.value)}
                                    disabled={isLoading}
                                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all disabled:bg-gray-100 disabled:cursor-not-allowed pr-12"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                    disabled={isLoading}
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>

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
                    <div className="mt-8">
                        <SocialIcons />
                    </div>
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

    const handleSocialClick = (href: string, label: string): void => {
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
                        type="button"
                    >
                        <Icon size={16} />
                    </button>
                );
            })}
        </div>
    );
};