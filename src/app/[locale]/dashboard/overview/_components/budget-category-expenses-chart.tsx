"use client";

import { BudgetCategoryExpense } from "@/app/_server-actions/(budget-amount-registration)/actions";
import React from "react";
import { ResponsivePie } from "@nivo/pie";
import { useTheme } from "next-themes";
import { formatCurrency } from "@/lib/formatters";

type Props = {
	data: BudgetCategoryExpense[];
};
const BudgetCategoryExpensesChart = ({ data }: Props) => {
	const { theme } = useTheme();
	const formattedData = data.map((item, i) => ({
		id: item.label,
		label: item.label,
		value: item.amount,
		color: `hsl(${Math.floor(Math.random() * 360)}, 70%, 50%)`,
	}));

	console.log(formattedData);

	const textProps = {
		fill: theme === "dark" ? "#ffffff" : "#333333",
		outlineColor: theme === "dark" ? "#ffffff" : "#333333",
	};
	return (
		<div className="h-[350px] w-full">
			<ResponsivePie
				data={formattedData}
				margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
				innerRadius={0.5}
				padAngle={0.6}
				valueFormat={(val) => formatCurrency(val, "DOP", true)}
				theme={{
					text: {
						...textProps,
					},
					axis: {
						legend: {
							text: {
								...textProps,
							},
						},
						ticks: {
							text: {
								...textProps,
							},
						},
					},
					legends: {
						title: {
							text: {
								...textProps,
							},
						},
						text: {
							...textProps,
						},
						ticks: {
							text: {
								...textProps,
							},
						},
					},
					annotations: {
						text: {
							...textProps,
						},
						link: {
							...textProps,
						},
						outline: {
							...textProps,
						},
						symbol: {
							...textProps,
						},
					},
					tooltip: {
						container: {
							background: theme === "dark" ? "#333333" : "#ffffff",
							color: theme === "dark" ? "#ffffff" : "#333333",
						},
					},
				}}
				cornerRadius={2}
				activeOuterRadiusOffset={8}
				arcLinkLabelsSkipAngle={10}
				arcLinkLabelsTextColor={theme === "dark" ? "#ffffff" : "#333333"}
				arcLinkLabelsThickness={2}
				arcLinkLabelsColor={{ from: "color" }}
				arcLabelsSkipAngle={10}
				arcLinkLabelsOffset={-10}
				arcLabelsTextColor={{ from: "color", modifiers: [["darker", 2]] }}
				legends={[
					{
						anchor: "bottom",
						direction: "row",
						translateY: 40,
						itemWidth: 100,
						itemHeight: 18,
						symbolShape: "circle",
					},
				]}
			/>
		</div>
	);
};

export default BudgetCategoryExpensesChart;
