import React from 'react';
import { useNavigate } from 'react-router-dom';

export const Footer: React.FC = () => {
    const navigate = useNavigate();
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-text-primary text-canvas mt-auto border-t border-text-secondary/20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                    {/* Brand Column */}
                    <div className="md:col-span-1">
                        <h3 className="text-2xl font-bold mb-4 text-accent-light">Moodrobe</h3>
                        <p className="text-canvas/80 text-sm leading-relaxed">
                            Your aesthetic-driven fashion destination. Express yourself through curated style.
                        </p>
                    </div>

                    {/* Shop Column */}
                    <div>
                        <h4 className="font-semibold text-lg mb-4 text-surface">Shop</h4>
                        <ul className="space-y-2 text-canvas/80 text-sm">
                            <li>
                                <button
                                    onClick={() => navigate('/products')}
                                    className="hover:text-accent-light transition-colors text-left"
                                >
                                    All Products
                                </button>
                            </li>
                            <li>
                                <button
                                    onClick={() => navigate('/products?filter=new')}
                                    className="hover:text-accent-light transition-colors text-left"
                                >
                                    New Arrivals
                                </button>
                            </li>
                            <li>
                                <button
                                    onClick={() => navigate('/products?filter=bestsellers')}
                                    className="hover:text-accent-light transition-colors text-left"
                                >
                                    Best Sellers
                                </button>
                            </li>
                            <li>
                                <button
                                    onClick={() => navigate('/products?filter=sale')}
                                    className="hover:text-accent-light transition-colors text-left"
                                >
                                    Sale
                                </button>
                            </li>
                        </ul>
                    </div>

                    {/* Help Column */}
                    <div>
                        <h4 className="font-semibold text-lg mb-4 text-surface">Help</h4>
                        <ul className="space-y-2 text-canvas/80 text-sm">
                            <li>
                                <a href="#faq" className="hover:text-accent-light transition-colors">
                                    FAQ
                                </a>
                            </li>
                            <li>
                                <a href="#shipping" className="hover:text-accent-light transition-colors">
                                    Shipping
                                </a>
                            </li>
                            <li>
                                <a href="#returns" className="hover:text-accent-light transition-colors">
                                    Returns
                                </a>
                            </li>
                            <li>
                                <a href="#contact" className="hover:text-accent-light transition-colors">
                                    Contact Us
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* About Column */}
                    <div>
                        <h4 className="font-semibold text-lg mb-4 text-surface">About</h4>
                        <ul className="space-y-2 text-canvas/80 text-sm">
                            <li>
                                <button
                                    onClick={() => navigate('/about')}
                                    className="hover:text-accent-light transition-colors text-left"
                                >
                                    Our Story
                                </button>
                            </li>
                            <li>
                                <button
                                    onClick={() => navigate('/aesthetic-selection')}
                                    className="hover:text-accent-light transition-colors text-left"
                                >
                                    Aesthetics Guide
                                </button>
                            </li>
                            <li>
                                <a href="#blog" className="hover:text-accent-light transition-colors">
                                    Blog
                                </a>
                            </li>
                            <li>
                                <a href="#careers" className="hover:text-accent-light transition-colors">
                                    Careers
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-text-secondary/30 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-canvas/60 text-sm">
                        © {currentYear} Moodrobe. All rights reserved.
                    </p>
                    <div className="flex flex-wrap justify-center gap-6">
                        <a href="#privacy" className="text-canvas/60 hover:text-accent-light transition-colors text-sm">
                            Privacy Policy
                        </a>
                        <a href="#terms" className="text-canvas/60 hover:text-accent-light transition-colors text-sm">
                            Terms of Service
                        </a>
                        <a href="#cookies" className="text-canvas/60 hover:text-accent-light transition-colors text-sm">
                            Cookie Policy
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
};