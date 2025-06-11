"use client";

import React, { useTransition } from "react";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/formatters";
import {
	ArrowLeftRight,
	CircleAlert,
	CircleCheck,
	CircleMinus,
	PenIcon,
} from "lucide-react";
import { MonthlyIncome } from "@/generated/prisma";
import { Avatar, AvatarFallback } from "@radix-ui/react-avatar";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import ManageIncomeDialog from "./manage-income-dialog";
import { useTranslations } from "next-intl";
import { useDisclosure } from "@/hooks/useDisclosure";
import { setMonthlyIncomeStatus } from "@/app/_server-actions/(monthly-incomes)/actions";
import { toast } from "sonner";
import { ButtonLoading } from "@/components/ui/button-loading";

type Props = {
	income: MonthlyIncome;
	refetchProfileData: () => void;
};

const MonthlyIncomeCard = ({ income, refetchProfileData }: Props) => {
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
				toast(res.message);
				console.log(res.message);
				await refetchProfileData();
			} catch (error) {
				toast.error(
					error instanceof Error
						? error.message
						: "An error occurred while deleting income"
				);
			}
		});
	};

	const isDisabled = !income?.isActive;

	return (
		<Card
			className={`w-full md:w-80 p-2 max-w-sm h-36 gap-2 justify-between ${
				isDisabled ? "opacity-50 " : ""
			}`}
		>
			<CardHeader className="p-0 flex flex-row gap-2 items-center ">
				{emoji ? (
					<div className="size-8">
						{isDisabled ? (
							<CircleMinus className="text-red-500" size={32} />
						) : (
							<Avatar className="size-8 rounded-full border-[2.5px] border-primary/50 flex items-center justify-center">
								<AvatarFallback className="text-lg">{emoji}</AvatarFallback>
							</Avatar>
						)}
					</div>
				) : null}
				<CardTitle className="line-clamp-2 max-w-72 text-primary font-semibold text-xl">
					{t(`IncomeTypes.${type.toLowerCase()}`)}
				</CardTitle>
			</CardHeader>
			<CardContent className="p-0 flex flex-row gap-2 items-center">
				<p className="line-clamp-2 max-w-80 ">
					{description}{" "}
					{isDisabled ? (
						<span className="text-red-500">({t("common.disabled")})</span>
					) : (
						""
					)}
				</p>
			</CardContent>
			<CardFooter className="flex flex-row gap-2 items-start p-0 justify-between">
				<Tooltip>
					<TooltipTrigger asChild>
						<span className="text-xl text-primary font-semibold max-w-48 truncate">
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
					<ManageIncomeDialog
						dialogTrigger={
							<Button variant="ghost" size={"sm"}>
								<PenIcon />
							</Button>
						}
						refetchProfileData={refetchProfileData}
						defaultValues={income}
					/>
					<ButtonLoading
						variant="ghost"
						size={"sm"}
						onClick={onToggleStatus}
						isLoading={isPending}
					>
						<ArrowLeftRight
							className={income.isActive ? "text-green-500" : "text-red-500"}
						/>
					</ButtonLoading>
				</div>
			</CardFooter>
		</Card>
	);
};

export default MonthlyIncomeCard;
