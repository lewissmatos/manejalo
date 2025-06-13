import React from "react";
import { getTranslations } from "next-intl/server";
import { cookies } from "next/headers";
import { getBudgetCategories } from "@/app/_server-actions/(budget-categories)/actions";
import { revalidatePath } from "next/cache";
import RegisterAmountToCategoryCard from "./_components/register-amount-to-category-card";
import CurrentFormattedDate from "../_components/current-formatted-date";
import ChartsSection from "./_components/charts-section";
import ScreenTitle from "../_components/screen-title";
import { Separator } from "@radix-ui/react-dropdown-menu";
import LineChart from "./_components/budget-category-expenses-by-month-per-year-wrapper";

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
		return <div className="text-red-500">Profile ID not found.</div>;
	}

	const { data } = await getBudgetCategories(profileId);

	const budgetCategories = data?.budgetCategories || [];

	const refetchBudgetCategories = async () => {
		"use server";
		await revalidatePath("/dashboard/overview");
	};

	return (
		<div className="h-calculate(100vh - 64px) gap-4 w-full">
			<section className="flex flex-col items-start">
				<ScreenTitle>{t("title")}</ScreenTitle>
				<p className="text-md mb-8">{t("subtitle")}</p>
			</section>
			<Separator />
			<CurrentFormattedDate />
			<div className="flex flex-row mt-4 gap-4">
				<div className="flex flex-wrap gap-4 w-7/12 max-h-[80vh] justify-start items-start overflow-y-auto">
					{budgetCategories?.map((category) => (
						<RegisterAmountToCategoryCard
							key={category.id}
							category={category}
							refetchData={refetchBudgetCategories}
						/>
					))}
				</div>
				<ChartsSection searchParams={await searchParams} />
			</div>
			<LineChart />
		</div>
	);
};

export default Overview;
