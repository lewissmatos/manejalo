import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
	locales: ["en", "es"],
	localePrefix: "never", // "always" or "never"
	defaultLocale: "es",
});
