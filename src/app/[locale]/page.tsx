import { ThemeSelector } from "@/components/theme/theme-selector";
import { getTranslations } from "next-intl/server";

import features from "@/lib/constants/app-features.json";
import * as React from "react";
import MainPageBottomContent from "./_components/main-page-bottom-content";
import LanguageSelector from "@/components/language/language-selector";
import HomePageFooter from "./_components/home-page-footer";
import {
	HoverCard,
	HoverCardContent,
	HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Metadata } from "next";

export const metadata: Metadata = {
	title: "Presupuestalo - Controla tus Finanzas",
	description:
		"Tu aplicación para gestionar presupuestos, gastos y ahorros de forma sencilla.",
	keywords: [
		"presupuestalo",
		"presupu3stalo",
		"finanzas",
		"presupuesto",
		"ahorros",
		"gastos",
	],
	openGraph: {
		title: "Presupuestalo",
		description: "Tu app para finanzas personales",
		url: "https://presupu3stal.vercel.app",
		siteName: "Presupuestalo",
		locale: "es_DO",
		type: "website",
	},
};
export default async function HomePage() {
	const t = await getTranslations("HomePage");

	return (
		<div className="flex flex-col min-h-screen bg-background justify-between">
			<div className="flex flex-col items-center p-2 justify-between">
				<section className="w-full flex justify-between items-start mb-4 gap-4">
					<div className="w-1/5 hidden md:flex justify-start" />
					<div className="h-32 w-full items-center md:w-3/5 flex flex-col justify-center p-4 gap-2">
						<div className="flex items-center">
							<h1 className="text-4Presupuestaloxl font-bold text-primary">
								PRESUPU3STALO!
							</h1>
						</div>
						<p className="text-muted-foreground">{t("slogan")}</p>
					</div>
					<div className="w-1/5 hidden md:flex gap-2 justify-end">
						<ThemeSelector />
						<LanguageSelector />
					</div>
				</section>
				<div className="flex md:hidden w-full justify-between items-center">
					<ThemeSelector />
					<LanguageSelector />
				</div>
				<section className="py-4">
					<div className="w-full md:max-w-7xl mx-auto px-2">
						<h2 className="text-2xl font-semibold mb-4 text-center text-muted-foreground">
							📌 {t("features.title")}
						</h2>
						<main className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
							{features.map((feature) => (
								<HoverCard key={feature.key}>
									<HoverCardTrigger>
										<Card
											className={`w-full md:w-96 p-2 h-44 gap-2 justify-between `}
										>
											<CardHeader className="p-0 flex flex-row gap-2 items-center text-4xl">
												<CardTitle className="line-clamp-2 max-w-72 font-semibold ">
													{feature.icon}
												</CardTitle>
											</CardHeader>
											<CardContent className="p-0 flex flex-row gap-2 items-center">
												<CardDescription className="line-clamp-2 text-2xl text-primary">
													{t(`features.${feature.key}.title`)}
												</CardDescription>
											</CardContent>
											<CardFooter className="flex flex-row gap-2 items-start p-0 justify-between text-muted-foreground">
												{t(`features.${feature.key}.description`)}
											</CardFooter>
										</Card>
									</HoverCardTrigger>
									<HoverCardContent>
										{t(`features.${feature.key}.tooltip`)}
									</HoverCardContent>
								</HoverCard>
							))}
						</main>
					</div>
				</section>
				<section className="pt-8">
					<MainPageBottomContent />
				</section>
			</div>
			<HomePageFooter />
		</div>
	);
}
