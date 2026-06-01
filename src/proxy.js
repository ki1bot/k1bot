import { handleReloadToHomeProxy } from "./middleware/middleware";

export function proxy(request) {
  return handleReloadToHomeProxy(request);
}

export const config = {
  matcher: ["/about", "/experience", "/projects", "/portfolio", "/contact"],
};
