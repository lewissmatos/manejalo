import React from "react";
import ManageBudgetCategoryDialog from "./manage-budget-category-dialog";
import BudgetCategoryList from "./budget-category-list";
import { getBudgetCategories } from "@/app/_server-actions/(budget-categories)/actions";
import RecommendedCategories from "./recommended-categories";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { formatCurrency } from "@/lib/formatters";
import { getTranslations } from "next-intl/server";

const BudgetCategoriesSection = async () => {
	const t = await getTranslations("MyBudgetPage");
	const cookieStore = await cookies();

	const profileId = cookieStore.get("profile-id")?.value || "";

	if (!profileId) {
		return <div className="text-red-500">Profile ID not found.</div>;
	}

	const { data } = await getBudgetCategories(profileId);

	const budgetCategories = data?.budgetCategories || [];
	const totalBudget = data?.totalBudget || 0;
	const refetchBudgetCategories = async () => {
		"use server";
		await revalidatePath("/dashboard/my-budget");
	};

	return (
		<div className="flex flex-col gap-4">
			<p className="text-xl text-primary font-semibold">
				{t("totalMonthlyBudgetWithValue", {
					value: formatCurrency(totalBudget || 0),
				})}
			</p>
			<section className="flex flex-wrap gap-4 overflow-y-auto max-h-[calc(70vh-100px)] mb-4">
				<ManageBudgetCategoryDialog
					refetchBudgetCategories={refetchBudgetCategories}
				/>
				<BudgetCategoryList
					data={budgetCategories || []}
					refetchCategories={refetchBudgetCategories}
				/>
			</section>
			<RecommendedCategories
				data={budgetCategories || []}
				refetchCategories={refetchBudgetCategories}
			/>
		</div>
	);
};

export default BudgetCategoriesSection;
