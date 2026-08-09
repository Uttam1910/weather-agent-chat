/**
 * entitlements.js
 * SaaS Monetization Entitlement Boundaries Architecture
 * Defines FREE, PRO, and BUSINESS tier capabilities.
 */

export const TIERS = {
  FREE: 'free',
  PRO: 'pro',
  BUSINESS: 'business',
};

export const TIER_LIMITS = {
  [TIERS.FREE]: {
    name: 'Free Tier',
    savedLocationsMax: 3,
    advancedAlerts: false,
    historicalComparisons: true,
    tripPlannerDaysMax: 5,
    exportReports: false,
  },
  [TIERS.PRO]: {
    name: 'Pro Intelligence',
    savedLocationsMax: 15,
    advancedAlerts: true,
    historicalComparisons: true,
    tripPlannerDaysMax: 16,
    exportReports: true,
  },
  [TIERS.BUSINESS]: {
    name: 'Business Enterprise',
    savedLocationsMax: 100,
    advancedAlerts: true,
    historicalComparisons: true,
    tripPlannerDaysMax: 30,
    exportReports: true,
    apiAccess: true,
  },
};

export const checkEntitlement = (tier = TIERS.FREE, featureKey) => {
  const limits = TIER_LIMITS[tier] || TIER_LIMITS[TIERS.FREE];
  return limits[featureKey];
};
