import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';
import { Sidebar } from './Sidebar';

interface LayoutProps {
    children?: React.ReactNode;
    showFooter?: boolean;
}

export const Layout: React.FC<LayoutProps> = ({
    children,
    showFooter = true,
}) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    return (
        <div className="min-h-screen flex flex-col bg-neutral-50">
            <Header onMenuClick={toggleSidebar} />
            
            {/* Mobile Sidebar */}
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            {/* Main Content */}
            <main className="flex-1 w-full">
                {children || <Outlet />}
            </main>

            {/* Footer */}
            {showFooter && <Footer />}
        </div>
    );
};