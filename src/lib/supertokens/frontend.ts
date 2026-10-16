"use client";

import EmailPassword from "supertokens-auth-react/recipe/emailpassword";
import Session from "supertokens-auth-react/recipe/session";
import type { SuperTokensConfig } from "supertokens-auth-react/lib/build/types";
import { appInfo } from "./appInfo";

type Router = {
  push: (href: string) => void;
};

const routerInfo: { router?: Router; pathName?: string } = {};

export function setSuperTokensRouter(router: Router, pathName: string) {
  routerInfo.router = router;
  routerInfo.pathName = pathName;
}

export const frontendConfig = (): SuperTokensConfig => ({
  appInfo,
  recipeList: [EmailPassword.init(), Session.init()],
  windowHandler: (orig) => ({
    ...orig,
    location: {
      ...orig.location,
      getPathName: () => routerInfo.pathName ?? window.location.pathname,
      assign: (url) => routerInfo.router?.push(url.toString()),
      setHref: (url) => routerInfo.router?.push(url.toString()),
    },
  }),
});
