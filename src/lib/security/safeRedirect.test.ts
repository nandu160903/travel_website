import { describe, expect, it } from "vitest";
import { safeRedirectPath } from "./safeRedirect";

describe("safeRedirectPath", () => {
  it("allows internal paths", () => {
    expect(safeRedirectPath("/journeys", "/")).toBe("/journeys");
    expect(safeRedirectPath("/studio/settings", "/")).toBe("/studio/settings");
  });

  it("blocks external and protocol-relative URLs", () => {
    expect(safeRedirectPath("https://evil.test", "/")).toBe("/");
    expect(safeRedirectPath("//evil.test/phish", "/")).toBe("/");
    expect(safeRedirectPath("javascript:alert(1)", "/")).toBe("/");
  });

  it("uses fallback when empty", () => {
    expect(safeRedirectPath(null, "/studio")).toBe("/studio");
  });
});
