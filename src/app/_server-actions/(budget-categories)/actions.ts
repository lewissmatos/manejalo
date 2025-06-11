"use server";

import { getTranslations } from "next-intl/server";
import { BudgetCategory } from "@/generated/prisma";
import { ResponseModel } from "../utils/actions.utils";
import { prisma } from "@/lib/prisma/prisma";
type ResponseData = BudgetCategory | null;

export const getBudgetCategories = async (
	profileId: string
): Promise<ResponseModel<BudgetCategory[]>> => {
	const t = await getTranslations("MyBudgetsPage.messages");
	try {
		const res = await prisma.budgetCategory.findMany({
			where: { profileId },
			orderBy: { createdAt: "desc" },
		});

		return {
			data: res,
			message: "",
			isSuccess: true,
		};
	} catch (error) {
		console.error("Error fetching budget categories:", error);
		return {
			data: [],
			message: t("defaultErrorMessage"),
			isSuccess: false,
		};
	}
};

export const addBudgetCategory = async (
	payload: Omit<BudgetCategory, "id" | "createdAt">
): Promise<ResponseModel<ResponseData>> => {
	const t = await getTranslations("MyBudgetsPage.messages");
	try {
		const res = await prisma.budgetCategory.create({
			data: {
				emoji: payload?.emoji,
				estimation: payload.estimation,
				name: payload.name,
				description: payload.description,
				profileId: payload.profileId,
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
	const t = await getTranslations("MyBudgetsPage.messages");

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
	const t = await getTranslations("MyBudgetsPage.messages");

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
