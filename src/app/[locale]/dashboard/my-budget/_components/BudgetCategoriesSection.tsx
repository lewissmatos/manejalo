// "use client";

import React from "react";
import ManageBudgetCategoryDialog from "./manage-budget-category-dialog";
import BudgetCategoryList from "./budget-category-list";
import { getBudgetCategories } from "@/app/_server-actions/(budget-categories)/actions";
import RecommendedCategories from "./recommended-categories";
import Loading from "@/app/[locale]/loading";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

const BudgetCategoriesSection = async () => {
	const cookieStore = await cookies();

	const profileId = cookieStore.get("profile-id")?.value || "";

	if (!profileId) {
		return <div className="text-red-500">Profile ID not found.</div>;
	}

	const budgetCategories = await getBudgetCategories(profileId);

	const refetchBudgetCategories = async () => {
		"use server";
		await revalidatePath("/dashboard/my-budget");
	};

	return (
		<div className="flex flex-col gap-4">
			<section className="flex flex-wrap gap-4 overflow-y-auto max-h-[calc(70vh-100px)] mb-4">
				<ManageBudgetCategoryDialog
					refetchBudgetCategories={refetchBudgetCategories}
				/>
				<BudgetCategoryList
					data={budgetCategories?.data || []}
					refetchCategories={refetchBudgetCategories}
				/>
			</section>
			<RecommendedCategories
				data={budgetCategories?.data || []}
				refetchCategories={refetchBudgetCategories}
			/>
		</div>
	);
};

export default BudgetCategoriesSection;

// const t = useTranslations();
// 	const { profile } = useAtomValue(authAtom);

// 	const {
// 		data: budgetCategories,
// 		refetch,
// 		isFetching,
// 	} = useQuery({
// 		queryKey: ["budget-categories", profile?.id],
// 		queryFn: () => getBudgetCategories(profile?.id || ""),
// 		enabled: !!profile?.id,
// 	});
