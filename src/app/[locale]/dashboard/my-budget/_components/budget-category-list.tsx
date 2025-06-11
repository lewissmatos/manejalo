"use client";

import React from "react";
import ManageBudgetCategoryDialog from "./manage-budget-category-dialog";
import BudgetItemCard from "./budget-category-card";
import { useAtom, useAtomValue } from "jotai/react";
import { authAtom } from "@/lib/jotai/auth-atom";
import { useQuery } from "@tanstack/react-query";
import { getBudgetCategories } from "@/app/_server-actions/(budget-categories)/actions";
import { useTranslations } from "next-intl";
import { BudgetCategory } from "@/generated/prisma";

type Props = {
	isFetching: boolean;
	data: BudgetCategory[];
	refetchCategories: () => void;
};
const BudgetCategoryList = ({
	isFetching,
	data = [],
	refetchCategories,
}: Props) => {
	const t = useTranslations();

	return (
		<>
			{isFetching && (
				<div className="flex p-4 h-24 items-center justify-center ">
					<p className="text-sm text-gray-500">{t("common.loading")}</p>
				</div>
			)}
			{data?.map((category) => (
				<BudgetItemCard
					key={category.name}
					category={category}
					refetchBudgetCategories={refetchCategories}
				/>
			))}
		</>
	);
};

export default BudgetCategoryList;
