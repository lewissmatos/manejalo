import {
	getBudgetAmountRegistrations,
	getTotalAmountRegistrationsForCalendarChart,
	getTotalBudgetAmountRegistrationPerYearForLineChart,
	getTotalExpensesOverTime,
} from "@/app/_server-actions/(budget-amount-registrations)/actions";
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
import TotalExpensesByYearSection from "./_components/total-expenses-by-year-section";
import HistoryTable from "./_components/history-table";
import BudgetCategoryExpensesByMonthLineChartWrapper from "../overview/_components/budget-category-expenses-line-chart-wrapper";
import TotalAmountRegistrationsCalendarChart from "./_components/total-amount-registrations-calendar-chart";
import YearPicker from "@/components/common/year-picker";
import { revalidatePath } from "next/cache";

const PAGE_SIZE = 15;

const History = async ({
	searchParams,
}: {
	searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
	const [cookieStore, t, { year: selectedYear, page }] = await Promise.all([
		cookies(),
		getTranslations(),
		(await searchParams) || {},
	]);
	const currentPage = parseInt((page as string) || "1");

	const profileId = cookieStore.get("profile-id")?.value || "";

	if (!profileId) {
		return <div className="text-destructive">Profile ID not found.</div>;
	}

	const year = selectedYear ? Number(selectedYear) : new Date().getFullYear();

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
		getTotalExpensesOverTime({ profileId, year }),
		getTotalAmountRegistrationsForCalendarChart({
			profileId,
			year,
		}),
		getTotalBudgetAmountRegistrationPerYearForLineChart({
			profileId,
			year,
		}),
	]);
	const refetchData = async () => {
		"use server";
		await revalidatePath("/dashboard/history");
	};

	const totalPages = tableData?.totalPages || 1;

	return (
		<div className="h-calculate(100vh - 64px) gap-4 w-full">
			<section className="flex flex-col items-start">
				<ScreenTitle>{t("HistoryPage.title")}</ScreenTitle>
				<p className="text-md mb-8">{t("HistoryPage.subtitle")}</p>
			</section>
			<div className="flex flex-col-reverse md:flex-row gap-8">
				<div className="w-full md:w-1/3">
					<HistoryTable data={tableData?.registrations || []} />
					<div className="pt-4">
						<TablePagination
							currentPage={currentPage}
							totalPages={totalPages}
							selectedYear={year?.toString()}
						/>
					</div>
				</div>
				<div className="w-full md:w-2/3 flex flex-col gap-2 items-start justify-between">
					<div className="flex flex-row justify-between w-full gap-2">
						<YearPicker defaultYear={year} refresh={refetchData} />
						<TotalExpensesByYearSection
							expense={totalExpensesOverTimeData?.EXPENSE || null}
							recovery={totalExpensesOverTimeData?.RECOVERY || null}
							total={totalExpensesOverTimeData?.total || null}
							year={year}
						/>
					</div>
					{totalAmountRegistrationsForCalendarChartData?.length ? (
						<TotalAmountRegistrationsCalendarChart
							data={totalAmountRegistrationsForCalendarChartData || []}
						/>
					) : null}
					{totalBudgetAmountRegistrationPerYearForLineChartData?.data
						?.length ? (
						<BudgetCategoryExpensesByMonthLineChartWrapper
							year={year}
							data={
								totalBudgetAmountRegistrationPerYearForLineChartData?.data || []
							}
						/>
					) : null}
				</div>
			</div>
		</div>
	);
};

const TablePagination = ({
	currentPage,
	totalPages,
	selectedYear,
}: {
	currentPage: number;
	totalPages: number;
	selectedYear?: string;
}) => {
	return (
		<Pagination>
			<PaginationContent>
				{currentPage > 1 ? (
					<PaginationItem>
						<PaginationPrevious
							href={`?page=${Math.max(currentPage - 1, 1)}${
								selectedYear ? `&year=${selectedYear}` : ""
							}`}
						/>
					</PaginationItem>
				) : null}
				{Array.from({ length: totalPages }, (_, i) => {
					const page = i + 1;
					if (totalPages <= 1) return null;
					return (
						<PaginationItem key={page}>
							<PaginationLink
								href={`?page=${page}${
									selectedYear ? `&year=${selectedYear}` : ""
								}`}
								isActive={page === currentPage}
							>
								{page}
							</PaginationLink>
						</PaginationItem>
					);
				})}
				{currentPage < totalPages ? (
					<PaginationItem>
						<PaginationNext
							href={`?page=${Math.min(currentPage + 1, totalPages)}${
								selectedYear ? `&year=${selectedYear}` : ""
							}`}
						/>
					</PaginationItem>
				) : null}
			</PaginationContent>
		</Pagination>
	);
};
export default History;
