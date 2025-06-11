"use client";

import React from "react";

import {
	Card,
	CardContent,
	CardDescription,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getTranslations } from "next-intl/server";
import { BudgetCategory } from "@/generated/prisma";
import { useTranslations } from "next-intl";
import ManageBudgetCategoryDialog from "./manage-budget-category-dialog";

type Props = {
	title: string;
	description?: string;
	refetchBudgetCategories: () => void;
};
const RecommendedCategoryCard = ({
	title,
	description,
	refetchBudgetCategories,
}: Props) => {
	const t = useTranslations("MyBudget.RecommendedCategories.Card");

	return (
		<Card className="w-full md:w-72 p-2 max-w-sm">
			<CardContent className="p-0">
				<CardTitle className="mb-2">{title}</CardTitle>
				<CardDescription>{description}</CardDescription>
				<div className="flex justify-end">
					<ManageBudgetCategoryDialog
						dialogTrigger={
							<Button variant="default" size={"sm"} className="w-full mt-2">
								{t("actionTitle")}
							</Button>
						}
						defaultValues={{
							name: title,
							description: description,
						}}
						refetchBudgetCategories={refetchBudgetCategories}
					/>
				</div>
			</CardContent>
		</Card>
	);
};

export default RecommendedCategoryCard;
