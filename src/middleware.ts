import createMiddleware from "next-intl/middleware";

export default createMiddleware({
  // A list of all locales that are supported
  locales: ["gu", "en"],

  // Used when no locale matches
  defaultLocale: "gu",
});

export const config = {
  // Match only internationalized pathnames
  matcher: ["/", "/(gu|en)/:path*"],
};
