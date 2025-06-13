"use client";

import { BudgetCategoryExpense } from "@/app/_server-actions/(budget-amount-registration)/actions";
import React from "react";
import Chart from "react-apexcharts";

type Props = {
	data: BudgetCategoryExpense[];
};
const BudgetCategoryExpensesChart = ({ data }: Props) => {
	const state = {
		series: data.map((item) => item.amount),
		options: {
			chart: {
				type: "pie",
			},
			labels: data.map((item) => item.label),
			legend: {
				position: "bottom",
				offsetY: 0,
				height: "100%",
				fontSize: "14px",
				color: "#fff",
				itemMargin: {
					horizontal: 10,
					vertical: 5,
				},
			},
			responsive: [
				{
					breakpoint: 480,
					options: {
						chart: {
							width: 200,
						},
						legend: {
							position: "bottom",
						},
					},
				},
			],
		},
	};

	return (
		<>
			<div id="budget-category-expenses-chart">
				<Chart
					options={state.options as unknown as ApexCharts.ApexOptions}
					series={state.series}
					type="pie"
					width={400}
				/>
			</div>
			<div id="html-dist"></div>
		</>
	);
};

export default BudgetCategoryExpensesChart;
