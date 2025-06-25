import React from "react";
import BudgetCategoryExpensesChart from "./budget-category-expenses-pie-chart";
import {
	getBudgetAmountRegistrationsGroupedByCategoryForPieChart,
	getTotalBudgetAmountRegistrationByDateRange,
} from "@/app/_server-actions/(budget-amount-registrations)/actions";
import { getTotalMonthlyBudget } from "../../../../_server-actions/(profile)/actions";
import { formatCurrency } from "@/lib/formatters";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { AlertCircleIcon } from "lucide-react";
import { useTranslations } from "next-intl";

type Props = {
	budgetAmountRegistrationsGroupedByCategory: Awaited<
		ReturnType<typeof getBudgetAmountRegistrationsGroupedByCategoryForPieChart>
	>;
	totalMonthlyBudget: Awaited<ReturnType<typeof getTotalMonthlyBudget>>;
	totalBudgetAmount: Awaited<
		ReturnType<typeof getTotalBudgetAmountRegistrationByDateRange>
	>;
};
const BudgetCategoryExpensesPieChartWrapper = ({
	budgetAmountRegistrationsGroupedByCategory,
	totalMonthlyBudget,
	totalBudgetAmount,
}: Props) => {
	const t = useTranslations(
		"OverviewPage.BudgetCategoryExpensesPieChartWrapper"
	);

	const hasOverpassedMonthlyBudget =
		(totalBudgetAmount?.data || 0) > (totalMonthlyBudget?.data || 0);
	return (
		<section
			id="charts-section"
			className="flex flex-col gap-2 items-center w-full"
		>
			{(totalMonthlyBudget?.data || 0)! > 0 ? (
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
						{`/ - ${formatCurrency(totalMonthlyBudget.data, "DOP", true)}`}
					</span>
				</div>
			) : null}
			{hasOverpassedMonthlyBudget ? (
				<Alert variant="destructive" className="w-full">
					<AlertCircleIcon className="h-4 w-4" />
					<AlertTitle className="text-sm">
						{t("overpassedMonthlyBudget")}
					</AlertTitle>
				</Alert>
			) : null}
			<div className="w-full flex flex-col items-center justify-center">
				<BudgetCategoryExpensesChart
					data={budgetAmountRegistrationsGroupedByCategory.data || []}
				/>
			</div>
		</section>
	);
};

export default BudgetCategoryExpensesPieChartWrapper;
