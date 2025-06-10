import LanguageSelector from "@/components/language-selector";
import { ThemeSelector } from "@/components/theme/theme-selector";
import { getTranslations } from "next-intl/server";

import features from "../../../data/app-features.json";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import * as React from "react";
import MainPageBottomContent from "./_components/MainPageBottomContent";

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
		<div className="flex flex-col items-center min-h-screen p-4">
			<section className="w-full flex justify-between items-start mb-8 gap-4">
				<div className="w-1/5 ">
					<ThemeSelector />
				</div>
				<div className="bg-secondary h-32 md:w-3/5 w-full flex justify-center items-start rounded-lg shadow-md p-4">
					<div className="items-center flex flex-col gap-2 h-full w-3/5">
						<h1 className="text-6xl font-semibold">{"Manejalo!"}</h1>
						<p>{t("slogan")}</p>
					</div>
				</div>
				<div className="w-1/5 flex justify-end">
					<LanguageSelector />
				</div>
			</section>
			<section className="py-12">
				<div className="max-w-5xl mx-auto px-4">
					<h2 className="text-3xl font-bold mb-8 text-center">
						📌 {t("features.title")}
					</h2>
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
						{features.map((feature) => (
							<Tooltip key={feature.key}>
								<TooltipTrigger>
									<div className="bg-white  dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-4 shadow-sm ">
										<div className="text-3xl mb-2">{feature.icon}</div>
										<h3 className="text-xl font-semibold mb-1">
											{t(`features.${feature.key}.title`)}
										</h3>
										<p className="text-sm text-zinc-600 dark:text-zinc-400">
											{t(`features.${feature.key}.description`)}
										</p>
									</div>
								</TooltipTrigger>
								<TooltipContent className=" bg-background max-w-xs border border-zinc-200 dark:border-zinc-800 rounded-lg p-4 shadow-sm">
									<p className="text-lg text-foreground">
										{t(`features.${feature.key}.tooltip`)}
									</p>
								</TooltipContent>
							</Tooltip>
						))}
					</div>
				</div>
			</section>
			<section className="py-4">
				<MainPageBottomContent />
			</section>
		</div>
	);
}
