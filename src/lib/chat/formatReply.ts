/** Turn model output into spaced blocks: one place, blank line, next place. */
export function formatNearbyPlacesReply(raw: string): string {
  let text = raw.trim();
  if (!text) {
    return text;
  }

  let footer = "";
  const footerMatch = text.match(
    /\s*(Verify[\s\S]{0,160}before riding\.?)\s*$/i
  );
  if (footerMatch?.index != null) {
    footer = footerMatch[1].trim();
    text = text.slice(0, footerMatch.index).trim();
  }

  // " - Place B" on one line → newline before Place B
  text = text.replace(/\s+-\s+(?=[A-ZÀ-ÖØ-Þ])/g, "\n\n");
  text = text.replace(/^[\-*•]\s+/gm, "");
  text = text.replace(/^\d+[.)]\s+/gm, "");

  const places = text
    .split(/\n{2,}|\n/)
    .map((p) => p.trim())
    .filter(Boolean);

  const body = places.join("\n\n");
  if (!footer) {
    return body;
  }
  return `${body}\n\n${footer}`;
}
