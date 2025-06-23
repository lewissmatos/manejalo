import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/lib/formatters";
import { getTranslations } from "next-intl/server";
import React from "react";

type Props = {
	expense: number | null;
	recovery: number | null;
	total: number | null;
	year: number;
};
const TotalExpensesByYearSection = async ({
	expense,
	recovery,
	total,
	year,
}: Props) => {
	const t = await getTranslations();
	return (
		<section className="rounded-md w-fit flex flex-col gap-1">
			<h2 className="text-lg font-semibold text-primary">
				{t("HistoryPage.totalExpensesWithValue", { year })}
			</h2>
			<div className="flex flex-row justify-center items-center gap-2">
				<div className="flex flex-col items-start">
					<p className="text-md text-destructive">
						{`${t("OverviewPage.budgetAmountTypes.expense")}: ${formatCurrency(
							expense,
							"DOP",
							true
						)}`}
					</p>
					<p className="text-md text-green-500">
						{`${t("OverviewPage.budgetAmountTypes.recovery")}: ${formatCurrency(
							recovery,
							"DOP",
							true
						)}`}
					</p>
				</div>
				<Separator orientation="vertical" className="h-8" />
				<p className="text-xl md:text-3xl text-primary font-semibold text-center">
					{t("common.totalWithValue", {
						value: formatCurrency(total, "DOP", true),
					})}
				</p>
			</div>
		</section>
	);
};

export default TotalExpensesByYearSection;
