export function isSuperTokensEnabled(): boolean {
  return process.env.DISABLE_SUPERTOKENS !== "true";
}

export function getSuperTokensConnectionURI(): string {
  return process.env.SUPERTOKENS_CONNECTION_URI ?? "https://try.supertokens.io";
}

export function getConfiguredAdminUserId(): string | undefined {
  const id = process.env.ADMIN_USER_ID?.trim();
  return id || undefined;
}

export function getConfiguredAdminEmail(): string | undefined {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  return email || undefined;
}

export function isAdminConfigured(): boolean {
  return Boolean(getConfiguredAdminUserId() || getConfiguredAdminEmail());
}

function normalizeEmail(value: unknown): string | undefined {
  if (typeof value !== "string") {
    return undefined;
  }
  const email = value.trim().toLowerCase();
  return email || undefined;
}

/** Single admin: ADMIN_USER_ID wins; otherwise login email must match ADMIN_EMAIL. */
export function resolveIsAdmin(userId: string, loginEmail?: string): boolean {
  const adminUserId = getConfiguredAdminUserId();
  if (adminUserId) {
    return userId === adminUserId;
  }

  const adminEmail = getConfiguredAdminEmail();
  if (!adminEmail) {
    return false;
  }

  const email = normalizeEmail(loginEmail);
  return email === adminEmail;
}

export function extractLoginEmail(formFields: { id: string; value: unknown }[]): string | undefined {
  const emailField = formFields.find((field) => field.id === "email");
  return normalizeEmail(emailField?.value);
}
