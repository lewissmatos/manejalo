import React from "react";
import ScreenTitle from "../_components/screen-title";
import { getTranslations } from "next-intl/server";
import { getBudgetCategories } from "@/app/_server-actions/(budget-categories)/actions";
import { revalidatePath } from "next/cache";
import { formatCurrency } from "@/lib/formatters";
import ManageBudgetCategoryDialog from "./_components/manage-budget-category-dialog";
import BudgetCategoryList from "./_components/budget-category-list";
import RecommendedCategories from "./_components/recommended-categories";
import { getTotalMonthlyIncome } from "@/app/_server-actions/(profile)/actions";
import { AlertCircleIcon } from "lucide-react";
import { Alert, AlertTitle } from "@/components/ui/alert";
import EmergencyFundCard from "./_components/emergency-fund-card";
import { getSession } from "@/middleware";
import { getEmergencyFund } from "@/app/_server-actions/(emergency-fund)/actions";

const MAX_BUDGET_CATEGORIES = 10;
const MyBudget = async () => {
	const [profileId, t] = await Promise.all([
		(await getSession())?.profile?.id,
		getTranslations("MyBudgetPage"),
	]);

	if (!profileId) {
		return <div className="text-destructive">Profile ID not found.</div>;
	}

	const [
		{ data: emergencyFundData },
		{ data: budgetCategoriesData },
		monthlyIncomesData,
	] = await Promise.all([
		getEmergencyFund(profileId),
		getBudgetCategories(profileId),
		getTotalMonthlyIncome(profileId),
	]);
	const budgetCategories = budgetCategoriesData?.budgetCategories || [];
	const totalBudget = budgetCategoriesData?.totalBudget || 0;

	const refetchBudgetCategories = async () => {
		"use server";
		await revalidatePath("/dashboard/my-budget");
	};

	const hasOverpassedIncomes =
		(totalBudget || 0) > (monthlyIncomesData?.data || 0);
	return (
		<main className="flex flex-col justify-between">
			<section className="flex flex-col items-start">
				<ScreenTitle>{t("title")}</ScreenTitle>
				<p className="text-md mb-8">{t("subtitle")}</p>
			</section>
			<div className="flex flex-col gap-4">
				<p className="text-xl text-primary font-semibold">
					{`${t("totalMonthlyBudgetWithValue", {
						value: formatCurrency(totalBudget || 0, "DOP", true),
					})}/${formatCurrency(monthlyIncomesData?.data || 0, "DOP", true)}`}
				</p>
				{hasOverpassedIncomes ? (
					<Alert variant="destructive" className="w-full">
						<AlertCircleIcon className="h-4 w-4" />
						<AlertTitle className="text-sm">
							{t("overpassedMonthlyBudget")}
						</AlertTitle>
					</Alert>
				) : null}
				<section className="flex flex-wrap gap-4 max-h-[33rem] justify-start items-start overflow-y-auto">
					<ManageBudgetCategoryDialog
						refetchBudgetCategories={refetchBudgetCategories}
						categoriesLength={budgetCategories.length}
						maxBudgetCategories={MAX_BUDGET_CATEGORIES}
					/>

					<EmergencyFundCard
						refetch={refetchBudgetCategories}
						data={emergencyFundData}
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
