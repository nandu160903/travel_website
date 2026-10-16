import DOMPurify from "isomorphic-dompurify";

/** Sanitize CMS/story HTML before rendering (mitigates stored XSS). */
export function sanitizeCmsHtml(html: string): string {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [
      "p",
      "br",
      "strong",
      "em",
      "a",
      "h2",
      "h3",
      "h4",
      "ul",
      "ol",
      "li",
      "blockquote",
      "figure",
      "figcaption",
      "img",
      "hr",
    ],
    ALLOWED_ATTR: ["href", "src", "alt", "title", "class", "loading"],
    ALLOW_DATA_ATTR: false,
  });
}
