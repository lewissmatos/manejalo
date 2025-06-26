import { prisma } from "@/lib/prisma/prisma";
import { EmergencyFund } from "@/generated/prisma";

export const getEmergencyFundService = async (
	profileId: string
): Promise<EmergencyFund | null> =>
	await prisma.emergencyFund.findUnique({
		where: { profileId },
	});

export const addEmergencyFundService = async (
	payload: Omit<EmergencyFund, "id" | "createdAt">
): Promise<EmergencyFund | null> =>
	await prisma.emergencyFund.create({ data: payload });

export const toggleEmergencyFundStatusService = async (
	emergencyFundId: string,
	newStatus: boolean
): Promise<EmergencyFund | null> =>
	await prisma.emergencyFund.update({
		where: { id: emergencyFundId },
		data: {
			isActive: newStatus,
		},
	});

export const addAmountToEmergencyFundService = async (
	emergencyFundId: string,
	amount: number
): Promise<EmergencyFund | null> =>
	await prisma.emergencyFund.update({
		where: { id: emergencyFundId },
		data: { actualAmount: { increment: amount } },
	});
