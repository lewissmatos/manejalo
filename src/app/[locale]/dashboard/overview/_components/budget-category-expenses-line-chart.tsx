"use client";

import React from "react";
import { LineSeries, ResponsiveLine } from "@nivo/line";
import { useTheme } from "next-themes";
import { formatCurrency } from "@/lib/formatters";

function BudgetCategoryExpensesByMonthLineChart<T extends LineSeries>({
	data,
}: {
	data: T[];
}) {
	const { resolvedTheme } = useTheme();

	const textProps = {
		fill: resolvedTheme === "dark" ? "#ffffff" : "#333333",
		outlineColor: resolvedTheme === "dark" ? "#ffffff" : "#333333",
	};
	return (
		<div className="w-full h-[40vh]">
			<ResponsiveLine
				data={data}
				margin={{ top: 10, right: 180, bottom: 30, left: 50 }}
				curve="monotoneX"
				lineWidth={4}
				enableArea
				colors={{ scheme: "pastel1" }}
				areaOpacity={0.3}
				yFormat={(val) => formatCurrency(Number(val), "DOP", true)}
				yScale={{
					type: "linear",
					min: "auto",
					max: "auto",
					reverse: true,
				}}
				theme={{
					text: {
						...textProps,
					},
					tooltip: {
						container: {
							background: resolvedTheme === "dark" ? "#333333" : "#ffffff",
							color: resolvedTheme === "dark" ? "#ffffff" : "#333333",
						},
					},
				}}
				tooltip={({ point }) => (
					<div
						className="p-2 max-w-80 rounded-md"
						style={{
							background: resolvedTheme === "dark" ? "#333333" : "#ffffff",
							color: resolvedTheme === "dark" ? "#ffffff" : "#333333",
						}}
					>
						<span className="whitespace-nowrap">{point.seriesId}: </span>
						<strong className="whitespace-nowrap">
							{point.data.yFormatted}
						</strong>
					</div>
				)}
				pointSize={10}
				pointColor={{ theme: "background" }}
				pointBorderWidth={2}
				pointBorderColor={{ from: "seriesColor" }}
				pointLabelYOffset={-12}
				enableTouchCrosshair={true}
				useMesh={true}
				legends={[
					{
						anchor: "top-right",
						direction: "column",
						translateX: 160,
						itemWidth: 150,
						itemHeight: 22,
						symbolShape: "circle",
					},
				]}
			/>
		</div>
	);
}

export default BudgetCategoryExpensesByMonthLineChart;
