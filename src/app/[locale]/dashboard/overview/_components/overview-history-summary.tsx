import { getBudgetAmountRegistrationHistory } from "@/app/_server-actions/(budget-amount-registrations)/actions";
import { BudgetAmountType } from "@/generated/prisma";
import { formatCurrency } from "@/lib/formatters";
import { HistoryItem } from "@/lib/services/budget-amount-registrations-service";
import { getSession } from "@/middleware";
import { format, setDefaultOptions } from "date-fns";
import { enUS, es } from "date-fns/locale";
import { History } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";
import { cookies } from "next/headers";
import React from "react";

const OverviewHistorySummary = async () => {
	const [profileId, t, locale] = await Promise.all([
		(await getSession())?.profile?.id,
		getTranslations("OverviewHistorySummary"),
		getLocale(),
	]);

	if (!profileId) {
		return <div className="text-destructive">Profile ID not found.</div>;
	}
	const history = await getBudgetAmountRegistrationHistory(profileId);

	setDefaultOptions({
		locale: [es, enUS].find((l) => l.code.includes(locale)) || es,
	});

	return (
		<div className="flex flex-col items-start justify-between w-full md:w-76 h-[350px] shadow-md p-2 border-1 border-foreground-500 rounded-lg">
			<div className="flex flex-col gap-1 ">
				<h2 className="text-xl font-semibold text-primary">{t("title")}</h2>
				<p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
					{t("subtitle", { value: 20 })}
				</p>
			</div>
			{history.data?.length ? (
				<ul className="w-full h-80 overflow-y-auto">
					{history.data.map((item) => (
						<HistoryListItem item={item} key={item.id} />
					))}
				</ul>
			) : (
				<div className="h-full flex justify-between flex-col items-center w-full">
					<div />
					<History size={72} className="text-primary/80" />
					<p className="text-primary/80 text-sm">{t("noHistory")}</p>
				</div>
			)}
		</div>
	);
};

const HistoryListItem = ({ item }: { item: HistoryItem }) => (
	<li
		key={item.id}
		className="py-2 flex flex-col gap-1 border-b border-gray-300"
	>
		<div className="flex  flex-col justify-between items-start text-sm ">
			<span>{item.budgetCategory?.name}</span>
		</div>
		<div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
			<span
				className={`whitespace-nowrap font-semibold ${
					item.type === BudgetAmountType.EXPENSE
						? "text-primary"
						: "text-green-500"
				}`}
			>
				{`${item.type === BudgetAmountType.EXPENSE ? "-" : "+"}${formatCurrency(
					Math.abs(item.amount),
					"DOP",
					true
				)}`}
			</span>
			{format(item.correspondingDate, "PPP")}
		</div>
	</li>
);

export default OverviewHistorySummary;
