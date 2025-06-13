"use server";

import { getTranslations } from "next-intl/server";
import { BudgetAmountRegistration, BudgetAmountType } from "@/generated/prisma";
import { ResponseModel } from "../utils/actions.utils";
import { prisma } from "@/lib/prisma/prisma";
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
				budgetCategoryReference: payload?.budgetCategoryReference || undefined,
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
