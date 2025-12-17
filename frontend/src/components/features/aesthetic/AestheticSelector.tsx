import React from 'react';
import { Palette, Check } from 'lucide-react';
import { Aesthetic } from '@/types/aesthetic.types';

interface AestheticSelectorProps {
    aesthetics: Aesthetic[];
    selectedAesthetic: Aesthetic | null;
    onSelect: (aesthetic: Aesthetic) => void;
    variant?: 'compact' | 'full';
    showDescription?: boolean;
}

export const AestheticSelector: React.FC<AestheticSelectorProps> = ({
    aesthetics,
    selectedAesthetic,
    onSelect,
    variant = 'compact',
    showDescription = false,
}) => {
    if (variant === 'compact') {
        return (
            <div className="flex items-center space-x-4 overflow-x-auto pb-2">
                {aesthetics.map((aesthetic) => {
                    const isSelected = selectedAesthetic?.id === aesthetic.id;

                    return (
                        <button
                            key={aesthetic.id}
                            onClick={() => onSelect(aesthetic)}
                            className={`
                                relative shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-full 
                                overflow-hidden border-4 transition-all duration-300 
                                hover:scale-110 focus:outline-none focus:ring-2 
                                focus:ring-offset-2 focus:ring-teal-500
                                ${isSelected
                                    ? 'border-teal-600 shadow-xl scale-110'
                                    : 'border-gray-200 shadow-md hover:border-teal-300'
                                }
                            `}
                            aria-label={`Select ${aesthetic.name} aesthetic`}
                            title={aesthetic.name}
                        >
                            {aesthetic.imageUrl ? (
                                <img
                                    src={aesthetic.imageUrl}
                                    alt={aesthetic.name}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div
                                    className="w-full h-full flex items-center justify-center"
                                    style={{
                                        background: `linear-gradient(135deg, ${aesthetic.themeProperties.colors[0] || '#14b8a6'
                                            }, ${aesthetic.themeProperties.colors[1] || '#0f766e'
                                            })`
                                    }}
                                >
                                    <Palette className="w-8 h-8 text-white" />
                                </div>
                            )}

                            {isSelected && (
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                    <Check className="w-8 h-8 text-white" strokeWidth={3} />
                                </div>
                            )}
                        </button>
                    );
                })}
            </div>
        );
    }

    // Full variant - grid layout with cards
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {aesthetics.map((aesthetic) => {
                const isSelected = selectedAesthetic?.id === aesthetic.id;

                return (
                    <button
                        key={aesthetic.id}
                        onClick={() => onSelect(aesthetic)}
                        className={`
                            relative text-left rounded-xl overflow-hidden 
                            transition-all duration-300 hover:scale-105
                            focus:outline-none focus:ring-4 focus:ring-teal-500
                            ${isSelected
                                ? 'ring-4 ring-teal-600 shadow-2xl'
                                : 'shadow-lg hover:shadow-xl'
                            }
                        `}
                    >
                        {/* Image or gradient background */}
                        <div className="relative h-48 overflow-hidden">
                            {aesthetic.imageUrl ? (
                                <img
                                    src={aesthetic.imageUrl}
                                    alt={aesthetic.name}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div
                                    className="w-full h-full"
                                    style={{
                                        background: `linear-gradient(135deg, ${aesthetic.themeProperties.colors[0] || '#14b8a6'
                                            }, ${aesthetic.themeProperties.colors[1] || '#0f766e'
                                            })`
                                    }}
                                />
                            )}

                            {isSelected && (
                                <div className="absolute top-4 right-4 bg-teal-600 text-white rounded-full p-2">
                                    <Check className="w-5 h-5" strokeWidth={3} />
                                </div>
                            )}
                        </div>

                        {/* Content */}
                        <div className="bg-white p-6">
                            <h3 className="text-xl font-bold text-gray-900 mb-2">
                                {aesthetic.name}
                            </h3>

                            {showDescription && (
                                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                                    {aesthetic.description}
                                </p>
                            )}

                            {/* Color palette preview */}
                            <div className="flex gap-2 flex-wrap">
                                {aesthetic.themeProperties.colors.slice(0, 5).map((color) => (
                                    <div
                                        key={`${aesthetic.id}-color-${color}`}
                                        className="w-8 h-8 rounded-full border-2 border-gray-200 shadow-sm"
                                        style={{ backgroundColor: color }}
                                        title={color}
                                    />
                                ))}
                            </div>
                        </div>
                    </button>
                );
            })}
        </div>
    );
};