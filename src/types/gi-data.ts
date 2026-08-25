export type GICategory = 
  | 'Handicraft'
  | 'Agricultural'
  | 'Food Stuff'
  | 'Manufactured'
  | 'Natural Goods';

export interface GIProduct {
  id: string;
  name: string;
  stateId: string;
  stateName: string;
  category: GICategory;
  year?: string;
  registrationNumber?: number | string;
  description: string;
  culturalSignificance: string;
  keyFeatures: string[];
  imageUrl: string;
  regionOrientation: 'east' | 'west' | 'north' | 'south' | 'central' | 'northeast';
  tags?: string[];
}

export interface StateMetadata {
  id: string;
  name: string;
  code: string;
  capital: string;
  orientation: 'east' | 'west' | 'north' | 'south' | 'central' | 'northeast';
  productCount: number;
  featuredProductIds: string[];
  centroid3D?: { x: number; y: number; z: number };
}

export interface GIDatabase {
  states: Record<string, StateMetadata>;
  products: GIProduct[];
  categories: {
    name: GICategory;
    color: string;
    badgeClass: string;
    description: string;
  }[];
}

export interface ExhibitionState {
  selectedStateId: string | null;
  activeProductId: string | null;
  isTourActive: boolean;
  isSpeechEnabled: boolean;
  activeCategoryFilter: GICategory | 'All';
  isWebGLSupported: boolean;
  tourSpeedMs: number;
}
