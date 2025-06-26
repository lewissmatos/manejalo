"use server";

import { EmergencyFund } from "@/generated/prisma";
import {
	addAmountToEmergencyFundService,
	addEmergencyFundService,
	getEmergencyFundService,
	toggleEmergencyFundStatusService,
} from "@/lib/services/emergency-fund-services";
import { serviceResponseHandler } from "@/lib/services/utils/actions.utils";
import { getTranslations } from "next-intl/server";

export const getEmergencyFund = async (profileId: string) =>
	await serviceResponseHandler(
		async () => await getEmergencyFundService(profileId)
	);

export const addEmergencyFund = async (
	payload: Omit<EmergencyFund, "id" | "createdAt">
) =>
	await serviceResponseHandler(
		async () => await addEmergencyFundService(payload)
	);

export const toggleEmergencyFundStatus = async (
	emergencyFundId: string,
	newStatus: boolean
) =>
	await serviceResponseHandler(
		async () =>
			await toggleEmergencyFundStatusService(emergencyFundId, newStatus)
	);

export const addAmountToEmergencyFund = async (
	emergencyFundId: string,
	amount: number
) => {
	const t = await getTranslations(
		"OverviewPage.RegisterAmountEmergencyFundCard.messages"
	);
	return await serviceResponseHandler(
		async () => await addAmountToEmergencyFundService(emergencyFundId, amount),
		{
			successMessage: t("success"),
			errorMessage: t("error"),
		}
	);
};
