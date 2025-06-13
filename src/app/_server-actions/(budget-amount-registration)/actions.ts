"use server";

import { getTranslations } from "next-intl/server";
import { BudgetAmountRegistration, BudgetAmountType } from "@/generated/prisma";
import { ResponseModel } from "../utils/actions.utils";
import { prisma } from "@/lib/prisma/prisma";
import { JsonObject, JsonValue } from "@/generated/prisma/runtime/library";
type ResponseData = BudgetAmountRegistration | null;

export const addBudgetAmountRegistration = async (
	payload: Omit<BudgetAmountRegistration, "id" | "createdAt">
): Promise<ResponseModel<ResponseData>> => {
	const t = await getTranslations("OverviewPage.messages");
	try {
		const res = await prisma.budgetAmountRegistration.create({
			data: {
				amount: payload?.amount,
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

export type BudgetCategoryExpense = {
	label: string;
	id: string;
	createdAt: Date;
	amount: number;
	type: BudgetAmountType;
	budgetCategoryId: string;
	details: string | null;
	budgetCategoryReference: JsonValue;
	registrationDate: Date;
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
		const res = await prisma.budgetAmountRegistration.findMany({
			where: {
				budgetCategory: {
					profileId: profileId,
				},
				registrationDate: {
					gte: startDate,
					lte: endDate,
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
		});

		const data = res.reduce((acc, curr) => {
			const category = (curr.budgetCategoryReference as { name: string }).name;
			if (!acc[category]) {
				acc[category] = {
					...curr,
					amount: 0,
				};
			}
			acc[category].amount += curr.amount;
			return acc;
		}, {} as Record<string, BudgetAmountRegistration>);

		// Convert to array and add "label" property
		const dataArray = Object.entries(data).map(([label, obj]) => ({
			...obj,
			label,
		}));

		return {
			data: dataArray,
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
