import {
	getBudgetAmountRegistrations,
	getTotalAmountRegistrationsForCalendarChart,
	getTotalBudgetAmountRegistrationPerYearForLineChart,
	getTotalExpensesOverTime,
} from "@/app/_server-actions/(budget-amount-registration)/actions";
import { parseISO, startOfMonth } from "date-fns";
import { format } from "date-fns/format";
import { getTranslations } from "next-intl/server";
import { cookies } from "next/headers";
import React from "react";
import ScreenTitle from "../_components/screen-title";
import {
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from "@/components/ui/pagination";
import TotalExpendingOverTimeSection from "./_components/total-expending-overtime-section";
import HistoryTable from "./_components/history-table";
import BudgetCategoryExpensesByMonthLineChartWrapper from "../overview/_components/budget-category-expenses-line-chart-wrapper";
import TotalAmountRegistrationsCalendarChart from "./_components/total-amount-registrations-calendar-chart";

const PAGE_SIZE = 15;

const History = async ({
	searchParams,
}: {
	searchParams?: { [key: string]: string | string[] | undefined };
}) => {
	const [cookieStore, t] = await Promise.all([cookies(), getTranslations()]);
	const selectedDate = searchParams?.selected_date;
	const currentPage = parseInt((searchParams?.page as string) || "1");

	const profileId = cookieStore.get("profile-id")?.value || "";

	if (!profileId) {
		return <div className="text-destructive">Profile ID not found.</div>;
	}

	const year = new Date(
		format(
			startOfMonth(
				selectedDate ? new Date(parseISO(selectedDate.toString())) : new Date()
			),
			"yyyy-MM-dd"
		)
	).getFullYear();

	const [
		{ data: tableData },
		{ data: totalExpensesOverTimeData },
		{ data: totalAmountRegistrationsForCalendarChartData },
		totalBudgetAmountRegistrationPerYearForLineChartData,
	] = await Promise.all([
		getBudgetAmountRegistrations({
			profileId,
			page: currentPage,
			limit: PAGE_SIZE,
		}),
		getTotalExpensesOverTime({ profileId }),
		getTotalAmountRegistrationsForCalendarChart({
			profileId,
			year,
		}),
		getTotalBudgetAmountRegistrationPerYearForLineChart({
			profileId,
			year,
		}),
	]);

	const totalPages = tableData?.data?.totalPages || 1;

	return (
		<div className="h-calculate(100vh - 64px) gap-4 w-full">
			<section className="flex flex-col items-start">
				<ScreenTitle>{t("HistoryPage.title")}</ScreenTitle>
				<p className="text-md mb-8">{t("HistoryPage.subtitle")}</p>
			</section>
			<div className="flex flex-row gap-8">
				<div className="w-5/12">
					<HistoryTable
						data={tableData?.data?.registrations || []}
						totalAmount={tableData?.totalAmount || 0}
					/>
					<div className="pt-4">
						<Pagination>
							<PaginationContent>
								<PaginationItem>
									<PaginationPrevious
										href={`?page=${Math.max(currentPage - 1, 1)}${
											selectedDate ? `&selected_date=${selectedDate}` : ""
										}`}
									/>
								</PaginationItem>
								{Array.from({ length: totalPages }, (_, i) => {
									const page = i + 1;
									return (
										<PaginationItem key={page}>
											<PaginationLink
												href={`?page=${page}${
													selectedDate ? `&selected_date=${selectedDate}` : ""
												}`}
												isActive={page === currentPage}
											>
												{page}
											</PaginationLink>
										</PaginationItem>
									);
								})}
								<PaginationItem>
									<PaginationNext
										href={`?page=${Math.min(currentPage + 1, totalPages)}`}
									/>
								</PaginationItem>
							</PaginationContent>
						</Pagination>
					</div>
				</div>
				<div className="w-7/12 flex flex-col gap-2 items-start justify-between">
					<TotalExpendingOverTimeSection
						expense={totalExpensesOverTimeData?.EXPENSE || null}
						recovery={totalExpensesOverTimeData?.RECOVERY || null}
						total={totalExpensesOverTimeData?.total || null}
					/>
					<TotalAmountRegistrationsCalendarChart
						data={totalAmountRegistrationsForCalendarChartData || []}
					/>
					<BudgetCategoryExpensesByMonthLineChartWrapper
						year={year}
						// setYear={(year) => {
						// 	const params = new URLSearchParams(searchParams.toString());
						// 	params.set("year", year.toString());
						// 	replace(`?${params.toString()}`);
						// }}
						data={
							totalBudgetAmountRegistrationPerYearForLineChartData?.data || []
						}
					/>
				</div>
			</div>
		</div>
	);
};

export default History;
