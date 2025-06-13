import React from "react";
import ScreenTitle from "../_components/screen-title";
import { getTranslations } from "next-intl/server";
import { getBudgetCategories } from "@/app/_server-actions/(budget-categories)/actions";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { formatCurrency } from "@/lib/formatters";
import ManageBudgetCategoryDialog from "./_components/manage-budget-category-dialog";
import BudgetCategoryList from "./_components/budget-category-list";
import RecommendedCategories from "./_components/recommended-categories";

const MyBudget = async () => {
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
		<main className="flex flex-col justify-between">
			<section className="flex flex-col items-start">
				<ScreenTitle>{t("title")}</ScreenTitle>
				<p className="text-md mb-8">{t("subtitle")}</p>
			</section>
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
		</main>
	);
};

export default MyBudget;
