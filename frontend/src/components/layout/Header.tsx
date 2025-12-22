import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, User, Menu, LogOut, Store, Shield } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useMerchant } from '@/hooks/useMerchant';
import { useToast } from '@/hooks/useToast';

interface HeaderProps {
    onMenuClick: () => void;
}

const ADMIN_EMAIL = 'ezraagun@gmail.com';

export const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
    const navigate = useNavigate();
    const { logout, user } = useAuth();
    const { merchants } = useMerchant();
    const { showToast } = useToast();

    const handleLogout = () => {
        logout();
        showToast('Logged out successfully!', 'success', 3000);
        navigate('/login');
    };

    const hasMerchantAccount = merchants.length > 0;
    const isAdmin = user?.email === ADMIN_EMAIL;

    return (
        <header className="bg-surface text-text-primary shadow-sm sticky top-0 z-50 border-b border-border">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center space-x-4">
                        {/* Mobile Menu Button */}
                        <button
                            onClick={onMenuClick}
                            className="md:hidden p-2 hover:bg-canvas rounded-lg transition-colors"
                            aria-label="Open menu"
                        >
                            <Menu className="w-6 h-6" />
                        </button>

                        <button
                            className="text-2xl font-bold tracking-tight bg-transparent border-none cursor-pointer hover:text-accent transition-colors"
                            onClick={() => navigate('/')}
                        >
                            MoodRobe
                        </button>

                        {/* Desktop Navigation */}
                        <nav className="hidden md:flex space-x-6 ml-8">
                            <button
                                onClick={() => navigate('/')}
                                className="hover:text-accent transition-colors text-sm font-medium"
                            >
                                Home
                            </button>
                            <button
                                onClick={() => navigate('/products')}
                                className="hover:text-accent transition-colors text-sm font-medium"
                            >
                                Shop
                            </button>
                            <button
                                onClick={() => navigate('/aesthetic-selection')}
                                className="hover:text-accent transition-colors text-sm font-medium"
                            >
                                Aesthetics
                            </button>
                            {hasMerchantAccount && (
                                <button
                                    onClick={() => navigate('/merchant/dashboard')}
                                    className="hover:text-accent transition-colors text-sm font-medium flex items-center"
                                >
                                    <Store className="w-4 h-4 mr-1" />
                                    Merchant
                                </button>
                            )}
                            {isAdmin && (
                                <button
                                    onClick={() => navigate('/admin')}
                                    className="hover:text-accent transition-colors text-sm font-medium flex items-center"
                                >
                                    <Shield className="w-4 h-4 mr-1" />
                                    Admin
                                </button>
                            )}
                        </nav>
                    </div>

                    <div className="flex items-center space-x-4 md:space-x-6">
                        {/* Search Bar - Desktop */}
                        <div className="hidden lg:flex items-center bg-input rounded-full px-4 py-2 w-80 border border-border">
                            <Search className="w-4 h-4 mr-2 text-text-secondary" />
                            <input
                                type="text"
                                placeholder="Search products..."
                                className="bg-transparent border-none outline-none text-text-primary placeholder-text-secondary w-full text-sm"
                            />
                        </div>

                        {/* Icons */}
                        <button
                            onClick={() => navigate('/cart')}
                            className="hover:text-accent transition-colors"
                            aria-label="Shopping cart"
                        >
                            <ShoppingCart className="w-5 h-5" />
                        </button>
                        <button
                            onClick={() => navigate('/profile')}
                            className="hover:text-accent transition-colors"
                            aria-label="User profile"
                        >
                            <User className="w-5 h-5" />
                        </button>
                        {hasMerchantAccount && (
                            <button
                                onClick={() => navigate('/merchant/dashboard')}
                                className="hover:text-accent transition-colors md:hidden"
                                aria-label="Merchant dashboard"
                                title="Merchant Dashboard"
                            >
                                <Store className="w-5 h-5" />
                            </button>
                        )}
                        {isAdmin && (
                            <button
                                onClick={() => navigate('/admin')}
                                className="hover:text-accent transition-colors md:hidden"
                                aria-label="Admin dashboard"
                                title="Admin Dashboard"
                            >
                                <Shield className="w-5 h-5" />
                            </button>
                        )}
                        <button
                            onClick={handleLogout}
                            className="hover:text-accent transition-colors"
                            aria-label="Logout"
                            title="Logout"
                        >
                            <LogOut className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Mobile Search */}
                <div className="md:hidden pb-4">
                    <div className="flex items-center bg-input rounded-full px-4 py-2 border border-border">
                        <Search className="w-4 h-4 mr-2 text-text-secondary" />
                        <input
                            type="text"
                            placeholder="Search products..."
                            className="bg-transparent border-none outline-none text-text-primary placeholder-text-secondary w-full text-sm"
                        />
                    </div>
                </div>
            </div>
        </header>
    );
};