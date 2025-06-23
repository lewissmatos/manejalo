"use client";

import React from "react";

import {
	Card,
	CardContent,
	CardDescription,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import ManageBudgetCategoryDialog from "./manage-budget-category-dialog";
import { MAX_BUDGET_CATEGORIES } from "@/lib/constants/app-settings";

type Props = {
	title: string;
	description?: string;
	refetchBudgetCategories: () => void;
	maxBudgetCategories: number;
};
const RecommendedCategoryCard = ({
	title,
	description,
	refetchBudgetCategories,
	maxBudgetCategories,
}: Props) => {
	const t = useTranslations("MyBudgetPage.RecommendedCategories.Card");

	return (
		<Card className="w-full md:w-72 p-2 max-w-sm">
			<CardContent className="p-0">
				<CardTitle className="mb-2">{title}</CardTitle>
				<CardDescription>{description}</CardDescription>
				<div className="flex justify-end">
					<ManageBudgetCategoryDialog
						dialogTrigger={
							<Button variant="ghost" size={"sm"} className="w-full mt-2">
								{t("actionTitle")}
							</Button>
						}
						defaultValues={{
							name: title,
							description: description,
						}}
						maxBudgetCategories={MAX_BUDGET_CATEGORIES}
						refetchBudgetCategories={refetchBudgetCategories}
						categoriesLength={maxBudgetCategories}
					/>
				</div>
			</CardContent>
		</Card>
	);
};

export default RecommendedCategoryCard;
