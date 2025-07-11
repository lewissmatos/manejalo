"use client";

import React, { useTransition } from "react";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/formatters";
import { ArrowLeftRight, PenIcon } from "lucide-react";
import { MonthlyIncome } from "@/generated/prisma";
import { Avatar } from "@radix-ui/react-avatar";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import ManageIncomeDialog from "./manage-income-dialog";
import { useTranslations } from "next-intl";
import {
	deleteMonthlyIncome,
	setMonthlyIncomeStatus,
} from "@/app/_server-actions/(monthly-incomes)/actions";
import { ButtonLoading } from "@/components/ui/button-loading";
import ConfirmDeletionDialog from "@/components/common/confirm-deletion-dialog";
import { MAX_INCOMES } from "@/lib/constants/app-settings";
import feedbackService from "@/app/_components/utils/feedback-service";

type Props = {
	income: MonthlyIncome;
	refetchProfileData: () => void;
	incomesLength: number;
};

const MonthlyIncomeCard = ({
	income,
	refetchProfileData,
	incomesLength,
}: Props) => {
	const t = useTranslations("");
	const [isPending, startTransition] = useTransition();

	const { description, amount, emoji, type } = income;

	const onToggleStatus = async () => {
		startTransition(async () => {
			try {
				const res = await setMonthlyIncomeStatus(income.id, isDisabled);
				if (!res.isSuccess) {
					throw new Error(res.message);
				}
				feedbackService().send({
					type: "success",
					message: res.message,
				});

				await refetchProfileData();
			} catch (error) {
				feedbackService().send({
					type: "error",
					message:
						error instanceof Error
							? error.message
							: t("common.error.defaultErrorMessage"),
				});
			}
		});
	};

	const isDisabled = !income?.isActive;

	return (
		<Card
			className={`w-full md:w-80 p-2 max-w-sm h-36 gap-2 justify-between ${
				isDisabled ? "opacity-50" : ""
			}`}
		>
			<CardHeader className="p-0 flex flex-row gap-2 items-center ">
				{emoji ? (
					<div className="size-8 ">
						<Avatar className="size-8 rounded-full border-2 border-primary/50 flex items-center justify-center">
							{emoji}
						</Avatar>
					</div>
				) : null}
				<CardTitle className="line-clamp-2 max-w-72 text-primary font-semibold text-xl">
					{t(`IncomeTypes.${type.toLowerCase()}`)}
				</CardTitle>
			</CardHeader>
			<CardContent className="p-0 flex flex-row gap-2 items-center">
				<CardDescription className="line-clamp-2 text-md max-w-72 ">
					{description || ""}
					{isDisabled ? (
						<span className="text-destructive">
							({` ${t("common.disabled")}`})
						</span>
					) : (
						""
					)}
				</CardDescription>
			</CardContent>
			<CardFooter className="flex flex-row gap-2 items-start p-0 justify-between">
				<Tooltip>
					<TooltipTrigger asChild>
						<span className="text-xl text-primary font-semibold max-w-44 truncate">
							{formatCurrency(amount)}
						</span>
					</TooltipTrigger>
					<TooltipContent side="left" className="bg-secondary text-primary">
						<span className="text-xl text-primary font-semibold max-w-64">
							{formatCurrency(amount)}
						</span>
					</TooltipContent>
				</Tooltip>
				<div className="flex flex-row items-center">
					{!isDisabled && (
						<ManageIncomeDialog
							dialogTrigger={
								<Button variant="ghost" size={"sm"}>
									<PenIcon />
								</Button>
							}
							defaultValues={income}
							incomesLength={incomesLength}
							refetchProfileData={refetchProfileData}
							maxMonthlyIncomes={MAX_INCOMES}
							key={income.id}
						/>
					)}
					<ButtonLoading
						variant="ghost"
						size={"sm"}
						onClick={onToggleStatus}
						isLoading={isPending}
					>
						<ArrowLeftRight
							className={
								income.isActive ? "text-green-500" : "text-destructive"
							}
						/>
					</ButtonLoading>
					<ConfirmDeletionDialog
						itemId={income.id}
						refetchCallback={refetchProfileData}
						confirmationCallback={deleteMonthlyIncome}
					/>
				</div>
			</CardFooter>
		</Card>
	);
};

export default MonthlyIncomeCard;
