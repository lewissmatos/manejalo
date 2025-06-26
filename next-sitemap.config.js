/** @type {import('next-sitemap').IConfig} */
module.exports = {
	siteUrl: "https://presupu3stalo.vercel.app",
	generateRobotsTxt: true,
	changefreq: "weekly",
	priority: 0.7,
	sitemapSize: 5000,
	exclude: ["/api/*"],
	robotsTxtOptions: {
		policies: [
			{
				userAgent: "*",
				allow: "/",
			},
		],
	},
	i18n: {
		locales: ["es", "en"],
		defaultLocale: "es",
	},
};
