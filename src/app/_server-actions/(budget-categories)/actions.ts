"use server";

import { getTranslations } from "next-intl/server";
import { BudgetCategory } from "@/generated/prisma";
import { ResponseModel } from "../utils/actions.utils";
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
	const t = await getTranslations("MyBudgetPage.messages");
	try {
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
			data: {
				budgetCategories: res,
				totalBudget: profileData?.totalBudget || 0,
			},
			message: "",
			isSuccess: true,
		};
	} catch (error) {
		console.error("Error fetching budget categories:", error);
		return {
			data: {
				budgetCategories: [],
				totalBudget: 0,
			},
			message: t("defaultErrorMessage"),
			isSuccess: false,
		};
	}
};

export const addBudgetCategory = async (
	payload: Omit<BudgetCategory, "id" | "createdAt">
): Promise<ResponseModel<ResponseData>> => {
	const t = await getTranslations("MyBudgetPage.messages");
	try {
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

		return {
			data: res,
			message: t("createSuccessMessage"),
			isSuccess: true,
		};
	} catch (error) {
		console.error("Error adding monthly income:", error);
		return {
			data: null,
			message: t("createErrorMessage"),
			isSuccess: false,
		};
	}
};

export const updateBudgetCategory = async (
	incomeId: string,
	payload: Partial<BudgetCategory>
): Promise<ResponseModel<ResponseData>> => {
	const t = await getTranslations("MyBudgetPage.messages");

	try {
		const res = await prisma.budgetCategory.update({
			where: { id: incomeId },
			data: {
				emoji: payload?.emoji,
				estimation: payload.estimation,
				name: payload.name,
				description: payload.description,
			},
		});

		return {
			data: res,
			message: t("updateSuccessMessage"),
			isSuccess: true,
		};
	} catch (error) {
		console.error("Error adding monthly income:", error);
		return {
			data: null,
			message: t("updateErrorMessage"),
			isSuccess: false,
		};
	}
};

export const deleteBudgetCategory = async (
	incomeId: string
): Promise<ResponseModel<ResponseData>> => {
	const t = await getTranslations("MyBudgetPage.messages");

	try {
		await prisma.budgetCategory.delete({
			where: { id: incomeId },
		});

		return {
			data: null,
			message: t("deleteSuccessMessage"),
			isSuccess: true,
		};
	} catch (error) {
		console.error("Error deleting budget category:", error);
		return {
			data: null,
			message: t("deleteErrorMessage"),
			isSuccess: false,
		};
	}
};

export const markBudgetCategoryAsFavorite = async (
	categoryId: string,
	isFavorite: boolean
): Promise<ResponseModel<ResponseData>> => {
	const t = await getTranslations("MyBudgetPage.messages");

	try {
		const res = await prisma.budgetCategory.update({
			where: { id: categoryId },
			data: { isFavorite },
		});

		return {
			data: res,
			message: isFavorite
				? t("markAsFavoriteSuccessMessage")
				: t("unmarkAsFavoriteSuccessMessage"),
			isSuccess: true,
		};
	} catch (error) {
		console.error("Error marking budget category as favorite:", error);
		return {
			data: null,
			message: t("defaultErrorMessage"),
			isSuccess: false,
		};
	}
};

export const setBudgetCategoryStatus = async (
	categoryId: string,
	newStatus: boolean
): Promise<ResponseModel<ResponseData>> => {
	const t = await getTranslations("MyBudgetPage.messages");

	try {
		const res = await prisma.budgetCategory.update({
			where: { id: categoryId },
			data: { isActive: newStatus },
		});

		return {
			data: res,
			message: newStatus
				? t("activateSuccessMessage")
				: t("deactivateSuccessMessage"),
			isSuccess: true,
		};
	} catch (error) {
		console.error("Error setting budget category status:", error);
		return {
			data: null,
			message: t("defaultErrorMessage"),
			isSuccess: false,
		};
	}
};
