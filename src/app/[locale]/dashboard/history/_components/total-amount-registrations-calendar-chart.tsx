"use client";

import React from "react";
import { ResponsiveCalendar } from "@nivo/calendar";
import { formatCurrency } from "@/lib/formatters";
import { useTheme } from "next-themes";
import { useTranslations } from "next-intl";

const TotalAmountRegistrationsCalendarChart = ({
	data,
	year = new Date().getFullYear(),
}: {
	data: Array<{ day: string; value: number }>;
	year?: number;
}) => {
	const t = useTranslations(
		"HistoryPage.TotalAmountRegistrationsCalendarChart"
	);
	const { theme } = useTheme();

	const textProps = {
		fill: theme === "dark" ? "#ffffff" : "#333333",
		outlineColor: theme === "dark" ? "#ffffff" : "#333333",
	};

	return (
		<div className="h-40 w-full gap-2">
			<h2 className="text-lg font-semibold text-primary">
				{t("title", { count: data.length })}
			</h2>
			<ResponsiveCalendar
				data={data}
				from={`${year + 1}-01-01`}
				to={`${year}-12-31`}
				emptyColor="#eeeeee"
				margin={{ right: 20, bottom: 10, left: 20 }}
				yearSpacing={2}
				monthBorderColor="#ffffff"
				dayBorderWidth={2}
				dayBorderColor="#ffffff"
				// legends={[
				// 	{
				// 		anchor: "bottom-right",
				// 		direction: "row",
				// 		translateY: 36,
				// 		itemCount: 4,
				// 		itemWidth: 42,
				// 		itemHeight: 36,
				// 		itemsSpacing: 14,
				// 		itemDirection: "right-to-left",
				// 	},
				// ]}
			/>
		</div>
	);
};

export default TotalAmountRegistrationsCalendarChart;
