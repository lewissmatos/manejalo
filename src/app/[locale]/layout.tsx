import { NextIntlClientProvider, hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { Metadata } from "next";
import { Outfit } from "next/font/google";
import "../globals.css";
import { ThemeProvider } from "@/components/theme/theme-providder";
import { Toaster } from "@/components/ui/sonner";
import { ReactQueryClientProvider } from "@/lib/tanstack-query/tanstack-query-provider";

const font = Outfit({
	variable: "--font-sans",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "Manejalo!",
	description: "Your personal budget manager",
};

export default async function LocaleLayout({
	children,
	params,
}: {
	children: React.ReactNode;
	params: Promise<{ locale: string }>;
}) {
	// Ensure that the incoming `locale` is valid
	const { locale } = await params;
	if (!hasLocale(routing.locales, locale)) {
		notFound();
	}

	return (
		<ReactQueryClientProvider>
			<html lang={locale} className={font.className} suppressHydrationWarning>
				<head />
				<body
					suppressHydrationWarning
					className={`${font.variable} antialiased`}
				>
					<ThemeProvider attribute="class" defaultTheme="system" enableSystem>
						<NextIntlClientProvider>{children}</NextIntlClientProvider>
						<Toaster />
					</ThemeProvider>
				</body>
			</html>
		</ReactQueryClientProvider>
	);
}
