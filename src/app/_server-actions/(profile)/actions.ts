"use server";

import {
	ResponseModel,
	serviceResponseHandler,
} from "../../../lib/services/utils/actions.utils";
import { ProfileWithIncomes } from "@/lib/jotai/auth-atom";
import {
	getProfileDataService,
	getTotalMonthlyBudgetService,
	getTotalMonthlyIncomeService,
} from "@/lib/services/profile-services";
type ResponseData = ProfileWithIncomes | null;

export const getProfileData = async (
	profileId: string
): Promise<ResponseModel<ResponseData>> =>
	await serviceResponseHandler<ResponseData>(
		async () => await getProfileDataService(profileId)
	);

export const getTotalMonthlyIncome = async (
	profileId: string
): Promise<ResponseModel<number>> =>
	await serviceResponseHandler<number>(
		async () => await getTotalMonthlyIncomeService(profileId)
	);

export const getTotalMonthlyBudget = async (
	profileId: string
): Promise<ResponseModel<number>> =>
	await serviceResponseHandler<number>(
		async () => await getTotalMonthlyBudgetService(profileId)
	);
