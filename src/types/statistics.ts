export type IndicatorStatus = 'available' | 'unavailable';

export interface StatCategoryItem {
  id: string;
  label: string;
  percentage: number;
  per100Rounded: number;
  per100Grid: number;
  populationDisplay?: string;
  color: string;
  note?: string;
}

export interface IndicatorMetadata {
  indicatorName: string;
  per100Summary: string;
  dataYear: string;
  sourceOrganization: string;
  sourceUrl: string | null;
  definitionAndDenominator: string;
  status: IndicatorStatus;
  roundingNote?: string;
  extraNotes?: string[];
}

export interface DistributionSection extends IndicatorMetadata {
  id: string;
  categoryLabel: string;
  items: StatCategoryItem[];
  exactPercentageSum?: number;
  roundedCountSum?: number;
}

export interface AverageSection extends IndicatorMetadata {
  id: string;
  categoryLabel: string;
  value: number;
  unit: string;
  reference2026Projection?: string;
}

export interface UnavailableSection extends IndicatorMetadata {
  id: string;
  categoryLabel: string;
  reason: string;
}

export interface WorldStatisticsData {
  metadata: {
    title: string;
    subtitle: string;
    referenceDate: string;
    populationBaseYear: number;
    worldPopulationEstimate: number;
    worldPopulationDisplay: string;
  };
  population: DistributionSection;
  income: DistributionSection & { pppBasis: string };
  healthDrinkingWater: DistributionSection;
  healthLifeExpectancy: AverageSection;
  education: DistributionSection;
  information: DistributionSection;
  religion: DistributionSection;
  language: UnavailableSection;
}

export interface UserProfileInput {
  age: string;
  region: string;
  dailySpendingUsd: string;
  drinkingWater: string;
  literacy: string;
  internet: string;
  nativeLanguage: string;
  religion: string;
}
