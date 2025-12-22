import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, ShoppingBag, Palette, User, ShoppingCart, Heart, Clock, X } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/common/Button';

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

interface NavItem {
    icon: React.ElementType;
    label: string;
    path: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, logout, isAuthenticated } = useAuth();

    const navItems: NavItem[] = [
        { icon: Home, label: 'Home', path: '/' },
        { icon: ShoppingBag, label: 'Products', path: '/products' },
        { icon: Palette, label: 'Aesthetics', path: '/aesthetic-selection' },
        { icon: ShoppingCart, label: 'Cart', path: '/cart' },
        { icon: Heart, label: 'Wishlist', path: '/wishlist' },
        { icon: Clock, label: 'Order History', path: '/orders' },
        { icon: User, label: 'Profile', path: '/profile' },
    ];

    const handleNavigation = (path: string) => {
        navigate(path);
        onClose();
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
        onClose();
    };

    const isActive = (path: string) => {
        return location.pathname === path;
    };

    return (
        <>
            {/* Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-text-primary/50 z-40"
                    onClick={onClose}
                    aria-hidden="true"
                />
            )}

            {/* Sidebar - Mobile Only */}
            <aside
                className={`fixed top-0 left-0 h-full w-72 bg-surface shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
            >
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-border">
                        <div>
                            <h2 className="text-xl font-bold text-accent">MoodRobe</h2>
                            {isAuthenticated && user && (
                                <p className="text-sm text-text-secondary mt-1">Hello, {user.name}</p>
                            )}
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-canvas rounded-lg transition-colors"
                            aria-label="Close sidebar"
                        >
                            <X className="w-5 h-5 text-text-secondary" />
                        </button>
                    </div>

                    {/* Navigation Items */}
                    <nav className="flex-1 overflow-y-auto py-4">
                        <ul className="space-y-1 px-3">
                            {navItems.map((item) => {
                                const Icon = item.icon;
                                const active = isActive(item.path);

                                return (
                                    <li key={item.path}>
                                        <button
                                            onClick={() => handleNavigation(item.path)}
                                            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${active
                                                    ? 'bg-accent/10 text-accent-dark font-medium'
                                                    : 'text-text-primary hover:bg-canvas'
                                                }`}
                                        >
                                            <Icon className={`w-5 h-5 ${active ? 'text-accent' : 'text-text-secondary'}`} />
                                            <span className="flex-1 text-left">{item.label}</span>
                                        </button>
                                    </li>
                                );
                            })}
                        </ul>
                    </nav>

                    {/* Footer */}
                    <div className="p-4 border-t border-border space-y-3">
                        {/* Style Quiz CTA */}
                        <div className="bg-linear-to-r from-canvas to-accent/5 rounded-lg p-4 border border-border">
                            <h3 className="font-semibold text-text-primary mb-1">Style Quiz</h3>
                            <p className="text-sm text-text-secondary mb-3">
                                Discover your aesthetic
                            </p>
                            <button
                                onClick={() => handleNavigation('/style-quiz')}
                                className="w-full px-4 py-2 bg-accent hover:bg-accent-dark text-surface text-sm font-medium rounded-lg transition-colors"
                            >
                                Take Quiz
                            </button>
                        </div>

                        {/* Auth Buttons */}
                        {isAuthenticated ? (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleLogout}
                                className="w-full border-border text-text-primary hover:bg-canvas"
                            >
                                Logout
                            </Button>
                        ) : (
                            <div className="space-y-2">
                                <Button
                                    variant="primary"
                                    size="sm"
                                    onClick={() => handleNavigation('/login')}
                                    className="w-full bg-accent hover:bg-accent-dark text-surface"
                                >
                                    Login
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleNavigation('/register')}
                                    className="w-full border-border text-text-primary hover:bg-canvas"
                                >
                                    Sign Up
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </aside>
        </>
    );
};