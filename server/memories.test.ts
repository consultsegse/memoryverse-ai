import { describe, it, expect } from "vitest";
import { PLANS, getPlanConfig, getCreditsForPlan, canCreateMemory } from "./stripe/products";

describe("Memory Business Logic", () => {
  it("should get correct credits for free plan", () => {
    const credits = getCreditsForPlan("free");
    expect(credits).toBe(3);
  });

  it("should get correct credits for creator plan", () => {
    const credits = getCreditsForPlan("creator");
    expect(credits).toBe(30);
  });

  it("should get correct credits for pro plan", () => {
    const credits = getCreditsForPlan("pro");
    expect(credits).toBe(-1); // Unlimited
  });

  it("should allow creating memory when under limit", () => {
    const canCreate = canCreateMemory("free", 2);
    expect(canCreate).toBe(true);
  });

  it("should block creating memory when at limit", () => {
    const canCreate = canCreateMemory("free", 3);
    expect(canCreate).toBe(false);
  });

  it("should allow unlimited memories for pro plan", () => {
    const canCreate = canCreateMemory("pro", 1000);
    expect(canCreate).toBe(true);
  });

  it("should get plan configuration", () => {
    const plan = getPlanConfig("creator");
    expect(plan).toBeDefined();
    expect(plan?.name).toBe("Creator");
    expect(plan?.priceMonthly).toBe(9700);
  });

  it("should return null for invalid plan", () => {
    const plan = getPlanConfig("invalid");
    expect(plan).toBeNull();
  });
});
