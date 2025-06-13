import React from "react";
import { getTranslations } from "next-intl/server";
import { cookies } from "next/headers";
import { getBudgetCategories } from "@/app/_server-actions/(budget-categories)/actions";
import { revalidatePath } from "next/cache";
import RegisterAmountToCategoryCard from "./_components/register-amount-to-category-card";
import CurrentFormattedDate from "../_components/current-formatted-date";
import ChartsSection from "./_components/charts-section";

const Overview = async () => {
	const t = await getTranslations("MyBudgetPage");
	const cookieStore = await cookies();

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
			<CurrentFormattedDate />
			<div className="flex flex-row mt-4 gap-4 ">
				<div className="flex flex-wrap gap-4 w-7/12 h-[80vh] overflow-y-auto">
					{budgetCategories?.map((category) => (
						<RegisterAmountToCategoryCard
							key={category.id}
							category={category}
							refetchData={refetchBudgetCategories}
						/>
					))}
				</div>
				<ChartsSection />
			</div>
		</div>
	);
};

export default Overview;
