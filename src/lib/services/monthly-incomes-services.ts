"use server";

import { IncomeType, MonthlyIncome } from "@/generated/prisma";
import { prisma } from "@/lib/prisma/prisma";
type ResponseData = MonthlyIncome | null;

export const getMonthlyIncomesService = async (
	profileId: string
): Promise<MonthlyIncome[]> => {
	return await prisma.monthlyIncome.findMany({
		where: { profileId },
	});
};

export const createMonthlyIncomeService = async (
	payload: Omit<MonthlyIncome, "id" | "createdAt">
): Promise<ResponseData> => {
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

export const updateMonthlyIncomeService = async (
	incomeId: string,
	payload: Partial<MonthlyIncome>
): Promise<ResponseData> => {
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

export const setMonthlyIncomeStatusService = async (
	incomeId: string,
	newStatus: boolean
): Promise<null> => {
	await prisma.monthlyIncome.update({
		where: { id: incomeId },
		data: {
			isActive: newStatus,
		},
	});

	return null;
};

export const deleteMonthlyIncomeService = async (
	incomeId: string
): Promise<null> => {
	await prisma.monthlyIncome.delete({
		where: { id: incomeId },
	});
	return null;
};
