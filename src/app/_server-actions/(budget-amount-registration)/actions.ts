"use server";

import { getTranslations } from "next-intl/server";
import { BudgetAmountRegistration, BudgetAmountType } from "@/generated/prisma";
import { ResponseModel } from "../utils/actions.utils";
import { prisma } from "@/lib/prisma/prisma";
import { JsonObject } from "@/generated/prisma/runtime/library";
import { eachMonthOfInterval, format } from "date-fns";
type ResponseData = BudgetAmountRegistration | null;

export type BudgetCategoryExpense = {
	label: string;
	value: number;
	id: string;
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

export const getBudgetAmountRegistrationsGroupedByCategoryForPieChart = async ({
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
			by: ["budgetCategoryId"],
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
			orderBy: [{ budgetCategoryId: "asc" }],
		});

		const categories = await prisma.budgetCategory.findMany({
			where: { profileId },
			select: { name: true, id: true },
		});

		const finalData = res.map((item) => {
			const category = categories.find((x) => x.id === item.budgetCategoryId);
			return {
				value: item._sum.amount || 0,
				label: category?.name || "",
				id: category?.name || "",
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

export const getTotalBudgetAmountRegistrationPerYearForLineChart = async ({
	year,
	profileId,
}: {
	year: number;
	profileId: string;
}): Promise<
	ResponseModel<
		{
			id: string;
			data: Array<{ x: string; y: string }>;
		}[]
	>
> => {
	const t = await getTranslations("MyBudgetPage.messages");
	const startDate = new Date(year, 0, 1);
	const endDate = new Date(year, 11, 31);

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
			orderBy: [{ budgetCategoryId: "asc" }],
		});

		const categories = await prisma.budgetCategory.findMany({
			where: { profileId },
			select: { name: true, id: true },
		});

		const months = eachMonthOfInterval({
			start: startDate,
			end: endDate,
		}).map((date) => format(date, "MMM"));

		const groupedRes = res?.reduce(
			(acc, item) => {
				const categoryId = item.budgetCategoryId;
				const currObject = acc[categoryId];
				if (!currObject) {
					acc[categoryId] = {
						budgetCategoryId: categoryId,
						categoryName:
							categories.find((x) => x.id === categoryId)?.name || "",
						data: [
							{
								value: item._sum.amount || 0,
								registrationDate: item.registrationDate,
							},
						],
					};
				}
				acc[categoryId].data.push({
					value: item._sum.amount || 0,
					registrationDate: item.registrationDate,
				});
				return acc;
			},
			{} as Record<
				string,
				{
					budgetCategoryId: string;
					categoryName: string;
					data: Array<{ value: number; registrationDate: Date }>;
				}
			>
		);

		const finalData = Object.entries(groupedRes).map(([key, value]) => {
			return {
				id: value.categoryName,
				data: months.map((month) => {
					const monthData = value.data.find((d) =>
						format(d.registrationDate, "MMM").includes(month)
					);
					return {
						x: month.toUpperCase(),
						y: monthData ? monthData.value.toString() : "0",
					};
				}),
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
