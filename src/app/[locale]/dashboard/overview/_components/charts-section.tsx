import React from "react";
import BudgetCategoryExpensesChart from "./budget-category-expenses-pie-chart";
import {
	getBudgetAmountRegistrationsGroupedByCategoryForPieChart,
	getTotalBudgetAmountRegistrationByDateRange,
} from "@/app/_server-actions/(budget-amount-registration)/actions";
import { cookies } from "next/headers";
import { format, startOfMonth, endOfMonth, parseISO } from "date-fns";
import { getTotalMonthlyBudget } from "../../../../_server-actions/(profile)/actions";
import { formatCurrency } from "@/lib/formatters";
import { getTranslations } from "next-intl/server";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { AlertCircleIcon } from "lucide-react";

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
		await getBudgetAmountRegistrationsGroupedByCategoryForPieChart({
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

	const hasOverpassedMonthlyBudget =
		(totalBudgetAmount?.data || 0) > (totalMonthlyBudget?.data || 0);
	return (
		<section
			id="charts-section"
			className="flex flex-col gap-2 items-center w-5/12"
		>
			<div className="flex flex-row items-baseline justify-center w-full">
				<span className="text-primary text-lg mr-1">
					{t("registeredSummary")}
				</span>
				<span
					className={` text-lg font-semibold ${
						hasOverpassedMonthlyBudget ? "text-destructive" : "text-primary"
					}`}
				>
					{formatCurrency(totalBudgetAmount.data, "DOP", true)}
				</span>
				<span className="text-primary/70 text-md">
					{`/${formatCurrency(totalMonthlyBudget.data, "DOP", true)}`}
				</span>
			</div>
			{hasOverpassedMonthlyBudget ? (
				<Alert variant="destructive" className="w-full">
					<AlertCircleIcon className="h-4 w-4" />
					<AlertTitle className="text-sm">
						{t("overpassedMonthlyBudget")}
					</AlertTitle>
				</Alert>
			) : null}
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
		<div className="w-full flex flex-col items-center justify-center">
			{children}
		</div>
	);
};

export default ChartsSection;
