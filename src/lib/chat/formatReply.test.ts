import { describe, expect, it } from "vitest";
import { formatNearbyPlacesReply } from "./formatReply";

describe("formatNearbyPlacesReply", () => {
  it("splits inline dash-separated places onto separate blocks", () => {
    const raw =
      "- Alpha Spot – 5 km north; views. - Beta Falls – 10 km east; water.";
    const out = formatNearbyPlacesReply(raw);
    expect(out).toContain("Alpha Spot");
    expect(out).toContain("\n\nBeta Falls");
  });

  it("keeps verify footer on its own paragraph", () => {
    const raw =
      "Alpha – 1 km; nice. Verify opening hours and road conditions locally before riding.";
    const out = formatNearbyPlacesReply(raw);
    expect(out.endsWith("Verify opening hours and road conditions locally before riding.")).toBe(
      true
    );
  });
});
