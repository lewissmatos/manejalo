import {
	BudgetAmountRegistration,
	BudgetAmountType,
	BudgetCategory,
} from "@/generated/prisma";
import { ResponseModel } from "./utils/actions.utils";
import { prisma } from "@/lib/prisma/prisma";
import { JsonObject } from "@/generated/prisma/runtime/library";
import { BudgetCategoryExpense } from "@/app/_server-actions/(budget-amount-registrations)/actions";
import { format } from "date-fns/format";
import { eachMonthOfInterval } from "date-fns";

const addBudgetAmountRegistrationService = async (
	payload: Omit<BudgetAmountRegistration, "id" | "createdAt">
): Promise<BudgetAmountRegistration> => {
	const res = await prisma.budgetAmountRegistration.create({
		data: {
			amount:
				payload.type === BudgetAmountType.EXPENSE
					? -payload?.amount
					: payload?.amount,
			correspondingDate: new Date(payload.correspondingDate),
			details: payload?.details || "",
			type: payload?.type || BudgetAmountType.EXPENSE,
			budgetCategoryId: payload?.budgetCategoryId,
			budgetCategoryReference: payload?.budgetCategoryReference as JsonObject,
		},
	});
	if (!res) throw new Error("createErrorMessage");

	return res;
};

const getBudgetAmountRegistrationsService = async ({
	profileId,
	page,
	limit,
}: {
	profileId: string | null;
	page: number;
	limit: number;
}): Promise<{
	registrations: Array<
		BudgetAmountRegistration & {
			budgetCategory: BudgetCategory;
		}
	>;
	totalCount: number;
	totalPages: number;
	limit: number;
	page: number;
}> => {
	if (!profileId) {
		throw new Error("Profile ID is required");
	}
	const [res, totalCount] = await Promise.all([
		prisma.budgetAmountRegistration.findMany({
			where: { budgetCategory: { profileId } },
			include: { budgetCategory: true },
			orderBy: [{ createdAt: "desc" }],
			skip: (page - 1) * limit,
			take: limit,
		}),
		prisma.budgetAmountRegistration.count({
			where: { budgetCategory: { profileId } },
		}),
	]);
	const totalPages = Math.ceil(totalCount / limit);

	return {
		registrations: res,
		totalCount,
		totalPages,
		limit,
		page,
	};
};

export type HistoryItem = BudgetAmountRegistration & {
	budgetCategory: Pick<BudgetCategory, "id" | "name">;
};
const getBudgetAmountRegistrationHistoryService = async (
	profileId: string | null
): Promise<HistoryItem[]> => {
	if (!profileId) {
		throw new Error("Profile ID is required");
	}
	const res = await prisma.budgetAmountRegistration.findMany({
		where: { budgetCategory: { profileId } },
		include: { budgetCategory: { select: { id: true, name: true } } },
		orderBy: [{ createdAt: "desc" }],
		take: 20,
	});

	return res;
};

const getBudgetAmountRegistrationsGroupedByCategoryForPieChartService = async ({
	profileId,
	startDate,
	endDate,
}: {
	profileId: string;
	startDate: Date;
	endDate: Date;
}): Promise<BudgetCategoryExpense[]> => {
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

	return finalData;
};

const getTotalBudgetAmountRegistrationByDateRangeService = async ({
	profileId,
	startDate,
	endDate,
}: {
	profileId: string;
	startDate: Date;
	endDate: Date;
}): Promise<number> => {
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
	return res._sum.amount || 0;
};

const getTotalBudgetAmountRegistrationPerYearForLineChartService = async ({
	year,
	profileId,
}: {
	year: number;
	profileId: string;
}): Promise<
	{
		id: string;
		data: Array<{ x: string; y: string }>;
	}[]
> => {
	const startDate = new Date(year, 0, 1);
	const endDate = new Date(year, 11, 31);

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
					categoryName: categories.find((x) => x.id === categoryId)?.name || "",
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

	return finalData;
};

const getTotalExpensesOverTimeService = async ({
	profileId,
	year,
}: {
	profileId: string;
	year: number;
}): Promise<{
	[BudgetAmountType.EXPENSE]: number;
	[BudgetAmountType.RECOVERY]: number;
	total: number;
}> => {
	const startDate = new Date(year, 0, 1);
	const endDate = new Date(year, 11, 31);
	const expensesTotal = await prisma.budgetAmountRegistration.aggregate({
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
		[BudgetAmountType.EXPENSE]: expensesTotal._sum.amount || 0,
		[BudgetAmountType.RECOVERY]: recoveryTotal._sum.amount || 0,
		total: (expensesTotal._sum.amount || 0) + (recoveryTotal._sum.amount || 0),
	};
};

const getHighestExpendingMonthsForBarChartService = async ({
	profileId,
}: {
	profileId: string;
}): Promise<
	{
		date: string;
		value: number;
	}[]
> => {
	const res = await prisma.budgetAmountRegistration.findMany({
		where: {
			budgetCategory: {
				profileId: profileId,
			},
		},
		select: {
			amount: true,
			correspondingDate: true,
		},
	});

	const monthMap = new Map<string, number>();

	res.forEach((item) => {
		const key = format(item.correspondingDate, "MMM yyyy").toUpperCase();
		const prev = monthMap.get(key) || 0;
		monthMap.set(key, prev + (item.amount || 0));
	});

	const finalData = Array.from(monthMap.entries())
		.map(([date, value]) => ({
			date,
			value: value * -1,
		}))
		.sort((a, b) => b.value - a.value)
		.slice(0, 5);

	return finalData;
};

const getTotalAmountRegistrationsForCalendarChartService = async ({
	profileId,
	year,
}: {
	profileId: string;
	year: number;
}): Promise<
	{
		day: `${number}-${number}-${number}`;
		value: number;
	}[]
> => {
	const startDate = new Date(year, 0, 1);
	const endDate = new Date(year, 11, 31);
	const res = await prisma.budgetAmountRegistration.groupBy({
		by: ["correspondingDate"],
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
		orderBy: [{ correspondingDate: "asc" }],
	});

	const finalData = res.map((item) => ({
		day: format(
			item.correspondingDate,
			"yyyy-MM-dd"
		) as `${number}-${number}-${number}`,
		value: (item._sum.amount || 0) * -1,
	}));

	return finalData;
};

export {
	addBudgetAmountRegistrationService,
	getBudgetAmountRegistrationHistoryService,
	getBudgetAmountRegistrationsService,
	getBudgetAmountRegistrationsGroupedByCategoryForPieChartService,
	getTotalBudgetAmountRegistrationByDateRangeService,
	getTotalBudgetAmountRegistrationPerYearForLineChartService,
	getTotalExpensesOverTimeService,
	getHighestExpendingMonthsForBarChartService,
	getTotalAmountRegistrationsForCalendarChartService,
};
