"use client";

import React, { useState } from "react";
import BudgetCategoryExpensesByMonthLineChartWrapper from "../../overview/_components/budget-category-expenses-line-chart-wrapper";
import { getTotalBudgetAmountRegistrationPerYearForLineChart } from "@/app/_server-actions/(budget-amount-registration)/actions";
import { useQuery } from "@tanstack/react-query";
import YearPicker from "@/components/common/year-picker";

type Props = {
	profileId: string;
	defaultYear: number;
	showYearPicker?: boolean;
};
const HistoryItems = ({ defaultYear, profileId, showYearPicker }: Props) => {
	const [filters, setFilters] = useState({
		year: defaultYear,
	});

	const { data: totalBudgetAmountRegistrationPerYearForLineChartData } =
		useQuery({
			queryFn: () => {
				return getTotalBudgetAmountRegistrationPerYearForLineChart({
					profileId,
					year: filters.year,
				});
			},
			queryKey: ["budget-category-expenses-line-chart", filters.year],
		});

	return (
		<div className="mt-8 px-2">
			{showYearPicker && (
				<YearPicker
					defaultYear={Number(filters?.year)}
					setYear={(year) => {
						setFilters((prevVal: Record<string, any>) => {
							return {
								...prevVal,
								year,
							};
						});
					}}
				/>
			)}
			<BudgetCategoryExpensesByMonthLineChartWrapper
				year={filters.year}
				data={totalBudgetAmountRegistrationPerYearForLineChartData?.data || []}
			/>
		</div>
	);
};

export default HistoryItems;
