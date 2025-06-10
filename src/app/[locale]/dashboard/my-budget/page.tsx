import React from "react";
import ScreenTitle from "../_components/ScreenTitle";
import { getTranslations } from "next-intl/server";
import BudgetItemCard from "./_components/BudgetCategoryCard";
import RecommendedCategories from "./_components/RecommendedCategories";

const mockData = [
	{
		name: "Groceries",
		description: "Monthly budget for groceries and food items.",
		estimation: 300,
	},
	{
		name: "Utilities",
		description:
			"Monthly budget for utilities like electricity, water, and gas.",
		estimation: 150,
	},
	{
		name: "Transportation",
		description:
			"Monthly budget for transportation costs including fuel and public transport.",
		estimation: 100,
	},
	{
		name: "Entertainment",
		description:
			"Monthly budget for entertainment expenses such as movies, dining out, etc.",
		estimation: 200,
	},
	{
		name: "Savings",
		description: "Monthly savings goal to set aside for future needs.",
		estimation: 500,
	},
];

const MyBudget = async () => {
	const t = await getTranslations("MyBudget");
	return (
		<main className="flex flex-col p-4 justify-between">
			<section className="flex flex-col items-start">
				<ScreenTitle>{t("title")}</ScreenTitle>
				<p className="text-md mb-8">{t("subtitle")}</p>
			</section>
			<section className="flex flex-wrap gap-4 overflow-y-auto max-h-[calc(70vh-100px)] mb-4">
				{mockData.map((item) => (
					<BudgetItemCard
						key={item.name}
						title={item.name}
						description={item.description}
						estimation={item.estimation}
					/>
				))}
			</section>
			<RecommendedCategories />
		</main>
	);
};

export default MyBudget;
