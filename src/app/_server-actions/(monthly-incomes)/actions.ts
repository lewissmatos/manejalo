"use server";

import { getTranslations } from "next-intl/server";
import { IncomeType, MonthlyIncome, Profile } from "@/generated/prisma";
import { ResponseModel } from "../utils/actions.utils";
import { prisma } from "@/lib/prisma/prisma";
type ResponseData = MonthlyIncome | null;

export const createMonthlyIncome = async (
	payload: Omit<MonthlyIncome, "id" | "createdAt">
): Promise<ResponseModel<ResponseData>> => {
	const t = await getTranslations("ProfilePage.AddIncomeDialog");
	try {
		const res = await prisma.monthlyIncome.create({
			data: {
				amount: payload.amount,
				description: payload.description,
				profileId: payload.profileId,
				emoji: payload?.emoji,
				type: payload?.type || IncomeType.EMPLOYMENT,
			},
		});

		return {
			data: res,
			message: t("messages.defaultSuccessMessage"),
			isSuccess: true,
		};
	} catch (error) {
		console.error("Error adding monthly income:", error);
		return {
			data: null,
			message: t("messages.defaultErrorMessage"),
			isSuccess: false,
		};
	}
};

export const updateMonthlyIncome = async (
	incomeId: string,
	payload: Partial<MonthlyIncome>
): Promise<ResponseModel<ResponseData>> => {
	const t = await getTranslations("ProfilePage");
	try {
		const res = await prisma.monthlyIncome.update({
			where: { id: incomeId },
			data: {
				emoji: payload?.emoji,
				type: payload?.type || IncomeType.EMPLOYMENT,
				amount: payload.amount,
				description: payload.description,
			},
		});

		return {
			data: res,
			message: t("messages.defaultSuccessMessage"),
			isSuccess: true,
		};
	} catch (error) {
		console.error("Error adding monthly income:", error);
		return {
			data: null,
			message: t("messages.defaultErrorMessage"),
			isSuccess: false,
		};
	}
};

export const setMonthlyIncomeStatus = async (
	incomeId: string,
	newStatus: boolean
): Promise<ResponseModel<null>> => {
	const t = await getTranslations("ProfilePage");
	try {
		await prisma.monthlyIncome.update({
			where: { id: incomeId },
			data: {
				isActive: newStatus,
			},
		});
		return {
			data: null,
			//UPDATE
			message: t(
				"MonthlyIncomeCard.messages.setMonthlyIncomeStatusSuccessMessage"
			),
			isSuccess: true,
		};
	} catch (error) {
		console.error("Error removing monthly income:", error);
		return {
			data: null,
			//UPDATE
			message: t(
				"MonthlyIncomeCard.messages.setMonthlyIncomeStatusErrorMessage"
			),
			isSuccess: false,
		};
	}
};
