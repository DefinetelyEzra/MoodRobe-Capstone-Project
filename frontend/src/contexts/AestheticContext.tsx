import { createContext } from 'react';
import { Aesthetic } from '@/types/aesthetic.types';

export interface AestheticContextType {
  selectedAesthetic: Aesthetic | null;
  availableAesthetics: Aesthetic[];
  isLoading: boolean;
  error: string | null;
  setSelectedAesthetic: (aesthetic: Aesthetic | null) => void;
  loadAesthetics: () => Promise<void>;
}

export const AestheticContext = createContext<AestheticContextType | undefined>(undefined);