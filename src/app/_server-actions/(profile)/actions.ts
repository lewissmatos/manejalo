"use server";

import { getTranslations } from "next-intl/server";
import { ResponseModel } from "../utils/actions.utils";
import { prisma } from "@/lib/prisma/prisma";
import { ProfileWithIncomes } from "@/lib/jotai/auth-atom";
type ResponseData = ProfileWithIncomes | null;

export const getProfileData = async (
	profileId: string
): Promise<ResponseModel<ResponseData>> => {
	const t = await getTranslations("ProfilePage");
	try {
		const res = await prisma.profile.findUnique({
			where: { id: profileId },
			include: {
				incomes: {
					orderBy: { amount: "desc" },
				},
			},
		});

		return {
			data: res,
			// TODO
			message: "",
			isSuccess: true,
		};
	} catch (error) {
		console.error(error);
		return {
			data: null,
			message: error instanceof Error ? error.message : "",
			isSuccess: false,
		};
	}
};

export const getTotalMonthlyBudget = async (
	profileId: string
): Promise<ResponseModel<number>> => {
	const t = await getTranslations("ProfilePage");
	try {
		const profile = await prisma.profile.findUnique({
			where: { id: profileId },
			select: { totalBudget: true },
		});

		return {
			data: profile?.totalBudget || 0,
			message: "",
			isSuccess: true,
		};
	} catch (error) {
		console.error(error);
		return {
			data: 0,
			message: error instanceof Error ? error.message : "",
			isSuccess: false,
		};
	}
};
