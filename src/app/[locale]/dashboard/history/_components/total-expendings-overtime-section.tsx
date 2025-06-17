import { formatCurrency } from "@/lib/formatters";
import { getTranslations } from "next-intl/server";
import React from "react";

type Props = {
	expense: number | null;
	recovery: number | null;
	total: number | null;
};
const TotalExpendingOverTimeSection = async ({
	expense,
	recovery,
	total,
}: Props) => {
	const t = await getTranslations();
	return (
		<section className="rounded-md p-2 w-full shadow-md justify-between flex flex-col gap-2">
			<h4 className="text-lg font-semibold">
				{t("HistoryPage.totalExpensesOverTime")}
			</h4>
			<div className="flex flex-col justify-center gap-2">
				<div className="flex flex-col items-start">
					<p className="text-lg text-destructive">
						{`${t("OverviewPage.budgetAmountTypes.expense")}: ${formatCurrency(
							expense,
							"DOP",
							true
						)}`}
					</p>
					<p className="text-lg text-green-500">
						{`${t("OverviewPage.budgetAmountTypes.recovery")}: ${formatCurrency(
							recovery,
							"DOP",
							true
						)}`}
					</p>
				</div>
				<p className="text-2xl text-primary font-semibold">
					{t("common.totalWithValue", {
						value: formatCurrency(total, "DOP", true),
					})}
				</p>
			</div>
		</section>
	);
};

export default TotalExpendingOverTimeSection;
