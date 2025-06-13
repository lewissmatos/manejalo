import React from "react";
import BudgetCategoryExpensesChart from "./budget-category-expenses-chart";
import {
	getBudgetAmountRegistrationsGroupedByCategory,
	getTotalBudgetAmountRegistrationByDateRange,
} from "@/app/_server-actions/(budget-amount-registration)/actions";
import { cookies } from "next/headers";
import { format, startOfMonth, endOfMonth, parseISO } from "date-fns";
import { getTotalMonthlyBudget } from "../../../../_server-actions/(profile)/actions";
import { formatCurrency } from "@/lib/formatters";
import { getTranslations } from "next-intl/server";

const ChartsSection = async ({
	searchParams,
}: {
	searchParams?: { [key: string]: string | string[] | undefined };
}) => {
	const [cookieStore, t] = await Promise.all([
		cookies(),
		getTranslations("OverviewPage.ChartsSection"),
	]);
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

	const budgetAmountRegistrationsGroupedByCategory =
		await getBudgetAmountRegistrationsGroupedByCategory({
			profileId,
			startDate: new Date(dates.startDate),
			endDate: new Date(dates.endDate),
		});

	const totalMonthlyBudget = await getTotalMonthlyBudget(profileId);

	const totalBudgetAmount = await getTotalBudgetAmountRegistrationByDateRange({
		profileId,
		startDate: new Date(dates.startDate),
		endDate: new Date(dates.endDate),
	});

	return (
		<section
			id="charts-section"
			className="flex flex-col gap-4 items-center w-5/12"
		>
			<p className="text-primary text-lg">
				{t("registeredSummary", {
					value1: formatCurrency(totalBudgetAmount.data, "DOP", true),
					value2: formatCurrency(totalMonthlyBudget.data, "DOP", true),
				})}
			</p>
			<ChartWrapper>
				<BudgetCategoryExpensesChart
					data={budgetAmountRegistrationsGroupedByCategory.data || []}
				/>
			</ChartWrapper>
		</section>
	);
};

const ChartWrapper = ({ children }: { children: React.ReactNode }) => {
	return (
		<div className="w-full rounded-md flex flex-col items-center justify-center">
			{children}
		</div>
	);
};

export default ChartsSection;
