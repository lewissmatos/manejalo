"use server";

import { MonthlyIncome } from "@/generated/prisma";
import {
	ResponseModel,
	serviceResponseHandler,
} from "../../../lib/services/utils/actions.utils";
import { getTranslations } from "next-intl/server";
import {
	createMonthlyIncomeService,
	deleteMonthlyIncomeService,
	getMonthlyIncomesService,
	setMonthlyIncomeStatusService,
	updateMonthlyIncomeService,
} from "@/lib/services/monthly-incomes-services";

type ResponseData = MonthlyIncome | null;

export const getMonthlyIncomes = async (
	profileId: string
): Promise<ResponseModel<MonthlyIncome[]>> =>
	await serviceResponseHandler<MonthlyIncome[]>(
		async () => await getMonthlyIncomesService(profileId)
	);

export const createMonthlyIncome = async (
	payload: Omit<MonthlyIncome, "id" | "createdAt">
): Promise<ResponseModel<ResponseData>> => {
	const t = await getTranslations("ProfilePage.AddIncomeDialog.messages");

	return await serviceResponseHandler<ResponseData>(
		async () => await createMonthlyIncomeService(payload),
		{
			successMessage: t("defaultSuccessMessage"),
			errorMessage: t("defaultErrorMessage"),
		}
	);
};

export const updateMonthlyIncome = async (
	incomeId: string,
	payload: Partial<MonthlyIncome>
): Promise<ResponseModel<ResponseData>> => {
	const t = await getTranslations("ProfilePage.AddIncomeDialog.messages");

	return await serviceResponseHandler<ResponseData>(
		async () => await updateMonthlyIncomeService(incomeId, payload),
		{
			successMessage: t("updateSuccessMessage"),
			errorMessage: t("defaultErrorMessage"),
		}
	);
};

export const setMonthlyIncomeStatus = async (
	incomeId: string,
	newStatus: boolean
): Promise<ResponseModel<null>> => {
	const t = await getTranslations("ProfilePage.AddIncomeDialog.messages");

	return await serviceResponseHandler(
		async () => await setMonthlyIncomeStatusService(incomeId, newStatus),
		{
			successMessage: t("setMonthlyIncomeStatusSuccessMessage"),
			errorMessage: t("setMonthlyIncomeStatusErrorMessage"),
		}
	);
};

export const deleteMonthlyIncome = async (
	incomeId: string
): Promise<ResponseModel<null>> => {
	const t = await getTranslations("ProfilePage.AddIncomeDialog.messages");

	return await serviceResponseHandler(
		async () => await deleteMonthlyIncomeService(incomeId),
		{
			successMessage: t("deleteSuccessMessage"),
			errorMessage: t("deleteErrorMessage"),
		}
	);
};
