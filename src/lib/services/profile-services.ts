"use server";

import { prisma } from "@/lib/prisma/prisma";
import { ProfileWithIncomes } from "@/lib/jotai/auth-atom";

export const getProfileDataService = async (
	profileId: string
): Promise<ProfileWithIncomes | null> => {
	return await prisma.profile.findUnique({
		where: { id: profileId },
		include: { incomes: { orderBy: { amount: "desc" } } },
	});
};

export const getTotalMonthlyIncomeService = async (
	profileId: string
): Promise<number> => {
	const profile = await prisma.profile.findUnique({
		where: { id: profileId },
		select: { totalMonthlyIncome: true },
	});
	return profile?.totalMonthlyIncome || 0;
};

export const getTotalMonthlyBudgetService = async (
	profileId: string
): Promise<number> => {
	const profile = await prisma.profile.findUnique({
		where: { id: profileId },
		select: { totalBudget: true },
	});
	return profile?.totalBudget || 0;
};
