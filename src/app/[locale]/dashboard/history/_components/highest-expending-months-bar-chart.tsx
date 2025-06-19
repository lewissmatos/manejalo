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
	const { resolvedTheme } = useTheme();

	const textProps = {
		fill: resolvedTheme === "dark" ? "#ffffff" : "#333333",
		outlineColor: resolvedTheme === "dark" ? "#ffffff" : "#333333",
	};
	const commonProperties = {
		width: 750,
		height: 300,
		margin: { top: 10, right: 20, bottom: 22, left: 60 },
		data: data,
		indexBy: "date",
		keys: ["value"],
		padding: 0.2,
		labelSkipWidth: 16,
		labelSkipHeight: 16,
	};
	return (
		<div className="h-52 w-full gap-1">
			{!data?.length ? (
				<p className="text-md text-muted-foreground mt-4 w-full text-center">
					{t("noData")}
				</p>
			) : (
				<>
					<h2 className="text-lg font-semibold text-primary">{t("title")}</h2>
					<ResponsiveBar
						{...commonProperties}
						colors={{ scheme: resolvedTheme === "dark" ? "dark2" : "pastel2" }}
						valueFormat={(val) => `-${formatCurrency(val, "DOP", true)}`}
						tooltip={({ formattedValue, data }) => (
							<div
								className="p-2 max-w-80 rounded-md"
								style={{
									background: resolvedTheme === "dark" ? "#333333" : "#ffffff",
									color: resolvedTheme === "dark" ? "#ffffff" : "#333333",
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
									background: resolvedTheme === "dark" ? "#333333" : "#ffffff",
									color: resolvedTheme === "dark" ? "#ffffff" : "#333333",
								},
							},
						}}
						axisLeft={{
							format: (value) => `-${formatCurrency(value, "DOP", true)}`,
						}}
					/>
				</>
			)}
		</div>
	);
};

export default HighestExpendingMonthsBarChart;
