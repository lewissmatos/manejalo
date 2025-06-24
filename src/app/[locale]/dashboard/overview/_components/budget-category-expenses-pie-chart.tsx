"use client";

import { BudgetCategoryExpense } from "@/app/_server-actions/(budget-amount-registrations)/actions";
import React from "react";
import { ResponsivePie } from "@nivo/pie";
import { useTheme } from "next-themes";
import { formatCurrency } from "@/lib/formatters";

type Props = {
	data: BudgetCategoryExpense[];
};
const BudgetCategoryExpensesChart = ({ data }: Props) => {
	const { resolvedTheme } = useTheme();

	const textProps = {
		fill: resolvedTheme === "dark" ? "#ffffff" : "#333333",
		outlineColor: resolvedTheme === "dark" ? "#ffffff" : "#333333",
	};
	return (
		<div className="h-[320px] w-full">
			<ResponsivePie
				data={data}
				margin={{ top: 10, right: 100, bottom: 20, left: 100 }}
				innerRadius={0.5}
				colors={{ scheme: resolvedTheme === "dark" ? "dark2" : "pastel2" }}
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
							background: resolvedTheme === "dark" ? "#333333" : "#ffffff",
							color: resolvedTheme === "dark" ? "#ffffff" : "#333333",
						},
					},
				}}
				cornerRadius={2}
				activeOuterRadiusOffset={8}
				arcLinkLabelsSkipAngle={10}
				arcLinkLabelsTextColor={
					resolvedTheme === "dark" ? "#ffffff" : "#333333"
				}
				arcLinkLabelsThickness={2}
				arcLinkLabelsColor={{ from: "color" }}
				arcLabelsSkipAngle={10}
				arcLinkLabelsOffset={-10}
				arcLabelsTextColor={{ from: "color", modifiers: [["darker", 2]] }}
			/>
		</div>
	);
};

export default BudgetCategoryExpensesChart;
