import React from "react";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";

import defaultCategories from "@/lib/constants/recommended-categories.json";
import RecommendedCategoryCard from "./recommended-category-card";
import { useLocale } from "next-intl";
import { useTranslations } from "use-intl";
import { BudgetCategory } from "@/generated/prisma";
import { getLocale, getTranslations } from "next-intl/server";

type Props = {
	refetchCategories: () => void;
	data: BudgetCategory[];
};
const RecommendedCategories = async ({ refetchCategories, data }: Props) => {
	const t = await getTranslations("MyBudgetPage.RecommendedCategories");
	const locale = await getLocale();
	const currentCategories =
		defaultCategories[locale as keyof typeof defaultCategories];

	return (
		<section id="default-categories" className="flex flex-col my-2">
			<Accordion
				type="single"
				collapsible
				className="w-full border border/50 rounded-lg shadow-md px-2"
			>
				<AccordionItem value="item-1">
					<AccordionTrigger unselectable="on">
						<div className=" flex flex-col gap-1">
							<p className="text-md text-primary font-semibold">{t("title")}</p>
							<p className="text-sm text-primary/60 ">{t("subtitle")}</p>
						</div>
					</AccordionTrigger>
					<AccordionContent className="flex flex-col gap-4 text-balance">
						<div className="flex flex-wrap gap-4 overflow-y-auto max-h-96">
							{currentCategories
								.filter((x) => !data?.map((c) => c.name).includes(x.name))
								.map(({ name, description }) => (
									<RecommendedCategoryCard
										key={name}
										title={name}
										description={description}
										refetchBudgetCategories={refetchCategories}
										maxBudgetCategories={currentCategories.length}
									/>
								))}
						</div>
					</AccordionContent>
				</AccordionItem>
			</Accordion>
		</section>
	);
};

export default RecommendedCategories;
