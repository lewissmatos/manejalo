"use client";

import React from "react";
import { ResponsiveLine } from "@nivo/line";
import { useTheme } from "next-themes";
import { formatCurrency } from "@/lib/formatters";
const BudgetCategoryExpensesByMonthPerYear = ({ data }: { data: any }) => {
	const { theme } = useTheme();

	const textProps = {
		fill: theme === "dark" ? "#ffffff" : "#333333",
		outlineColor: theme === "dark" ? "#ffffff" : "#333333",
	};
	return (
		<div className="w-full h-[50vh]">
			<ResponsiveLine
				data={data}
				margin={{ top: 10, right: 110, bottom: 50, left: 50 }}
				curve="monotoneX"
				lineWidth={4}
				enableArea
				colors={{ scheme: "pastel1" }}
				areaOpacity={0.3}
				// valueFormat={(val) => formatCurrency(val, "DOP", true)}
				yFormat={(val) => formatCurrency(Number(val), "DOP", true)}
				yScale={{
					type: "linear",
					min: "auto",
					max: "auto",
					reverse: false,
				}}
				theme={{
					text: {
						...textProps,
					},
					tooltip: {
						container: {
							background: theme === "dark" ? "#333333" : "#ffffff",
							color: theme === "dark" ? "#ffffff" : "#333333",
						},
					},
				}}
				pointSize={10}
				pointColor={{ theme: "background" }}
				pointBorderWidth={2}
				pointBorderColor={{ from: "seriesColor" }}
				pointLabelYOffset={-12}
				enableTouchCrosshair={true}
				useMesh={true}
				legends={[
					{
						anchor: "bottom-right",
						direction: "column",
						translateX: 100,
						itemWidth: 80,
						itemHeight: 22,
						symbolShape: "circle",
					},
				]}
			/>
		</div>
	);
};

export default BudgetCategoryExpensesByMonthPerYear;
