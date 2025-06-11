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
import { CircleMinus, PenIcon } from "lucide-react";
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
import { deleteMonthlyIncome } from "@/app/_server-actions/(monthly-incomes)/actions";
import { toast } from "sonner";
import { ButtonLoading } from "@/components/ui/button-loading";

type Props = {
	income: MonthlyIncome;
	refetchIncomes?: () => void;
};

const MonthlyIncomeCard = ({ income, refetchIncomes }: Props) => {
	const t = useTranslations("");
	const { description, amount, emoji, type } = income;

	return (
		<Card className="w-full md:w-80 p-2 max-w-sm h-36 gap-2 justify-between">
			<CardHeader className="p-0 flex flex-row gap-2 items-center ">
				<div className="size-8">
					{emoji ? (
						<Avatar className="size-8 rounded-full border-2 border-primary/50 flex items-center justify-center">
							<AvatarFallback className="text-lg">{emoji}</AvatarFallback>
						</Avatar>
					) : null}
				</div>
				<CardTitle className="line-clamp-2 max-w-72 text-primary font-semibold text-xl">
					{t(`IncomeTypes.${type.toLowerCase()}`)}
				</CardTitle>
			</CardHeader>
			<CardContent className="p-0 flex flex-row gap-2 items-center">
				<p className="line-clamp-2 max-w-80 ">{description}</p>
			</CardContent>
			<CardFooter className="flex flex-row gap-2 items-start p-0 justify-between">
				<Tooltip>
					<TooltipTrigger asChild>
						<span className="text-xl text-primary font-semibold max-w-52 truncate">
							{formatCurrency(amount)}
						</span>
					</TooltipTrigger>
					<TooltipContent side="left" className="bg-secondary text-primary">
						<span className="text-xl text-primary font-semibold max-w-64">
							{formatCurrency(amount)}
						</span>
					</TooltipContent>
				</Tooltip>
				<div className="">
					<ManageIncomeDialog
						dialogTrigger={
							<Button variant="ghost" size={"sm"}>
								<PenIcon />
							</Button>
						}
						defaultValues={income}
					/>
					<ConfirmDeleteDialog
						refetchIncomes={refetchIncomes}
						incomeId={income.id}
					/>
				</div>
			</CardFooter>
		</Card>
	);
};

const ConfirmDeleteDialog = ({
	incomeId,
	refetchIncomes,
}: {
	incomeId: string;
	refetchIncomes?: () => void;
}) => {
	const { onClose, isOpen, onOpenChange } = useDisclosure();
	const t = useTranslations("");

	const [isPending, startTransition] = useTransition();

	const onDelete = async (incomeId: string) => {
		startTransition(async () => {
			try {
				const res = await deleteMonthlyIncome(incomeId);
				if (!res.isSuccess) {
					throw new Error(res.message);
				}
				toast(res.message);
				await refetchIncomes?.();
			} catch (error) {
				toast.error(
					error instanceof Error
						? error.message
						: "An error occurred while deleting income"
				);
			}
		});
	};
	const handleDelete = async () => {
		await onDelete(incomeId);
		onClose();
	};

	return (
		<Dialog open={isOpen} onOpenChange={(isOpen) => onOpenChange(isOpen)}>
			<DialogTrigger asChild>
				<Button
					variant="ghost"
					size={"sm"}
					className="text-red-500 hover:bg-red-100"
				>
					<CircleMinus />
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{t("ProfilePage.DeleteIncomeDialog.title")}</DialogTitle>
					<DialogDescription>
						{t("ProfilePage.DeleteIncomeDialog.subtitle")}
					</DialogDescription>
				</DialogHeader>
				<DialogFooter>
					<ButtonLoading
						isLoading={isPending}
						variant="destructive"
						onClick={handleDelete}
					>
						{t("common.confirm")}
					</ButtonLoading>
					<Button variant="link" onClick={onClose}>
						{t("common.cancel")}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};
export default MonthlyIncomeCard;
