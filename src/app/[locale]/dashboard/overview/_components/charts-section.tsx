import React from "react";
import BudgetCategoryExpensesChart from "./budget-category-expenses-chart";
import { getBudgetAmountRegistrationsGroupedByCategory } from "@/app/_server-actions/(budget-amount-registration)/actions";
import { cookies } from "next/headers";

const ChartsSection = async () => {
	const cookieStore = await cookies();
	const profileId = cookieStore.get("profile-id")?.value || "";
	const budgetAmountRegistrationsGroupedByCategory =
		await getBudgetAmountRegistrationsGroupedByCategory({
			profileId,
			startDate: new Date(new Date().getFullYear(), 5, 9),
			endDate: new Date(new Date().getFullYear(), 5, 12),
		});

	return (
		<section
			id="charts-section"
			className="flex flex-col gap-4 items-center w-5/12"
		>
			<ChartWrapper>
				<BudgetCategoryExpensesChart
					data={budgetAmountRegistrationsGroupedByCategory.data || []}
				/>
			</ChartWrapper>
		</section>
	);
};

const ChartWrapper = ({ children }: { children: React.ReactNode }) => {
	return (
		<div className="w-full rounded-md flex flex-col items-center justify-center">
			{children}
		</div>
	);
};

export default ChartsSection;
