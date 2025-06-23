"use client";

import React from "react";
import BudgetCategoryCard from "./budget-category-card";
import { BudgetCategory } from "@/generated/prisma";

type Props = {
	data: BudgetCategory[];
	refetchCategories: () => void;
};
const BudgetCategoryList = ({ data = [], refetchCategories }: Props) => {
	return (
		<>
			{data?.map((category) => (
				<BudgetCategoryCard
					key={category.name}
					budgetCategoriesLength={data.length}
					category={category}
					refetchBudgetCategories={refetchCategories}
				/>
			))}
		</>
	);
};

export default BudgetCategoryList;
