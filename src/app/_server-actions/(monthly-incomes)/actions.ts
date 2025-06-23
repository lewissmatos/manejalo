"use server";

import { IncomeType, MonthlyIncome } from "@/generated/prisma";
import {
	ResponseModel,
	serverActionResponseHandler,
} from "../utils/actions.utils";
import { prisma } from "@/lib/prisma/prisma";
type ResponseData = MonthlyIncome | null;

export const createMonthlyIncome = async (
	payload: Omit<MonthlyIncome, "id" | "createdAt">
): Promise<ResponseModel<ResponseData>> => {
	const fn = async () => {
		return await prisma.monthlyIncome.create({
			data: {
				amount: payload.amount,
				description: payload.description,
				profileId: payload.profileId,
				emoji: payload?.emoji,
				type: payload?.type || IncomeType.EMPLOYMENT,
			},
		});
	};

	return await serverActionResponseHandler<ResponseData>(fn, {
		translationsPath: "ProfilePage.AddIncomeDialog.messages",
		successMessageKey: "defaultSuccessMessage",
		errorMessageKey: "defaultErrorMessage",
	});
};

export const updateMonthlyIncome = async (
	incomeId: string,
	payload: Partial<MonthlyIncome>
): Promise<ResponseModel<ResponseData>> => {
	const fn = async () => {
		return await prisma.monthlyIncome.update({
			where: { id: incomeId },
			data: {
				emoji: payload?.emoji,
				type: payload?.type || IncomeType.EMPLOYMENT,
				amount: payload.amount,
				description: payload.description,
			},
		});
	};

	return await serverActionResponseHandler<ResponseData>(fn, {
		translationsPath: "ProfilePage.AddIncomeDialog.messages",
		successMessageKey: "updateSuccessMessage",
		errorMessageKey: "defaultErrorMessage",
	});
};

export const setMonthlyIncomeStatus = async (
	incomeId: string,
	newStatus: boolean
): Promise<ResponseModel<null>> => {
	const fn = async () => {
		await prisma.monthlyIncome.update({
			where: { id: incomeId },
			data: {
				isActive: newStatus,
			},
		});

		return null;
	};

	return await serverActionResponseHandler<null>(fn, {
		translationsPath: "ProfilePage.MonthlyIncomeCard.messages.",
		successMessageKey: "setMonthlyIncomeStatusSuccessMessage",
		errorMessageKey: "setMonthlyIncomeStatusErrorMessage",
	});
};

export const deleteMonthlyIncome = async (
	incomeId: string
): Promise<ResponseModel<null>> => {
	const fn = async () => {
		await prisma.monthlyIncome.delete({
			where: { id: incomeId },
		});
		return null;
	};

	return await serverActionResponseHandler<null>(fn, {
		translationsPath: "ProfilePage.MonthlyIncomeCard.messages",
		successMessageKey: "deleteSuccessMessage",
		errorMessageKey: "deleteErrorMessage",
	});
};
