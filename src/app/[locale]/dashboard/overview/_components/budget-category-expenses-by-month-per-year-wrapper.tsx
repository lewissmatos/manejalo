import React from "react";
import BudgetCategoryExpensesByMonthPerYear from "./budget-category-expeses-by-month-per-year";
import { cookies } from "next/headers";
import { format } from "date-fns/format";
import { endOfMonth, parseISO, startOfMonth } from "date-fns";
import { getTotalBudgetAmountRegistrationPerYearForLineChart } from "@/app/_server-actions/(budget-amount-registration)/actions";
import { getTranslations } from "next-intl/server";

const BudgetCategoryExpensesByMonthPerYearWrapper = async ({
	searchParams,
}: {
	searchParams?: { [key: string]: string | string[] | undefined };
}) => {
	const [t, cookieStore] = await Promise.all([
		getTranslations("OverviewPage"),
		cookies(),
	]);
	const profileId = cookieStore.get("profile-id")?.value || "";

	const now = new Date();

	const selectedDate = await searchParams?.selected_date;

	const year = new Date(
		format(
			startOfMonth(
				selectedDate ? new Date(parseISO(selectedDate.toString())) : now
			),
			"yyyy-MM-dd"
		)
	).getFullYear();
	const totalBudgetAmountRegistrationPerYearForLineChart =
		await getTotalBudgetAmountRegistrationPerYearForLineChart({
			profileId,
			year,
		});
	return (
		<div className="flex flex-col items-start w-full h-fit gap-4 mt-4">
			<h2 className="text-lg font-semibold text-primary">
				{t("BudgetCategoryExpensesByMonthPerYear.title", {
					year,
				})}
			</h2>
			<BudgetCategoryExpensesByMonthPerYear
				data={totalBudgetAmountRegistrationPerYearForLineChart.data || []}
			/>
		</div>
	);
};

export default BudgetCategoryExpensesByMonthPerYearWrapper;
