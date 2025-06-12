import React from "react";
import ScreenTitle from "../_components/screen-title";
import { getTranslations } from "next-intl/server";
import BudgetCategoriesSection from "./_components/BudgetCategoriesSection";

const MyBudget = async () => {
	const t = await getTranslations("MyBudget");

	return (
		<main className="flex flex-col justify-between">
			<section className="flex flex-col items-start">
				<ScreenTitle>{t("title")}</ScreenTitle>
				<p className="text-md mb-8">{t("subtitle")}</p>
			</section>
			<BudgetCategoriesSection />
		</main>
	);
};

export default MyBudget;
