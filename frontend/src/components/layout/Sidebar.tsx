import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, ShoppingBag, Palette, User, ShoppingCart, Heart, Clock, X } from 'lucide-react';

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

interface NavItem {
    icon: React.ElementType;
    label: string;
    path: string;
    badge?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
    const navigate = useNavigate();
    const location = useLocation();

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

    const isActive = (path: string) => {
        return location.pathname === path;
    };

    return (
        <>
            {/* Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={onClose}
                    aria-hidden="true"
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed top-0 left-0 h-full w-64 bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'
                    } lg:translate-x-0 lg:static lg:shadow-none`}
            >
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-gray-200">
                        <h2 className="text-xl font-bold text-teal-800">Menu</h2>
                        <button
                            onClick={onClose}
                            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            aria-label="Close sidebar"
                        >
                            <X className="w-5 h-5 text-gray-600" />
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
                                                    ? 'bg-teal-50 text-teal-700 font-medium'
                                                    : 'text-gray-700 hover:bg-gray-50'
                                                }`}
                                        >
                                            <Icon className={`w-5 h-5 ${active ? 'text-teal-600' : 'text-gray-500'}`} />
                                            <span className="flex-1 text-left">{item.label}</span>
                                            {item.badge && (
                                                <span className="bg-teal-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                                                    {item.badge}
                                                </span>
                                            )}
                                        </button>
                                    </li>
                                );
                            })}
                        </ul>
                    </nav>

                    {/* Footer */}
                    <div className="p-4 border-t border-gray-200">
                        <div className="bg-linear-to-r from-teal-50 to-teal-100 rounded-lg p-4">
                            <h3 className="font-semibold text-teal-900 mb-1">Style Quiz</h3>
                            <p className="text-sm text-teal-700 mb-3">
                                Discover your aesthetic
                            </p>
                            <button
                                onClick={() => handleNavigation('/style-quiz')}
                                className="w-full px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium rounded-lg transition-colors"
                            >
                                Take Quiz
                            </button>
                        </div>
                    </div>
                </div>
            </aside>
        </>
    );
};