"use server";

import { getTranslations } from "next-intl/server";
import { BudgetCategory } from "@/generated/prisma";
import {
	ResponseModel,
	serviceResponseHandler,
} from "../../../lib/services/utils/actions.utils";
import {
	addBudgetCategoryService,
	deleteBudgetCategoryService,
	getBudgetCategoriesService,
	markBudgetCategoryAsFavoriteService,
	setBudgetCategoryStatusService,
	updateBudgetCategoryService,
} from "@/lib/services/budget-categories-service";
type ResponseData = BudgetCategory | null;

export const getBudgetCategories = async (
	profileId: string
): Promise<
	ResponseModel<{
		budgetCategories: BudgetCategory[];
		totalBudget: number;
	}>
> => {
	return await serviceResponseHandler(
		async () => await getBudgetCategoriesService(profileId)
	);
};

export const addBudgetCategory = async (
	payload: Omit<BudgetCategory, "id" | "createdAt">
): Promise<ResponseModel<ResponseData>> => {
	const t = await getTranslations("MyBudgetPage.messages");

	return await serviceResponseHandler<ResponseData>(
		async () => await addBudgetCategoryService(payload),
		{
			successMessage: t("createSuccessMessage"),
			errorMessage: t("createErrorMessage"),
		}
	);
};

export const updateBudgetCategory = async (
	incomeId: string,
	payload: Partial<BudgetCategory>
): Promise<ResponseModel<ResponseData>> => {
	const t = await getTranslations("MyBudgetPage.messages");
	return await serviceResponseHandler<ResponseData>(
		async () => await updateBudgetCategoryService(incomeId, payload),
		{
			successMessage: t("updateSuccessMessage"),
			errorMessage: t("updateErrorMessage"),
		}
	);
};

export const deleteBudgetCategory = async (
	incomeId: string
): Promise<ResponseModel<ResponseData>> => {
	const t = await getTranslations("MyBudgetPage.messages");
	return await serviceResponseHandler<ResponseData>(
		async () => await deleteBudgetCategoryService(incomeId),
		{
			successMessage: t("deleteSuccessMessage"),
			errorMessage: t("deleteErrorMessage"),
		}
	);
};

export const markBudgetCategoryAsFavorite = async (
	categoryId: string,
	isFavorite: boolean
): Promise<ResponseModel<ResponseData>> => {
	const t = await getTranslations("MyBudgetPage.messages");

	return await serviceResponseHandler<ResponseData>(
		async () => markBudgetCategoryAsFavoriteService(categoryId, isFavorite),
		{
			successMessage: isFavorite
				? t("markAsFavoriteSuccessMessage")
				: t("unmarkAsFavoriteSuccessMessage"),
		}
	);
};

export const setBudgetCategoryStatus = async (
	categoryId: string,
	newStatus: boolean
): Promise<ResponseModel<ResponseData>> => {
	const t = await getTranslations("MyBudgetPage.messages");

	return await serviceResponseHandler<ResponseData>(
		async () => await setBudgetCategoryStatusService(categoryId, newStatus),
		{
			successMessage: newStatus
				? t("activateSuccessMessage")
				: t("deactivateSuccessMessage"),
		}
	);
};
