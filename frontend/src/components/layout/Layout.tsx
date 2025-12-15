import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';
import { Sidebar } from './Sidebar';
import { Menu } from 'lucide-react';

interface LayoutProps {
    children?: React.ReactNode;
    showSidebar?: boolean;
    showFooter?: boolean;
}

export const Layout: React.FC<LayoutProps> = ({
    children,
    showSidebar = false,
    showFooter = true,
}) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    return (
        <div className="min-h-screen flex flex-col bg-neutral-50">
            <Header />

            <div className="flex flex-1 relative">
                {/* Sidebar */}
                {showSidebar && (
                    <>
                        {/* Mobile Menu Button */}
                        <button
                            onClick={toggleSidebar}
                            className="lg:hidden fixed bottom-6 right-6 z-30 p-4 bg-teal-600 hover:bg-teal-700 text-white rounded-full shadow-lg transition-all duration-300 hover:scale-110"
                            aria-label="Toggle menu"
                        >
                            <Menu className="w-6 h-6" />
                        </button>

                        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
                    </>
                )}

                {/* Main Content */}
                <main className="flex-1 w-full">
                    {children || <Outlet />}
                </main>
            </div>

            {/* Footer */}
            {showFooter && <Footer />}
        </div>
    );
};