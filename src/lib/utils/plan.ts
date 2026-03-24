// src/lib/utils/plan.ts
export const planConfig = {
  free: { label: "Darmowy", limit: 10, price: 0 },
  starter: { label: "Starter", limit: 50, price: 99 },
  growth: { label: "Growth", limit: 100, price: 199 },
  business: { label: "Business", limit: 150, price: 299 },
  enterprise: { label: "Enterprise", limit: 200, price: 399 },
} as const;

export type Plan = keyof typeof planConfig;

export function getPlanLimit(plan: string): number {
  return planConfig[plan as Plan]?.limit ?? 10;
}

export function isPro(plan: string): boolean {
  return plan !== "free";
}

export function getRecommendedPlan(assetCount: number): Plan {
  if (assetCount <= 10) return "free";
  if (assetCount <= 50) return "starter";
  if (assetCount <= 100) return "growth";
  if (assetCount <= 150) return "business";
  return "enterprise";
}
