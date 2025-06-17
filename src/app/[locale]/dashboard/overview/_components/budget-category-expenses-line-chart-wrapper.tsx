import React from "react";
import BudgetCategoryExpensesByMonthLineChart from "./budget-category-expenses-line-chart";
import { LineSeries } from "@nivo/line";
import { useTranslations } from "next-intl";

const BudgetCategoryExpensesByMonthLineChartWrapper = <T extends LineSeries>({
	year,
	data,
}: {
	year: number;
	data: Array<T>;
	showYearPicker?: boolean;
}) => {
	const t = useTranslations("OverviewPage");
	return !!data?.length ? (
		<div className="flex flex-col items-start w-full h-fit gap-4 mt-4">
			<h2 className="text-lg font-semibold text-primary">
				{t("BudgetCategoryExpensesByMonthLineChart.title", { year })}
			</h2>
			<BudgetCategoryExpensesByMonthLineChart data={data || []} />
		</div>
	) : (
		<p className="text-md text-muted-foreground mt-4 w-full text-center">
			{t("BudgetCategoryExpensesByMonthLineChart.noData", { year })}
		</p>
	);
};

export default BudgetCategoryExpensesByMonthLineChartWrapper;
