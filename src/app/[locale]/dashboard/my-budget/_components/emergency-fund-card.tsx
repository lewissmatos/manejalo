"use client";

import React, { useTransition } from "react";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { useTranslations } from "next-intl";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { formatCurrency } from "@/lib/formatters";
import { useAtomValue } from "jotai/react";
import { updateProfileDataAtom } from "@/lib/jotai/auth-atom";
import { Heart, InfoIcon } from "lucide-react";
import { EmergencyFund } from "@/generated/prisma";
import { Button } from "@/components/ui/button";
import { ButtonLoading } from "@/components/ui/button-loading";
import { toggleEmergencyFundStatus } from "@/app/_server-actions/(emergency-fund)/actions";
import feedbackService from "@/app/_components/utils/feedback-service";
import { Avatar } from "@/components/ui/avatar";
import AddEmergencyFundDialog from "./add-emergency-fund-dialog";

type Props = {
	refetch: () => void;
	data?: EmergencyFund | null;
};
const EmergencyFundCard = ({ refetch, data }: Props) => {
	const t = useTranslations();
	const profileData = useAtomValue(updateProfileDataAtom);
	const defaultEstimation = (profileData?.totalMonthlyIncome || 0) * 3;

	const isAlreadyAdded = Boolean(data);
	const [isPending, startTransition] = useTransition();

	const onToggleStatus = async () => {
		if (!data?.id) return;
		startTransition(async () => {
			try {
				const res = await toggleEmergencyFundStatus(data?.id, !data?.isActive);

				if (!res.isSuccess) {
					feedbackService().send({
						type: "error",
						message: t("ui.errorMessage"),
					});
				}

				await refetch();
			} catch (error) {
				feedbackService().send({
					type: "error",
					message:
						error instanceof Error ? error.message : t("ui.errorMessage"),
				});
			}
		});
	};
	return (
		<Card
			className={`w-80 p-2 h-40 items-start justify-center gap-2 ${
				!data?.isActive ? "opacity-50 select-none" : ""
			}`}
		>
			<CardHeader className="p-0 flex flex-row gap-2 items-start justify-start w-full">
				<div className="flex flex-row items-center justify-start gap-2 w-full">
					<CardTitle className="line-clamp-2 w-full flex gap-2 items-center text-start text-primary font-semibold text-lg">
						<div className="size-8 ">
							<Avatar className="size-8 rounded-full border-2 border-primary/50 flex items-center justify-center">
								🚨
							</Avatar>
						</div>
						{t("MyBudgetPage.AddEmergencyFundDialog.trigger.title")}
						{!isAlreadyAdded && <InfoIcon size={18} />}
					</CardTitle>

					{isAlreadyAdded && (
						<Heart
							size={18}
							className={`mr-2 mt-1 ${
								data?.isActive ? "fill-primary text-primary" : "text-primary"
							}`}
						/>
					)}
				</div>
			</CardHeader>
			<CardContent className="flex items-start justify-between gap-2 flex-col p-0  h-full">
				<span className={`text-sm text-start text-muted-foreground`}>
					{t("MyBudgetPage.AddEmergencyFundDialog.trigger.info", {
						value: ` (${formatCurrency(
							profileData?.totalMonthlyIncome,
							"DOP",
							true
						)})`,
					})}
					.
				</span>
			</CardContent>
			<CardFooter className="flex flex-row gap-2 items-center  p-0 justify-between w-full">
				<Tooltip>
					<TooltipTrigger asChild>
						<span className="text-xl text-primary font-semibold max-w-64">
							{formatCurrency(defaultEstimation)}
						</span>
					</TooltipTrigger>
					<TooltipContent side="left" className="bg-secondary text-primary">
						<span className="text-xl text-primary font-semibold max-w-64">
							{formatCurrency(defaultEstimation)}
						</span>
					</TooltipContent>
				</Tooltip>
				{isAlreadyAdded ? (
					<ButtonLoading
						variant={"ghost"}
						color="primary"
						isLoading={isPending}
						className="text-destructive hover:text-destructive"
						onClick={onToggleStatus}
					>
						{data?.isActive ? t("common.disable") : t("common.enable")}
					</ButtonLoading>
				) : (
					<AddEmergencyFundDialog
						estimation={defaultEstimation}
						profileId={profileData?.id!}
						refetch={refetch}
					/>
				)}
			</CardFooter>
		</Card>
	);
};

export default EmergencyFundCard;
