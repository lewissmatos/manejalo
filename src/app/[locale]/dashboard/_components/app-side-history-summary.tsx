import { getBudgetAmountRegistrationHistory } from "@/app/_server-actions/(budget-amount-registration)/actions";
import { BudgetAmountType } from "@/generated/prisma";
import { formatCurrency } from "@/lib/formatters";
import { format, setDefaultOptions } from "date-fns";
import { enUS, es } from "date-fns/locale";
import { getLocale, getTranslations } from "next-intl/server";
import { cookies } from "next/headers";
import React from "react";

const AppSideHistorySummary = async () => {
	const t = await getTranslations("AppSideHistorySummary");
	const cookieStore = await cookies();
	const locale = await getLocale();
	const profileId = cookieStore.get("profile-id")?.value || "";
	if (!profileId) {
		return <div className="text-destructive">Profile ID not found.</div>;
	}
	const history = await getBudgetAmountRegistrationHistory(profileId);

	setDefaultOptions({
		locale: [es, enUS].find((l) => l.code.includes(locale)) || es,
	});
	return (
		<div className="flex flex-col items-start justify-between w-full md:w-64 h-96 shadow-md py-2 px-3 border-1 border-foreground-500 rounded-lg">
			<div className="flex flex-col  gap-2 ">
				<h2 className="text-xl font-semibold text-primary">{t("title")}</h2>
				<p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
					{t("subtitle", { value: 20 })}
				</p>
			</div>
			{history.data?.length ? (
				<ul className="w-full h-80 overflow-y-auto">
					{history.data.map((item) => (
						<li
							key={item.id}
							className="py-2 flex flex-col gap-1 border-b border-gray-300"
						>
							<div className="flex justify-between items-center text-sm ">
								<span>{item.budgetCategory?.name}</span>
								<span
									className={`whitespace-nowrap ${
										item.type === BudgetAmountType.EXPENSE
											? "text-primary"
											: "text-green-500 font-semibold"
									}`}
								>
									{`${
										item.type === BudgetAmountType.EXPENSE ? "-" : "+"
									}${formatCurrency(Math.abs(item.amount), "DOP", true)}`}
								</span>
							</div>
							<div className="text-sm text-gray-500 dark:text-gray-400">
								{format(item.correspondingDate, "PPP")}
							</div>
						</li>
					))}
				</ul>
			) : (
				<p className="text-primary/80 text-sm">{t("noHistory")}</p>
			)}
		</div>
	);
};

export default AppSideHistorySummary;
