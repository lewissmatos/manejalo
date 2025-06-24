"use server";

import {
	ResponseModel,
	serviceResponseHandler,
} from "../../../lib/services/utils/actions.utils";
import { prisma } from "@/lib/prisma/prisma";
import { ProfileWithIncomes } from "@/lib/jotai/auth-atom";
type ResponseData = ProfileWithIncomes | null;

export const getProfileData = async (
	profileId: string
): Promise<ResponseModel<ResponseData>> => {
	const fn = async () => {
		return await prisma.profile.findUnique({
			where: { id: profileId },
			include: {
				incomes: {
					orderBy: { amount: "desc" },
				},
			},
		});
	};

	return await serviceResponseHandler<ResponseData>(fn);
};

export const getTotalMonthlyIncome = async (
	profileId: string
): Promise<ResponseModel<number>> => {
	const fn = async () => {
		const profile = await prisma.profile.findUnique({
			where: { id: profileId },
			select: { totalMonthlyIncome: true },
		});
		return profile?.totalMonthlyIncome || 0;
	};

	return await serviceResponseHandler<number>(fn);
};

export const getTotalMonthlyBudget = async (
	profileId: string
): Promise<ResponseModel<number>> => {
	const fn = async () => {
		const profile = await prisma.profile.findUnique({
			where: { id: profileId },
			select: { totalBudget: true },
		});
		return profile?.totalBudget || 0;
	};

	return await serviceResponseHandler<number>(fn);
};
