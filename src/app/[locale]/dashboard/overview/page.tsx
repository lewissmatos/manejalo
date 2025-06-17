import React from "react";
import { getTranslations } from "next-intl/server";
import { cookies } from "next/headers";
import { getBudgetCategories } from "@/app/_server-actions/(budget-categories)/actions";
import { revalidatePath } from "next/cache";
import RegisterAmountToCategoryCard from "./_components/register-amount-to-category-card";
import ChartsSection from "./_components/charts-section";
import ScreenTitle from "../_components/screen-title";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { format, parseISO, startOfMonth } from "date-fns";
import { getHighestExpendingMonths } from "@/app/_server-actions/(budget-amount-registration)/actions";
import OverviewHistorySummary from "../_components/overview-history-summary";
import OverviewDateSelector from "./_components/overview-date-selector";
import HighestExpendingMonthsBarChart from "../history/_components/highest-expending-months-bar-chart";

const Overview = async ({
	searchParams,
}: {
	searchParams?: { [key: string]: string | string[] | undefined };
}) => {
	const [cookieStore, t] = await Promise.all([
		cookies(),
		getTranslations("OverviewPage"),
	]);

	const profileId = cookieStore.get("profile-id")?.value || "";

	if (!profileId) {
		return <div className="text-destructive">Profile ID not found.</div>;
	}

	const selectedDate = await searchParams?.selected_date;

	const year = new Date(
		format(
			startOfMonth(
				selectedDate ? new Date(parseISO(selectedDate.toString())) : new Date()
			),
			"yyyy-MM-dd"
		)
	).getFullYear();

	const [{ data: profileData }, { data: highestExpendingOverTimeData }] =
		await Promise.all([
			getBudgetCategories(profileId),

			getHighestExpendingMonths({ profileId }),
		]);

	const budgetCategories = profileData?.budgetCategories || [];

	const refetchData = async () => {
		"use server";
		await revalidatePath("/dashboard/overview");
	};

	return (
		<div className="h-calculate(100vh - 64px) gap-4 w-full">
			<section className="flex flex-col items-start">
				<ScreenTitle>{t("title")}</ScreenTitle>
				<p className="text-md mb-4">{t("subtitle")}</p>
			</section>
			<div className="flex flex-row mt-4 gap-4 justify-between w-full">
				<div className="flex flex-col gap-4 w-1/2">
					<OverviewDateSelector />
					<div className="flex flex-wrap gap-4 justify-start max-h-[33rem]  items-start overflow-y-auto">
						{budgetCategories?.map((category) => (
							<RegisterAmountToCategoryCard
								key={category.id}
								category={category}
								refetchData={refetchData}
							/>
						))}
					</div>
				</div>
				<div className="flex flex-col w-1/2">
					<div className="flex flex-row gap-2 justify-end w-full">
						<ChartsSection searchParams={await searchParams} />
						{/* <AppSideCalendar /> */}
						<OverviewHistorySummary />
					</div>
					<HighestExpendingMonthsBarChart
						data={highestExpendingOverTimeData || []}
					/>
				</div>
			</div>
		</div>
	);
};

export default Overview;
