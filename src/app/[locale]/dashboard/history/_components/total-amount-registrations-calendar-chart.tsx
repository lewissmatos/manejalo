"use client";

import React from "react";
import { ResponsiveCalendar } from "@nivo/calendar";
import { formatCurrency } from "@/lib/formatters";
import { useTheme } from "next-themes";
import { useLocale, useTranslations } from "next-intl";
import { format, formatISO } from "date-fns";
import { enUS, es } from "date-fns/locale";

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
	const locale = useLocale();
	const lang = locale === "en" ? enUS : es;
	const { resolvedTheme } = useTheme();

	const textProps = {
		fill: resolvedTheme === "dark" ? "#ffffff" : "#333333",
		outlineColor: resolvedTheme === "dark" ? "#ffffff" : "#333333",
	};

	return (
		<div className="hidden md:flex flex-col h-40 w-full mb-6">
			<h2 className="text-lg font-semibold text-primary">
				{t("title", { count: data.length })}
			</h2>
			<ResponsiveCalendar
				data={data}
				from={`${year + 1}-01-01`}
				to={`${year}-12-31`}
				emptyColor={resolvedTheme === "dark" ? "#4d4d4d" : "#eeeeee"}
				margin={{ right: 20, bottom: 10, left: 20, top: 30 }}
				yearSpacing={0}
				monthBorderColor={resolvedTheme === "dark" ? "#333333" : "#ffffff"}
				dayBorderWidth={2}
				dayBorderColor={resolvedTheme === "dark" ? "#333333" : "#ffffff"}
				monthLegend={(_year, month) => {
					return format(new Date(new Date().getMonth(), month, 1), "LLL", {
						locale: lang,
					}).toUpperCase();
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
				tooltip={(val) => {
					const item = val as unknown as { value: number; date: Date };
					return (
						<div
							className="p-2 max-w-80 rounded-md"
							style={{
								background: resolvedTheme === "dark" ? "#333333" : "#ffffff",
								color: resolvedTheme === "dark" ? "#ffffff" : "#333333",
							}}
						>
							<span className="whitespace-nowrap">
								{format(formatISO(item.date!), "PPP")}:{" "}
							</span>
							<strong className="whitespace-nowrap">
								- {formatCurrency(Number(item.value), "DOP", true)}
							</strong>
						</div>
					);
				}}
			/>
		</div>
	);
};

export default TotalAmountRegistrationsCalendarChart;
