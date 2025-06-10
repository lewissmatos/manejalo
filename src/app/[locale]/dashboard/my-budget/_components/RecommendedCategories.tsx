import React from "react";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { getTranslations } from "next-intl/server";

import defaultCategories from "../../../../../../data/default-categories.json";
import RecommendedCategoryCard from "./RecommendedCategoryCard";
const RecommendedCategories = async () => {
	const t = await getTranslations("MyBudget.RecommendedCategories");
	return (
		<section id="default-categories" className="flex flex-col my-2">
			<Accordion
				type="single"
				collapsible
				className="w-full border border-secondary/50 rounded-lg shadow-md px-2"
				// defaultValue="item-1"
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
							{defaultCategories.map(({ name, description }) => (
								<RecommendedCategoryCard
									key={name}
									title={name}
									description={description}
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
