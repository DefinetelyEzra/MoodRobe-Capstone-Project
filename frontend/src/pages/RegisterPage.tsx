import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { getErrorMessage } from '@/utils/errorHandler';
import { AlertCircle, X, Eye, EyeOff } from 'lucide-react';
import { FaMedium, FaFacebookF, FaLinkedinIn, FaTwitter } from 'react-icons/fa';
import { IconType } from 'react-icons';

export const RegisterPage: React.FC = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        // Clear error when user starts typing
        if (error) setError('');
    };

    const validateForm = (): boolean => {
        if (!formData.name.trim()) {
            setError('Please enter your full name');
            return false;
        }

        if (formData.name.trim().length < 2) {
            setError('Name must be at least 2 characters');
            return false;
        }

        if (!formData.email.trim()) {
            setError('Please enter your email address');
            return false;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            setError('Please enter a valid email address');
            return false;
        }

        if (!formData.password) {
            setError('Please enter your password');
            return false;
        }

        if (formData.password.length < 8) {
            setError('Password must be at least 8 characters');
            return false;
        }

        if (!formData.confirmPassword) {
            setError('Please confirm your password');
            return false;
        }

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
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
            await register({
                name: formData.name.trim(),
                email: formData.email.trim(),
                password: formData.password,
            });
            navigate('/aesthetic-selection');
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

            {/* Main Content */}
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

                {/* Register Card */}
                <div className="w-full max-w-md flex-1 flex flex-col justify-start">
                    <div className="bg-white/70 backdrop-blur-md rounded-2xl shadow-2xl p-8 border border-white/50">
                        {/* Card Header */}
                        <div className="text-center mb-4">
                            <h2 className="text-2xl font-bold text-gray-900 mb-1">REGISTER</h2>
                            <p className="text-sm text-gray-600">Start discovering your perfect aesthetic</p>
                        </div>

                        {/* Persistent Error Alert */}
                        {error && (
                            <div className="mb-4 bg-red-50/95 backdrop-blur-sm border border-red-200 rounded-lg p-4 animate-shake">
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
                                type="text"
                                name="name"
                                placeholder="Full Name"
                                value={formData.name}
                                onChange={handleChange}
                                disabled={isLoading}
                                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                                required
                            />

                            <input
                                type="email"
                                name="email"
                                placeholder="Email"
                                value={formData.email}
                                onChange={handleChange}
                                disabled={isLoading}
                                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                                required
                            />

                            {/* Password Input */}
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    placeholder="Password"
                                    value={formData.password}
                                    onChange={handleChange}
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

                            {/* Confirm Password Input */}
                            <div className="relative">
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    name="confirmPassword"
                                    placeholder="Confirm Password"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    disabled={isLoading}
                                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all disabled:bg-gray-100 disabled:cursor-not-allowed pr-12"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                                    aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                                    disabled={isLoading}
                                >
                                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-lg transition-all duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                            >
                                {isLoading ? 'REGISTERING...' : 'REGISTER'}
                            </button>
                        </form>

                        {/* Switch to Login */}
                        <div className="mt-6 text-center">
                            <p className="text-sm text-gray-600">
                                Already have an account?{' '}
                                <Link
                                    to="/login"
                                    className="text-teal-600 hover:text-teal-700 font-semibold underline transition-colors"
                                >
                                    Login
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