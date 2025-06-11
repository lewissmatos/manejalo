import { ThemeSelector } from "@/components/theme/theme-selector";
import { getTranslations } from "next-intl/server";

import features from "@/lib/constants/app-features.json";
import * as React from "react";
import MainPageBottomContent from "./_components/main-page-bottom-content";
import LanguageSelector from "@/components/language/language-selector";
import { Footer } from "react-day-picker";
import HomePageFooter from "./_components/home-page-footer";
import {
	HoverCard,
	HoverCardContent,
	HoverCardTrigger,
} from "@/components/ui/hover-card";

const metadata = {
	title: "Manejalo! - Home",
	description: "Manejalo! is a personal finance management app.",
	openGraph: {
		title: "Manejalo! - Home",
		description: "Manejalo! is a personal finance management app.",
	},
};
export default async function HomePage() {
	const t = await getTranslations("HomePage");

	return (
		<>
			<div className="flex flex-col items-center p-4">
				<section className="w-full flex justify-between items-start mb-8 gap-4">
					<div className="w-1/5 hidden md:flex justify-start">
						<ThemeSelector />
					</div>
					<div className="bg-secondary/50 h-32 w-full items-center md:w-3/5 flex flex-col justify-center rounded-lg shadow-md p-4 ">
						<h1 className="text-5xl font-semibold text-primary">
							{"Manejalo!"}
						</h1>
						<p>{t("slogan")}</p>
					</div>
					<div className="w-1/5 hidden md:flex justify-end">
						<LanguageSelector />
					</div>
				</section>
				<div className="flex md:hidden w-full justify-between items-center">
					<ThemeSelector />
					<LanguageSelector />
				</div>
				<section className="py-8">
					<div className="max-w-5xl mx-auto px-4">
						<h2 className="text-3xl font-bold mb-8 text-center">
							📌 {t("features.title")}
						</h2>
						<main className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
							{features.map((feature) => (
								<HoverCard key={feature.key}>
									<HoverCardTrigger>
										<div className="bg-white  dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-4 shadow-sm ">
											<div className="text-3xl mb-2">{feature.icon}</div>
											<h3 className="text-xl font-semibold mb-1">
												{t(`features.${feature.key}.title`)}
											</h3>
											<p className="text-sm text-zinc-600 dark:text-zinc-400">
												{t(`features.${feature.key}.description`)}
											</p>
										</div>
									</HoverCardTrigger>
									<HoverCardContent>
										{t(`features.${feature.key}.tooltip`)}
									</HoverCardContent>
								</HoverCard>
							))}
						</main>
					</div>
				</section>
				<section className="py-2">
					<MainPageBottomContent />
				</section>
			</div>
			<HomePageFooter />
		</>
	);
}
