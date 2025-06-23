"use server";

import { getTranslations } from "next-intl/server";
import { BudgetCategory } from "@/generated/prisma";
import {
	ResponseModel,
	serverActionResponseHandler,
} from "../utils/actions.utils";
import { prisma } from "@/lib/prisma/prisma";
type ResponseData = BudgetCategory | null;

export const getBudgetCategories = async (
	profileId: string
): Promise<
	ResponseModel<{
		budgetCategories: BudgetCategory[];
		totalBudget: number;
	}>
> => {
	const fn = async () => {
		const res = await prisma.budgetCategory.findMany({
			where: { profileId },
			orderBy: [
				{ isFavorite: "desc" },
				{ estimation: "desc" },
				{ createdAt: "desc" },
			],
		});

		const profileData = await prisma.profile.findUnique({
			select: { totalBudget: true },
			where: { id: profileId },
		});

		return {
			budgetCategories: res,
			totalBudget: profileData?.totalBudget || 0,
		};
	};

	return await serverActionResponseHandler<{
		budgetCategories: BudgetCategory[];
		totalBudget: number;
	}>(fn, {
		translationsPath: "MyBudgetPage.messages",
		successMessageKey: "",
	});
};

export const addBudgetCategory = async (
	payload: Omit<BudgetCategory, "id" | "createdAt">
): Promise<ResponseModel<ResponseData>> => {
	const fn = async () => {
		const res = await prisma.budgetCategory.create({
			data: {
				emoji: payload?.emoji,
				estimation: payload.estimation,
				name: payload.name,
				description: payload.description,
				profileId: payload.profileId,
				isFavorite: payload?.isFavorite || false,
				isActive: payload?.isActive || true,
			},
		});

		return res;
	};
	return await serverActionResponseHandler<ResponseData>(fn, {
		translationsPath: "MyBudgetPage.messages",
		successMessageKey: "createSuccessMessage",
	});
};

export const updateBudgetCategory = async (
	incomeId: string,
	payload: Partial<BudgetCategory>
): Promise<ResponseModel<ResponseData>> => {
	const fn = async () => {
		const res = await prisma.budgetCategory.update({
			where: { id: incomeId },
			data: {
				emoji: payload?.emoji,
				estimation: payload.estimation,
				name: payload.name,
				description: payload.description,
			},
		});

		return res;
	};
	return await serverActionResponseHandler<ResponseData>(fn, {
		translationsPath: "MyBudgetPage.messages",
		successMessageKey: "updateSuccessMessage",
	});
};

export const deleteBudgetCategory = async (
	incomeId: string
): Promise<ResponseModel<ResponseData>> => {
	const fn = async () => {
		await prisma.budgetCategory.delete({
			where: { id: incomeId },
		});

		return null;
	};
	return await serverActionResponseHandler<ResponseData>(fn, {
		translationsPath: "MyBudgetPage.messages",
		successMessageKey: "deleteSuccessMessage",
		errorMessageKey: "deleteErrorMessage",
	});
};

export const markBudgetCategoryAsFavorite = async (
	categoryId: string,
	isFavorite: boolean
): Promise<ResponseModel<ResponseData>> => {
	const fn = async () => {
		const res = await prisma.budgetCategory.update({
			where: { id: categoryId },
			data: { isFavorite },
		});

		return res;
	};
	return await serverActionResponseHandler<ResponseData>(fn, {
		translationsPath: "MyBudgetPage.messages",
		successMessageKey: isFavorite
			? "markAsFavoriteSuccessMessage"
			: "unmarkAsFavoriteSuccessMessage",
	});
};

export const setBudgetCategoryStatus = async (
	categoryId: string,
	newStatus: boolean
): Promise<ResponseModel<ResponseData>> => {
	const fn = async () => {
		const res = await prisma.budgetCategory.update({
			where: { id: categoryId },
			data: { isActive: newStatus },
		});
		return res;
	};
	return await serverActionResponseHandler<ResponseData>(fn, {
		translationsPath: "MyBudgetPage.messages",
		successMessageKey: newStatus
			? "activateSuccessMessage"
			: "deactivateSuccessMessage",
	});
};
