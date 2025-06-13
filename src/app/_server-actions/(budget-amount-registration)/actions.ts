"use server";

import { getTranslations } from "next-intl/server";
import { BudgetAmountRegistration, BudgetAmountType } from "@/generated/prisma";
import { ResponseModel } from "../utils/actions.utils";
import { prisma } from "@/lib/prisma/prisma";
import { JsonObject } from "@/generated/prisma/runtime/library";
type ResponseData = BudgetAmountRegistration | null;

export type BudgetCategoryExpense = {
	label: string;
	amount: number;
	budgetCategoryId: string;
	registrationDate: Date;
};

export const addBudgetAmountRegistration = async (
	payload: Omit<BudgetAmountRegistration, "id" | "createdAt">
): Promise<ResponseModel<ResponseData>> => {
	const t = await getTranslations("OverviewPage.messages");
	try {
		const res = await prisma.budgetAmountRegistration.create({
			data: {
				amount:
					payload.type === BudgetAmountType.EXPENSE
						? payload?.amount
						: -payload?.amount,
				registrationDate: payload?.registrationDate,
				details: payload?.details || "",
				type: payload?.type || BudgetAmountType.EXPENSE,
				budgetCategoryId: payload?.budgetCategoryId,
				budgetCategoryReference: payload?.budgetCategoryReference as JsonObject,
			},
		});
		if (!res) {
			return {
				data: null,
				message: t("createErrorMessage"),
				isSuccess: false,
			};
		}

		return {
			data: res,
			message: t("registerAmountSuccessMessage"),
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

export const getBudgetAmountRegistrationHistory = async (
	profileId: string
): Promise<ResponseModel<BudgetAmountRegistration[]>> => {
	const t = await getTranslations("MyBudgetPage.messages");
	try {
		const res = await prisma.budgetAmountRegistration.findMany({
			where: {
				budgetCategory: {
					profileId: profileId,
				},
			},
			include: {
				budgetCategory: {
					select: {
						id: true,
						name: true,
						emoji: true,
					},
				},
			},
			orderBy: [{ createdAt: "desc" }],
			take: 20,
		});

		return {
			data: res,
			message: "",
			isSuccess: true,
		};
	} catch (error) {
		console.error("Error fetching budget categories:", error);
		return {
			data: null,
			message: t("defaultErrorMessage"),
			isSuccess: false,
		};
	}
};

export const getBudgetAmountRegistrationsGroupedByCategory = async ({
	profileId,
	startDate,
	endDate,
}: {
	profileId: string;
	startDate: Date;
	endDate: Date;
}): Promise<ResponseModel<BudgetCategoryExpense[]>> => {
	const t = await getTranslations("MyBudgetPage.messages");
	try {
		const res = await prisma.budgetAmountRegistration.groupBy({
			by: ["budgetCategoryId", "registrationDate"],
			_sum: {
				amount: true,
			},
			where: {
				budgetCategory: {
					profileId: profileId,
				},
				registrationDate: {
					gte: startDate,
					lte: endDate,
				},
			},
			orderBy: [{ registrationDate: "desc" }],
		});

		const categories = await prisma.budgetCategory.findMany({
			where: {
				profileId,
			},
			select: {
				name: true,
				id: true,
			},
		});

		const finalData = res.map((item) => {
			const category = categories.find((x) => x.id === item.budgetCategoryId);
			return {
				amount: item._sum.amount || 0,
				label: category?.name || "",
				budgetCategoryId: item.budgetCategoryId || "",
				registrationDate: item.registrationDate,
			};
		});

		return {
			data: finalData,
			message: "",
			isSuccess: true,
		};
	} catch (error) {
		console.error("Error fetching budget categories:", error);
		return {
			data: null,
			message: t("defaultErrorMessage"),
			isSuccess: false,
		};
	}
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
	const t = await getTranslations("MyBudgetPage.messages");
	try {
		const res = await prisma.budgetAmountRegistration.aggregate({
			_sum: {
				amount: true,
			},
			where: {
				budgetCategory: {
					profileId: profileId,
				},
				registrationDate: {
					gte: startDate,
					lte: endDate,
				},
			},
		});
		return {
			data: res._sum.amount || 0,
			message: "",
			isSuccess: true,
		};
	} catch (error) {
		console.error("Error fetching budget categories:", error);
		return {
			data: null,
			message: t("defaultErrorMessage"),
			isSuccess: false,
		};
	}
};
