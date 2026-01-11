import React from 'react';
import { OutfitType, OUTFIT_TEMPLATES } from '@/types/outfit.types';
import { Card } from '@/components/common/Card';

interface OutfitTypeSelectorProps {
    selectedType: OutfitType;
    onSelect: (type: OutfitType) => void;
}

export const OutfitTypeSelector: React.FC<OutfitTypeSelectorProps> = ({
    selectedType,
    onSelect
}) => {
    const handleKeyDown = (e: React.KeyboardEvent, type: OutfitType) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onSelect(type);
        }
    };

    return (
        <div className="mb-8">
            <h3 className="text-lg font-semibold text-text-primary mb-4">
                Choose Outfit Template
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {OUTFIT_TEMPLATES.map((template) => (
                    <Card
                        key={template.type}
                        className={`cursor-pointer transition-all ${selectedType === template.type
                                ? 'border-2 border-accent bg-accent/5'
                                : 'border border-border hover:border-accent/50'
                            }`}
                        onClick={() => onSelect(template.type)}
                    >
                        <div
                            className="p-4 text-center"
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => handleKeyDown(e, template.type)}
                            aria-pressed={selectedType === template.type}
                        >
                            <h4 className={`font-semibold mb-1 ${selectedType === template.type
                                    ? 'text-accent'
                                    : 'text-text-primary'
                                }`}>
                                {template.label}
                            </h4>
                            <p className="text-xs text-text-secondary mb-2">
                                {template.description}
                            </p>
                            <div className="flex flex-wrap gap-1 justify-center">
                                {template.slots.map((slot) => (
                                    <span
                                        key={slot}
                                        className="px-2 py-0.5 bg-canvas text-text-secondary text-xs rounded-full"
                                    >
                                        {slot}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
};