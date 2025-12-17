import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, User, Menu } from 'lucide-react';

interface HeaderProps {
    onMenuClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
    const navigate = useNavigate();

    return (
        <header className="bg-teal-800 text-white shadow-md sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center space-x-4">
                        {/* Mobile Menu Button */}
                        <button
                            onClick={onMenuClick}
                            className="md:hidden p-2 hover:bg-teal-700 rounded-lg transition-colors"
                            aria-label="Open menu"
                        >
                            <Menu className="w-6 h-6" />
                        </button>

                        <button
                            className="text-2xl font-bold tracking-tight bg-transparent border-none cursor-pointer hover:text-teal-200 transition-colors"
                            onClick={() => navigate('/')}
                        >
                            MoodRobe
                        </button>

                        {/* Desktop Navigation */}
                        <nav className="hidden md:flex space-x-6 ml-8">
                            <button
                                onClick={() => navigate('/')}
                                className="hover:text-teal-200 transition-colors text-sm font-medium"
                            >
                                Home
                            </button>
                            <button
                                onClick={() => navigate('/products')}
                                className="hover:text-teal-200 transition-colors text-sm font-medium"
                            >
                                Shop
                            </button>
                            <button
                                onClick={() => navigate('/aesthetic-selection')}
                                className="hover:text-teal-200 transition-colors text-sm font-medium"
                            >
                                Aesthetics
                            </button>
                        </nav>
                    </div>

                    <div className="flex items-center space-x-4 md:space-x-6">
                        {/* Search Bar - Desktop */}
                        <div className="hidden lg:flex items-center bg-white/10 rounded-full px-4 py-2 w-80">
                            <Search className="w-4 h-4 mr-2 text-teal-200" />
                            <input
                                type="text"
                                placeholder="Search products..."
                                className="bg-transparent border-none outline-none text-white placeholder-teal-200 w-full text-sm"
                            />
                        </div>

                        {/* Icons */}
                        <button
                            onClick={() => navigate('/cart')}
                            className="hover:text-teal-200 transition-colors"
                            aria-label="Shopping cart"
                        >
                            <ShoppingCart className="w-5 h-5" />
                        </button>
                        <button
                            onClick={() => navigate('/profile')}
                            className="hover:text-teal-200 transition-colors"
                            aria-label="User profile"
                        >
                            <User className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Mobile Search */}
                <div className="md:hidden pb-4">
                    <div className="flex items-center bg-white/10 rounded-full px-4 py-2">
                        <Search className="w-4 h-4 mr-2 text-teal-200" />
                        <input
                            type="text"
                            placeholder="Search products..."
                            className="bg-transparent border-none outline-none text-white placeholder-teal-200 w-full text-sm"
                        />
                    </div>
                </div>
            </div>
        </header>
    );
};