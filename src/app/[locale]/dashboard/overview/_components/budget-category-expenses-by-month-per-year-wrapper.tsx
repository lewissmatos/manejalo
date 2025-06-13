import React from "react";
import BudgetCategoryExpensesByMonthPerYear from "./budget-category-expeses-by-month-per-year";
import { cookies } from "next/headers";
import { format } from "date-fns/format";
import { endOfMonth, parseISO, startOfMonth } from "date-fns";
import { getTotalBudgetAmountRegistrationPerYearForLineChart } from "@/app/_server-actions/(budget-amount-registration)/actions";

const BudgetCategoryExpensesByMonthPerYearWrapper = async ({
	searchParams,
}: {
	searchParams?: { [key: string]: string | string[] | undefined };
}) => {
	const cookieStore = await cookies();
	const profileId = cookieStore.get("profile-id")?.value || "";

	const now = new Date();

	const selectedDate = await searchParams?.selected_date;
	const dates = {
		startDate: format(
			startOfMonth(
				selectedDate ? new Date(parseISO(selectedDate.toString())) : now
			),
			"yyyy-MM-dd"
		),
		endDate: format(
			endOfMonth(
				selectedDate ? new Date(parseISO(selectedDate.toString())) : now
			),
			"yyyy-MM-dd"
		),
	};
	const totalBudgetAmountRegistrationPerYearForLineChart =
		await getTotalBudgetAmountRegistrationPerYearForLineChart({
			profileId,
			year: new Date(dates.startDate).getFullYear(),
		});
	return (
		<BudgetCategoryExpensesByMonthPerYear
			data={totalBudgetAmountRegistrationPerYearForLineChart.data || []}
		/>
	);
};

export default BudgetCategoryExpensesByMonthPerYearWrapper;
