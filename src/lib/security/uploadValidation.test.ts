import { describe, expect, it } from "vitest";
import {
  sanitizeUploadFilename,
  validateUploadFile,
} from "./uploadValidation";

describe("uploadValidation", () => {
  it("rejects path segments in filenames", () => {
    expect(sanitizeUploadFilename("../../etc/passwd")).not.toContain("..");
    expect(sanitizeUploadFilename("../../etc/passwd")).not.toContain("/");
  });

  it("rejects disallowed mime types", () => {
    const file = { size: 100, type: "application/x-msdownload" } as File;
    expect(validateUploadFile(file)).toMatch(/not allowed/i);
  });

  it("accepts small jpeg uploads", () => {
    const file = { size: 1024, type: "image/jpeg" } as File;
    expect(validateUploadFile(file)).toBeNull();
  });
});
