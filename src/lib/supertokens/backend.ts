import SuperTokens from "supertokens-node";
import EmailPassword from "supertokens-node/recipe/emailpassword";
import Session from "supertokens-node/recipe/session";
import type { TypeInput } from "supertokens-node/types";
import { appInfo } from "./appInfo";
import {
  extractLoginEmail,
  getConfiguredAdminEmail,
  getSuperTokensConnectionURI,
  resolveIsAdmin,
} from "./admin";

function signUpAllowedForEmail(email: string | undefined): boolean {
  const adminEmail = getConfiguredAdminEmail();
  if (!adminEmail) return false;
  if (!email) return false;
  return email.trim().toLowerCase() === adminEmail;
}

export const backendConfig = (): TypeInput => ({
  framework: "custom",
  supertokens: {
    connectionURI: getSuperTokensConnectionURI(),
    apiKey: process.env.SUPERTOKENS_API_KEY,
  },
  appInfo,
  recipeList: [
    EmailPassword.init({
      override: {
        apis: (original) => ({
          ...original,
          signInPOST: async (input) => {
            const email = extractLoginEmail(input.formFields);
            if (!original.signInPOST) {
              return { status: "GENERAL_ERROR", message: "Sign in is unavailable." };
            }
            return original.signInPOST({
              ...input,
              userContext: { ...(input.userContext ?? {}), loginEmail: email },
            });
          },
          signUpPOST: async (input) => {
            const email = extractLoginEmail(input.formFields);
            if (!signUpAllowedForEmail(email)) {
              return {
                status: "GENERAL_ERROR",
                message: "Registration is limited to the configured site admin email.",
              };
            }
            if (!original.signUpPOST) {
              return { status: "GENERAL_ERROR", message: "Sign up is unavailable." };
            }
            return original.signUpPOST({
              ...input,
              userContext: { ...(input.userContext ?? {}), loginEmail: email },
            });
          },
        }),
      },
    }),
    Session.init({
      override: {
        functions: (original) => ({
          ...original,
          createNewSession: async (input) => {
            const loginEmail = input.userContext?.loginEmail as string | undefined;
            const isAdmin = resolveIsAdmin(input.userId, loginEmail);
            return original.createNewSession({
              ...input,
              accessTokenPayload: {
                ...input.accessTokenPayload,
                isAdmin,
              },
            });
          },
        }),
      },
    }),
  ],
  isInServerlessEnv: true,
});

let initialized = false;

export function ensureSuperTokensInit() {
  if (!initialized) {
    SuperTokens.init(backendConfig());
    initialized = true;
  }
}
