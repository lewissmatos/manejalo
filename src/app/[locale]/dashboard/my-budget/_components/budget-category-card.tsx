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
import { getTranslations } from "next-intl/server";
import { formatCurrency } from "@/lib/formatters";
import { CircleMinus, PenIcon } from "lucide-react";
import { Avatar, AvatarFallback } from "@radix-ui/react-avatar";
import { BudgetCategory } from "@/generated/prisma";
import { useTranslations } from "next-intl";
import { Tooltip, TooltipContent } from "@/components/ui/tooltip";
import { TooltipTrigger } from "@radix-ui/react-tooltip";
import ManageBudgetCategoryDialog from "./manage-budget-category-dialog";
import { useDisclosure } from "@/hooks/useDisclosure";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { ButtonLoading } from "@/components/ui/button-loading";
import { deleteBudgetCategory } from "@/app/_server-actions/(budget-categories)/actions";
import { toast } from "sonner";

type Props = {
	category: BudgetCategory;
	refetchBudgetCategories: () => void;
};
const BudgetItemCard = ({ category, refetchBudgetCategories }: Props) => {
	const t = useTranslations("MyBudget.RecommendedCategories.Card");
	const { description, estimation, emoji, name } = category;
	return (
		<Card className="w-full md:w-72 p-2 max-w-sm h-40 flex flex-col justify-between gap-1">
			<CardHeader className="p-0 flex flex-row gap-2 items-center ">
				{emoji ? (
					<div className="size-8">
						<Avatar className="size-8 rounded-full border-[2.5px] border-primary/50 flex items-center justify-center">
							<AvatarFallback className="text-lg">{emoji}</AvatarFallback>
						</Avatar>
					</div>
				) : null}
				<CardTitle className="line-clamp-2 max-w-72 text-primary font-semibold text-xl">
					{name}
				</CardTitle>
			</CardHeader>
			<CardContent className="p-0">
				<Tooltip>
					<TooltipTrigger asChild>
						<CardDescription className="line-clamp-3 max-w-72 ">
							{description || ""}
						</CardDescription>
					</TooltipTrigger>
					<TooltipContent
						side="top"
						className="bg-secondary text-primary max-w-52 max-h-44 overflow-y-auto"
					>
						<span className="text-sm">{description || t("noDescription")}</span>
					</TooltipContent>
				</Tooltip>
			</CardContent>
			<CardFooter className="flex flex-row gap-2 items-start p-0 mt-2 justify-between">
				<span className="text-xl text-primary font-semibold">
					{formatCurrency(estimation)}
				</span>

				<div className="flex flex-row items-center">
					<ManageBudgetCategoryDialog
						dialogTrigger={
							<Button variant="ghost" size={"sm"}>
								<PenIcon />
							</Button>
						}
						refetchBudgetCategories={refetchBudgetCategories}
						defaultValues={category}
					/>
					<ConfirmDeletionDialog
						categoryId={category.id}
						refetchBudgetCategories={refetchBudgetCategories}
					/>
				</div>
			</CardFooter>
		</Card>
	);
};

const ConfirmDeletionDialog = ({
	categoryId,
	refetchBudgetCategories,
}: {
	categoryId: string;
	refetchBudgetCategories: () => void;
}) => {
	const t = useTranslations();
	const { isOpen, onClose } = useDisclosure();
	const [isPending, startTransition] = useTransition();
	const onDelete = async () => {
		startTransition(async () => {
			try {
				const res = await deleteBudgetCategory(categoryId);
				if (!res.isSuccess) {
					throw new Error(res.message || t("common.error.defaultErrorMessage"));
				}

				toast(res.message || t("common.success.defaultSuccessMessage"));
				await refetchBudgetCategories();
				onClose();
			} catch (error) {
				console.error("Error deleting budget category:", error);
				toast.error(
					error instanceof Error
						? error.message
						: t("common.error.defaultErrorMessage")
				);
			}
		});
	};

	return (
		<Dialog onOpenChange={onClose}>
			<DialogTrigger asChild>
				<Button
					variant="ghost"
					size={"sm"}
					className="text-red-500 hover:bg-red-100"
				>
					<CircleMinus />
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[425px]" showCloseButton={false}>
				<DialogHeader>
					<DialogTitle>
						{t("MyBudgetsPage.BudgetCategoryCard.ConfirmDeletionDialog.title")}
					</DialogTitle>
					<DialogDescription>
						{t(
							"MyBudgetsPage.BudgetCategoryCard.ConfirmDeletionDialog.subtitle"
						)}
					</DialogDescription>
				</DialogHeader>
				<div className="grid gap-4 mt-2"></div>
				<DialogFooter className="mt-4">
					<ButtonLoading
						isLoading={isPending}
						type="submit"
						onClick={async () => {
							await onDelete();
							onClose();
						}}
						variant={"destructive"}
					>
						{t("common.confirm")}
					</ButtonLoading>
					<DialogClose asChild>
						<Button variant="link" onClick={onClose}>
							{t("common.cancel")}
						</Button>
					</DialogClose>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

export default BudgetItemCard;
