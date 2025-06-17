"use client";

import React from "react";
import { ResponsiveBar } from "@nivo/bar";
import { formatCurrency } from "@/lib/formatters";
import { useTheme } from "next-themes";
import { useTranslations } from "next-intl";

const HighestExpendingMonthsBarChart = ({
	data,
}: {
	data: Array<{ date: string; value: number }>;
}) => {
	const t = useTranslations("HistoryPage.HighestExpendingMonthsBarChart");
	const { theme } = useTheme();

	const textProps = {
		fill: theme === "dark" ? "#ffffff" : "#333333",
		outlineColor: theme === "dark" ? "#ffffff" : "#333333",
	};
	const commonProperties = {
		width: 750,
		height: 300,
		margin: { top: 10, right: 50, bottom: 60, left: 60 },
		data: data,
		indexBy: "date",
		keys: ["value"],
		padding: 0.2,
		labelSkipWidth: 16,
		labelSkipHeight: 16,
	};
	return (
		<div className="h-[300px] w-full">
			<h2 className="text-lg font-semibold mb-4">
				{t("title", { count: data.length })}
			</h2>
			<ResponsiveBar
				{...commonProperties}
				colors={{ scheme: "pastel1" }}
				valueFormat={(val) => `-${formatCurrency(val, "DOP", true)}`}
				tooltip={({ formattedValue, data }) => (
					<div
						className="p-2 max-w-80 rounded-md"
						style={{
							background: theme === "dark" ? "#333333" : "#ffffff",
							color: theme === "dark" ? "#ffffff" : "#333333",
						}}
					>
						<span className="whitespace-nowrap">{data.date}: </span>
						<strong className="whitespace-nowrap">{formattedValue}</strong>
					</div>
				)}
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
				axisLeft={{
					format: (value) => `-${formatCurrency(value, "DOP", true)}`,
				}}
			/>
		</div>
	);
};

export default HighestExpendingMonthsBarChart;
