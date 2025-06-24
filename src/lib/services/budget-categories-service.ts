import { BudgetCategory } from "@/generated/prisma";
import { prisma } from "../prisma/prisma";

export const getBudgetCategoriesService = async (
	profileId: string
): Promise<{
	budgetCategories: BudgetCategory[];
	totalBudget: number;
}> => {
	const res = await prisma.budgetCategory.findMany({
		where: { profileId },
		orderBy: [
			{ isFavorite: "desc" },
			{ estimation: "desc" },
			{ createdAt: "desc" },
		],
	});

	const profileData = await prisma.profile.findUnique({
		select: { totalBudget: true },
		where: { id: profileId },
	});

	return {
		budgetCategories: res,
		totalBudget: profileData?.totalBudget || 0,
	};
};

export const addBudgetCategoryService = async (
	payload: Omit<BudgetCategory, "id" | "createdAt">
): Promise<BudgetCategory | null> => {
	return await prisma.budgetCategory.create({
		data: {
			emoji: payload?.emoji,
			estimation: payload.estimation,
			name: payload.name,
			description: payload.description,
			profileId: payload.profileId,
			isFavorite: payload?.isFavorite || false,
			isActive: payload?.isActive || true,
		},
	});
};

export const updateBudgetCategoryService = async (
	incomeId: string,
	payload: Partial<BudgetCategory>
): Promise<BudgetCategory | null> => {
	return await prisma.budgetCategory.update({
		where: { id: incomeId },
		data: {
			emoji: payload?.emoji,
			estimation: payload.estimation,
			name: payload.name,
			description: payload.description,
		},
	});
};

export const deleteBudgetCategoryService = async (
	incomeId: string
): Promise<null> => {
	await prisma.budgetCategory.delete({
		where: { id: incomeId },
	});

	return null;
};

export const markBudgetCategoryAsFavoriteService = async (
	categoryId: string,
	isFavorite: boolean
): Promise<BudgetCategory | null> => {
	return await prisma.budgetCategory.update({
		where: { id: categoryId },
		data: { isFavorite },
	});
};

export const setBudgetCategoryStatusService = async (
	categoryId: string,
	newStatus: boolean
): Promise<BudgetCategory | null> => {
	return await prisma.budgetCategory.update({
		where: { id: categoryId },
		data: { isActive: newStatus },
	});
};
