import { describe, it, expect } from "vitest";
import { appRouter } from "./routers";
import type { Context } from "./_core/context";

describe("Stripe API", () => {
  const mockUser = {
    id: 1,
    openId: "test-user",
    name: "Test User",
    email: "test@example.com",
    role: "user" as const,
    plan: "free" as const,
    creditsRemaining: 3,
  };

  const createMockContext = (user: typeof mockUser | null = mockUser): Context => ({
    user,
    req: {
      headers: {
        origin: "http://localhost:3000",
      },
    } as any,
    res: {} as any,
  });

  it("should get available plans", async () => {
    const caller = appRouter.createCaller(createMockContext(null));
    
    const plans = await caller.stripe.getPlans();
    
    expect(Array.isArray(plans)).toBe(true);
    expect(plans.length).toBeGreaterThan(0);
    expect(plans[0]).toHaveProperty("id");
    expect(plans[0]).toHaveProperty("name");
    expect(plans[0]).toHaveProperty("priceMonthly");
  });

  it("should create checkout session for creator plan", async () => {
    const caller = appRouter.createCaller(createMockContext());
    
    const result = await caller.stripe.createCheckout({
      planId: "creator",
      interval: "month",
    });
    
    expect(result).toHaveProperty("checkoutUrl");
    expect(result.checkoutUrl).toContain("checkout.stripe.com");
  });

  it("should create checkout session for pro plan", async () => {
    const caller = appRouter.createCaller(createMockContext());
    
    const result = await caller.stripe.createCheckout({
      planId: "pro",
      interval: "year",
    });
    
    expect(result).toHaveProperty("checkoutUrl");
    expect(result.checkoutUrl).toContain("checkout.stripe.com");
  });

  it("should fail to create checkout when not authenticated", async () => {
    const caller = appRouter.createCaller(createMockContext(null));
    
    await expect(
      caller.stripe.createCheckout({
        planId: "creator",
        interval: "month",
      })
    ).rejects.toThrow();
  });
});
