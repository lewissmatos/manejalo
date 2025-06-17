"use server";

import { getTranslations } from "next-intl/server";
import {
	BudgetAmountRegistration,
	BudgetAmountType,
	BudgetCategory,
} from "@/generated/prisma";
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
						? -payload?.amount
						: payload?.amount,
				correspondingDate: payload?.correspondingDate,
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

type HistoryItem = BudgetAmountRegistration & {
	budgetCategory: Pick<BudgetCategory, "id" | "name">;
};

export const getBudgetAmountRegistrationHistory = async (
	profileId: string
): Promise<ResponseModel<HistoryItem[]>> => {
	const t = await getTranslations("MyBudgetPage.messages");
	try {
		const res = await prisma.budgetAmountRegistration.findMany({
			where: { budgetCategory: { profileId: profileId } },
			include: { budgetCategory: { select: { id: true, name: true } } },
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

export const getBudgetAmountRegistrations = async ({
	profileId,
	page,
	limit,
}: {
	profileId: string;
	page: number;
	limit: number;
}): Promise<
	ResponseModel<{
		data: {
			registrations: Array<
				BudgetAmountRegistration & {
					budgetCategory: BudgetCategory;
				}
			>;
			totalCount: number;
			totalPages: number;
			limit: number;
			page: number;
		};
		totalAmount?: number;
	}>
> => {
	const t = await getTranslations("MyBudgetPage.messages");
	try {
		const [res, totalCount, sumResult] = await Promise.all([
			prisma.budgetAmountRegistration.findMany({
				where: { budgetCategory: { profileId: profileId } },
				include: { budgetCategory: true },
				orderBy: [{ createdAt: "desc" }],
				skip: (page - 1) * limit,
				take: limit,
			}),
			prisma.budgetAmountRegistration.count({
				where: { budgetCategory: { profileId: profileId } },
			}),
			prisma.budgetAmountRegistration.aggregate({
				where: { budgetCategory: { profileId: profileId } },
				_sum: { amount: true },
				skip: (page - 1) * limit,
				take: limit,
			}),
		]);
		const totalAmount = sumResult._sum.amount || 0;
		const totalPages = Math.ceil(totalCount / limit);
		return {
			data: {
				data: {
					registrations: res,
					totalCount,
					totalPages,
					limit,
					page,
				},
				totalAmount,
			},
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
			_sum: { amount: true },
			where: {
				budgetCategory: {
					profileId: profileId,
				},
				correspondingDate: {
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
				value: (item._sum.amount || 0) * -1,
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
				correspondingDate: {
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
			by: ["budgetCategoryId", "correspondingDate"],
			_sum: {
				amount: true,
			},
			where: {
				budgetCategory: {
					profileId: profileId,
				},
				correspondingDate: {
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
								correspondingDate: item.correspondingDate,
							},
						],
					};
				}
				acc[categoryId].data.push({
					value: item._sum.amount || 0,
					correspondingDate: item.correspondingDate,
				});
				return acc;
			},
			{} as Record<
				string,
				{
					budgetCategoryId: string;
					categoryName: string;
					data: Array<{ value: number; correspondingDate: Date }>;
				}
			>
		);

		const finalData = Object.entries(groupedRes).map(([key, value]) => {
			return {
				id: value.categoryName,
				data: months.map((month) => {
					const monthData = value.data.find((d) =>
						format(d.correspondingDate, "MMM").includes(month)
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

export const getTotalExpensesOverTime = async ({
	profileId,
}: {
	profileId: string;
}): Promise<
	ResponseModel<{
		[BudgetAmountType.EXPENSE]: number;
		[BudgetAmountType.RECOVERY]: number;
		total: number;
	}>
> => {
	const t = await getTranslations("MyBudgetPage.messages");
	try {
		const expensesTotal = await prisma.budgetAmountRegistration.aggregate({
			_sum: {
				amount: true,
			},
			where: {
				budgetCategory: {
					profileId: profileId,
				},
				type: BudgetAmountType.EXPENSE,
			},
		});
		const recoveryTotal = await prisma.budgetAmountRegistration.aggregate({
			_sum: {
				amount: true,
			},
			where: {
				budgetCategory: {
					profileId: profileId,
				},
				type: BudgetAmountType.RECOVERY,
			},
		});
		return {
			data: {
				[BudgetAmountType.EXPENSE]: expensesTotal._sum.amount || 0,
				[BudgetAmountType.RECOVERY]: recoveryTotal._sum.amount || 0,
				total:
					(expensesTotal._sum.amount || 0) + (recoveryTotal._sum.amount || 0),
			},
			message: "",
			isSuccess: true,
		};
	} catch (error) {
		console.error("Error fetching total expenses:", error);
		return {
			data: null,
			message: t("defaultErrorMessage"),
			isSuccess: false,
		};
	}
};

export const getHighestExpendingMonths = async ({
	profileId,
}: {
	profileId: string;
}): Promise<
	ResponseModel<
		{
			date: string;
			value: number;
		}[]
	>
> => {
	const t = await getTranslations("MyBudgetPage.messages");
	try {
		const res = await prisma.budgetAmountRegistration.groupBy({
			by: ["correspondingDate"],
			_sum: { amount: true },
			where: {
				budgetCategory: {
					profileId: profileId,
				},
			},
			orderBy: [{ _sum: { amount: "desc" } }],
			take: 5,
		});

		const finalData = res.map((item) => ({
			date: format(item.correspondingDate, "MMM yyyy").toUpperCase(),
			value: (item._sum.amount || 0) * -1,
		}));

		return {
			data: finalData,
			message: "",
			isSuccess: true,
		};
	} catch (error) {
		console.error("Error fetching highest expending months:", error);
		return {
			data: null,
			message: t("defaultErrorMessage"),
			isSuccess: false,
		};
	}
};
