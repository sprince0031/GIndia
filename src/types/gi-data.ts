export type GICategory = 
  | 'Handicraft'
  | 'Agricultural'
  | 'Food Stuff'
  | 'Manufactured'
  | 'Natural Goods';

export type CardinalOrientation = 
  | 'east'
  | 'west'
  | 'north'
  | 'south'
  | 'central'
  | 'northeast';

export interface GIProduct {
  id: string;
  name: string;
  stateId: string;
  stateName: string;
  category: GICategory;
  year?: string;
  registrationNumber?: string | number;
  description: string;
  culturalSignificance: string;
  keyFeatures: string[];
  imageUrl: string;
  regionOrientation: CardinalOrientation;
  phonetic?: string;
  tags?: string[];
}

export interface StateMetadata {
  id: string;
  name: string;
  code: string;
  capital: string;
  orientation: CardinalOrientation;
  productCount: number;
  featuredProductIds: string[];
  otherGis?: string[];
  centroid3D?: { x: number; y: number; z: number };
}

export interface CategoryInfo {
  id: GICategory;
  name: GICategory;
  color: string;
  badgeClass: string;
  description: string;
}

export interface TopStateRank {
  name: string;
  count: number;
  code: string;
}

export interface ExhibitionSummary {
  totalStatesCovered: number;
  totalFeaturedProducts: number;
  totalCatalogEntries: number;
  categoriesCount: Record<GICategory, number>;
  topStatesByGI: TopStateRank[];
}

export interface GIDatabase {
  version: string;
  lastUpdated: string;
  categories: CategoryInfo[];
  states: Record<string, StateMetadata>;
  products: GIProduct[];
  summary: ExhibitionSummary;
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