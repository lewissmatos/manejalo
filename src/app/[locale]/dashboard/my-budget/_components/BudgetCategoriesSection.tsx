"use client";

import React from "react";
import ManageBudgetCategoryDialog from "./manage-budget-category-dialog";
import BudgetCategoryList from "./budget-category-list";
import { useQuery } from "@tanstack/react-query";
import { getBudgetCategories } from "@/app/_server-actions/(budget-categories)/actions";
import { useAtomValue } from "jotai/react";
import { authAtom } from "@/lib/jotai/auth-atom";
import RecommendedCategories from "./recommended-categories";
import { useTranslations } from "next-intl";
import Loading from "@/app/[locale]/loading";

const BudgetCategoriesSection = () => {
	const t = useTranslations();
	const { profile } = useAtomValue(authAtom);

	const {
		data: budgetCategories,
		refetch,
		isFetching,
	} = useQuery({
		queryKey: ["budget-categories", profile?.id],
		queryFn: () => getBudgetCategories(profile?.id || ""),
		enabled: !!profile?.id,
	});

	return (
		<div className="flex flex-col gap-4">
			<section className="flex flex-wrap gap-4 overflow-y-auto max-h-[calc(70vh-100px)] mb-4">
				{isFetching ? (
					<Loading />
				) : (
					<ManageBudgetCategoryDialog refetchBudgetCategories={refetch} />
				)}
				<BudgetCategoryList
					isFetching={isFetching}
					data={budgetCategories?.data || []}
					refetchCategories={refetch}
				/>
			</section>
			<RecommendedCategories
				data={budgetCategories?.data || []}
				refetchCategories={refetch}
			/>
		</div>
	);
};

export default BudgetCategoriesSection;
