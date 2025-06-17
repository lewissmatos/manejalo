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

	const textProps = {
		fill: theme === "dark" ? "#ffffff" : "#333333",
		outlineColor: theme === "dark" ? "#ffffff" : "#333333",
	};
	return (
		<div className="h-[400px] w-full">
			<ResponsivePie
				data={data}
				margin={{ top: 40, right: 80, bottom: 100, left: 80 }}
				innerRadius={0.5}
				colors={{ scheme: "pastel1" }}
				padAngle={0.6}
				valueFormat={(val) => formatCurrency(val * -1, "DOP", true)}
				theme={{
					text: { ...textProps },
					legends: {
						text: { ...textProps },
					},
					annotations: {
						text: { ...textProps },
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
						anchor: "bottom-right",
						direction: "column",
						translateY: 70,
						itemWidth: 80,
						itemHeight: 20,
						symbolShape: "circle",
					},
				]}
			/>
		</div>
	);
};

export default BudgetCategoryExpensesChart;
