"use server";

import { getTranslations } from "next-intl/server";
import {
	BudgetAmountRegistration,
	BudgetAmountType,
	BudgetCategory,
} from "@/generated/prisma";
import {
	ResponseModel,
	serviceResponseHandler,
} from "../../../lib/services/utils/actions.utils";
import {
	addBudgetAmountRegistrationService,
	getBudgetAmountRegistrationHistoryService,
	getBudgetAmountRegistrationsGroupedByCategoryForPieChartService,
	getBudgetAmountRegistrationsService,
	getHighestExpendingMonthsForBarChartService,
	getTotalAmountRegistrationsForCalendarChartService,
	getTotalBudgetAmountRegistrationByDateRangeService,
	getTotalBudgetAmountRegistrationPerYearForLineChartService,
	getTotalExpensesOverTimeService,
	HistoryItem,
} from "@/lib/services/budget-amount-registration-service";
type ResponseData = BudgetAmountRegistration | null;

export type BudgetCategoryExpense = {
	label: string;
	value: number;
	id: string;
};

export const addBudgetAmountRegistration = async (
	payload: Omit<BudgetAmountRegistration, "id" | "createdAt">
): Promise<ResponseModel<ResponseData>> => {
	const t = await getTranslations("OverviewPage.messages");

	return await serviceResponseHandler<ResponseData>(
		async () => await addBudgetAmountRegistrationService(payload),
		{
			successMessage: t("registerAmountSuccessMessage"),
			errorMessage: t("registerAmountErrorMessage"),
			translator: t,
		}
	);
};

export const getBudgetAmountRegistrations = async ({
	profileId,
	page,
	limit,
}: {
	profileId: string;
	page: number;
	limit: number;
}): Promise<
	ResponseModel<{
		registrations: Array<
			BudgetAmountRegistration & {
				budgetCategory: BudgetCategory;
			}
		>;
		totalCount: number;
		totalPages: number;
		limit: number;
		page: number;
	}>
> => {
	return await serviceResponseHandler<{
		registrations: Array<
			BudgetAmountRegistration & {
				budgetCategory: BudgetCategory;
			}
		>;
		totalCount: number;
		totalPages: number;
		limit: number;
		page: number;
	}>(
		async () =>
			await getBudgetAmountRegistrationsService({ profileId, page, limit })
	);
};

export const getBudgetAmountRegistrationHistory = async (
	profileId: string
): Promise<ResponseModel<HistoryItem[]>> => {
	const t = await getTranslations("OverviewPage.messages");

	return await serviceResponseHandler<HistoryItem[]>(
		async () => await getBudgetAmountRegistrationHistoryService(profileId),
		{ successMessage: t("registerAmountSuccessMessage") }
	);
};

export const getBudgetAmountRegistrationsGroupedByCategoryForPieChart = async ({
	profileId,
	startDate,
	endDate,
}: {
	profileId: string;
	startDate: Date;
	endDate: Date;
}): Promise<ResponseModel<BudgetCategoryExpense[]>> => {
	return await serviceResponseHandler<BudgetCategoryExpense[]>(
		async () =>
			await getBudgetAmountRegistrationsGroupedByCategoryForPieChartService({
				profileId,
				startDate,
				endDate,
			}),
		{
			successMessage: "registerAmountSuccessMessage",
		}
	);
};

export const getTotalBudgetAmountRegistrationByDateRange = async ({
	profileId,
	startDate,
	endDate,
}: {
	profileId: string;
	startDate: Date;
	endDate: Date;
}): Promise<ResponseModel<number>> => {
	return await serviceResponseHandler<number>(
		async () =>
			await getTotalBudgetAmountRegistrationByDateRangeService({
				profileId,
				startDate,
				endDate,
			})
	);
};

export const getTotalBudgetAmountRegistrationPerYearForLineChart = async ({
	year,
	profileId,
}: {
	year: number;
	profileId: string;
}): Promise<
	ResponseModel<{ id: string; data: Array<{ x: string; y: string }> }[]>
> => {
	return await serviceResponseHandler<
		{
			id: string;
			data: Array<{ x: string; y: string }>;
		}[]
	>(async () =>
		getTotalBudgetAmountRegistrationPerYearForLineChartService({
			year,
			profileId,
		})
	);
};

export const getTotalExpensesOverTime = async ({
	profileId,
	year,
}: {
	profileId: string;
	year: number;
}): Promise<
	ResponseModel<{
		[BudgetAmountType.EXPENSE]: number;
		[BudgetAmountType.RECOVERY]: number;
		total: number;
	}>
> => {
	return await serviceResponseHandler<{
		[BudgetAmountType.EXPENSE]: number;
		[BudgetAmountType.RECOVERY]: number;
		total: number;
	}>(async () => getTotalExpensesOverTimeService({ profileId, year }));
};

export const getHighestExpendingMonthsForBarChart = async ({
	profileId,
}: {
	profileId: string;
}): Promise<
	ResponseModel<
		{
			date: string;
			value: number;
		}[]
	>
> => {
	return await serviceResponseHandler<{ date: string; value: number }[]>(
		async () => await getHighestExpendingMonthsForBarChartService({ profileId })
	);
};

export const getTotalAmountRegistrationsForCalendarChart = async ({
	profileId,
	year,
}: {
	profileId: string;
	year: number;
}): Promise<
	ResponseModel<
		{
			day: `${number}-${number}-${number}`;
			value: number;
		}[]
	>
> => {
	return await serviceResponseHandler<
		{ day: `${number}-${number}-${number}`; value: number }[]
	>(
		async () =>
			await getTotalAmountRegistrationsForCalendarChartService({
				profileId,
				year,
			})
	);
};
