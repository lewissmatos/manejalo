import React from "react";
import { getTranslations } from "next-intl/server";
import { getBudgetCategories } from "@/app/_server-actions/(budget-categories)/actions";
import { revalidatePath } from "next/cache";
import RegisterAmountToCategoryCard from "./_components/register-amount-to-category-card";
import ScreenTitle from "../_components/screen-title";
import { endOfMonth, format, parseISO, startOfMonth } from "date-fns";
import {
	getBudgetAmountRegistrationsGroupedByCategoryForPieChart,
	getHighestExpendingMonthsForBarChart,
	getTotalBudgetAmountRegistrationByDateRange,
} from "@/app/_server-actions/(budget-amount-registrations)/actions";
import OverviewHistorySummary from "./_components/overview-history-summary";
import OverviewDateSelector from "./_components/overview-date-selector";
import HighestExpendingMonthsBarChart from "../history/_components/highest-expending-months-bar-chart";
import { getTotalMonthlyBudget } from "@/app/_server-actions/(profile)/actions";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { AlertCircleIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import BudgetCategoryExpensesPieChartWrapper from "./_components/budget-category-expenses-pie-chart-wrapper";
import { getSession } from "@/middleware";
import { getEmergencyFund } from "@/app/_server-actions/(emergency-fund)/actions";

import RegisterAmountEmergencyFundCard from "./_components/register-amount-emergency-fund-card";

const Overview = async ({
	searchParams,
}: {
	searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
	const [profileId, t, { selected_date: selectedDate }] = await Promise.all([
		(await getSession())?.profile?.id,
		getTranslations(""),
		(await searchParams) || {},
	]);

	if (!profileId) {
		return <div className="text-destructive">Profile ID not found.</div>;
	}

	const [
		{ data: emergencyFundData },
		{ data: budgetCategories },
		{ data: highestExpendingOverTimeData },
	] = await Promise.all([
		getEmergencyFund(profileId),
		getBudgetCategories(profileId, { isActive: true }),
		getHighestExpendingMonthsForBarChart({ profileId }),
	]);

	const now = new Date();

	const dates = {
		startDate: format(
			startOfMonth(
				selectedDate ? new Date(parseISO(selectedDate.toString())) : now
			),
			"yyyy-MM-dd"
		),
		endDate: format(
			endOfMonth(
				selectedDate ? new Date(parseISO(selectedDate.toString())) : now
			),
			"yyyy-MM-dd"
		),
	};

	const [
		budgetAmountRegistrationsGroupedByCategory,
		totalMonthlyBudget,
		totalBudgetAmount,
	] = await Promise.all([
		getBudgetAmountRegistrationsGroupedByCategoryForPieChart({
			profileId,
			startDate: new Date(dates.startDate),
			endDate: new Date(dates.endDate),
		}),
		getTotalMonthlyBudget(profileId),
		getTotalBudgetAmountRegistrationByDateRange({
			profileId,
			startDate: new Date(dates.startDate),
			endDate: new Date(dates.endDate),
		}),
	]);

	const categories = budgetCategories?.budgetCategories || [];

	const refetchData = async () => {
		"use server";
		await revalidatePath("/dashboard/overview");
	};

	return (
		<div className="h-full gap-4 w-full overflow-y-hidden">
			<section className="flex flex-col items-start">
				<ScreenTitle>{t("OverviewPage.title")}</ScreenTitle>
				<p className="text-md mb-4">{t("OverviewPage.subtitle")}</p>
			</section>
			{!categories?.length ? (
				<div className="w-full md:w-[46vw]">
					<Alert>
						<AlertCircleIcon className="h-4 w-4" />
						<AlertTitle className="text-sm">
							{t("OverviewPage.noBudgetCategories")}
						</AlertTitle>
						<Link href="/dashboard/my-budget">
							<Button variant={"link"}>
								{t("common.goToWithValue", { href: t("MyBudgetPage.title") })}
							</Button>
						</Link>
					</Alert>
				</div>
			) : (
				<div className="flex flex-col md:flex-row mt-4 gap-4 justify-between w-full h-full">
					<div className="flex flex-col gap-4 w-full md:w-1/2">
						<OverviewDateSelector />
						<div className="flex flex-wrap gap-4 justify-start max-h-[33rem]  items-start overflow-y-auto pb-2">
							{emergencyFundData?.isActive ? (
								<RegisterAmountEmergencyFundCard
									refetchData={refetchData}
									emergencyFund={emergencyFundData}
								/>
							) : null}
							{categories?.map((category) => (
								<RegisterAmountToCategoryCard
									key={category.id}
									category={category}
									refetchData={refetchData}
								/>
							))}
						</div>
					</div>
					<div className="flex flex-col w-full md:w-1/2">
						<div className="flex flex-col md:flex-row gap-1 justify-end w-full">
							<BudgetCategoryExpensesPieChartWrapper
								budgetAmountRegistrationsGroupedByCategory={
									budgetAmountRegistrationsGroupedByCategory
								}
								totalMonthlyBudget={totalMonthlyBudget}
								totalBudgetAmount={totalBudgetAmount}
							/>
							<OverviewHistorySummary />
						</div>
						{highestExpendingOverTimeData?.length ? (
							<HighestExpendingMonthsBarChart
								data={highestExpendingOverTimeData || []}
							/>
						) : null}
					</div>
				</div>
			)}
		</div>
	);
};

export default Overview;
