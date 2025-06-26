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
import { ArrowLeftRight, PenIcon, Star } from "lucide-react";
import { Avatar } from "@radix-ui/react-avatar";
import { BudgetCategory } from "@/generated/prisma";
import { useTranslations } from "next-intl";
import { Tooltip, TooltipContent } from "@/components/ui/tooltip";
import { TooltipTrigger } from "@radix-ui/react-tooltip";
import ManageBudgetCategoryDialog from "./manage-budget-category-dialog";
import { ButtonLoading } from "@/components/ui/button-loading";
import {
	deleteBudgetCategory,
	markBudgetCategoryAsFavorite,
	setBudgetCategoryStatus,
} from "@/app/_server-actions/(budget-categories)/actions";
import ConfirmDeletionDialog from "@/components/common/confirm-deletion-dialog";
import { MAX_BUDGET_CATEGORIES } from "@/lib/constants/app-settings";
import feedbackService from "@/app/_components/utils/feedback-service";

type Props = {
	category: BudgetCategory;
	refetchBudgetCategories: () => void;
	budgetCategoriesLength: number;
};

const BudgetCategoryCard = ({
	category,
	refetchBudgetCategories,
	budgetCategoriesLength,
}: Props) => {
	const t = useTranslations("MyBudgetPage.RecommendedCategories.Card");
	const { description, estimation, emoji, name } = category;

	const [isMarkAsFavPending, startMarkAsFavTransition] = useTransition();
	const [isToggleStatusPending, startToggleStatusTransition] = useTransition();
	const onMarkAsFavorite = async () => {
		startMarkAsFavTransition(async () => {
			try {
				const res = await markBudgetCategoryAsFavorite(
					category.id,
					!category.isFavorite
				);

				if (!res.isSuccess) {
					feedbackService().send({
						type: "error",
						message: res.message || t("common.error.defaultErrorMessage"),
					});
					return;
				}

				await refetchBudgetCategories();
			} catch (error) {
				console.error("Error marking budget category as favorite:", error);
				feedbackService().send({
					type: "error",
					message:
						error instanceof Error
							? error.message
							: t("error.defaultErrorMessage"),
				});
			}
		});
	};

	const onToggleStatus = async () => {
		startToggleStatusTransition(async () => {
			try {
				const res = await setBudgetCategoryStatus(
					category.id,
					!category.isActive
				);

				if (!res.isSuccess) {
					feedbackService().send({
						type: "error",
						message: res.message || t("common.error.defaultErrorMessage"),
					});
					return;
				}

				await refetchBudgetCategories();
			} catch (error) {
				console.error("Error toggling budget category status:", error);
				feedbackService().send({
					type: "error",
					message:
						error instanceof Error
							? error.message
							: t("error.defaultErrorMessage"),
				});
			}
		});
	};
	const isDisabled = !category?.isActive;
	return (
		<Card
			className={`w-full md:w-80 p-2 max-w-sm h-44 flex-col justify-between gap-1 ${
				isDisabled ? "opacity-50 select-none" : ""
			}`}
		>
			<CardHeader className="p-0 flex flex-row gap-2 items-start justify-between">
				<div className="flex flex-row items-center gap-2 flex-1">
					{emoji ? (
						<div className="size-8 ">
							<Avatar className="size-8 rounded-full border-2 border-primary/50 flex items-center justify-center">
								{emoji}
							</Avatar>
						</div>
					) : null}
					<Tooltip>
						<TooltipTrigger asChild>
							<CardTitle className="line-clamp-2 w-full max-w-56 text-start text-primary font-semibold text-lg">
								{name}
							</CardTitle>
						</TooltipTrigger>
						<TooltipContent
							side="top"
							className="bg-secondary text-primary max-w-56 max-h-44 overflow-y-auto"
						>
							<span className="text-sm">{name}</span>
						</TooltipContent>
					</Tooltip>
				</div>
				{!isDisabled ? (
					<ButtonLoading
						isLoading={isMarkAsFavPending}
						size="icon"
						variant={"ghost"}
						onClick={onMarkAsFavorite}
					>
						<Star
							className={
								category.isFavorite
									? "fill-primary text-primary"
									: "text-primary"
							}
						/>
					</ButtonLoading>
				) : null}
			</CardHeader>
			<CardContent className="p-0">
				<Tooltip>
					<TooltipTrigger asChild>
						<CardDescription className="line-clamp-3 text-md max-w-72 ">
							{description || ""}
						</CardDescription>
					</TooltipTrigger>
					<TooltipContent
						side="top"
						className="bg-secondary text-primary max-w-52 max-h-44 overflow-y-auto"
					>
						<span className="text-sm">{description}</span>
					</TooltipContent>
				</Tooltip>
			</CardContent>
			<CardFooter className="flex flex-row gap-2 items-start p-0 mt-2 justify-between">
				<Tooltip>
					<TooltipTrigger asChild>
						<span className="text-xl text-primary font-semibold max-w-44 truncate">
							{formatCurrency(estimation)}
						</span>
					</TooltipTrigger>
					<TooltipContent side="left" className="bg-secondary text-primary">
						<span className="text-xl text-primary font-semibold max-w-64">
							{formatCurrency(estimation)}
						</span>
					</TooltipContent>
				</Tooltip>
				<div className="flex flex-row items-center">
					{!isDisabled ? (
						<ManageBudgetCategoryDialog
							dialogTrigger={
								<Button variant="ghost" size={"sm"}>
									<PenIcon />
								</Button>
							}
							categoriesLength={budgetCategoriesLength}
							maxBudgetCategories={MAX_BUDGET_CATEGORIES}
							refetchBudgetCategories={refetchBudgetCategories}
							defaultValues={category}
							key={category.id}
						/>
					) : null}
					<ButtonLoading
						variant="ghost"
						size={"sm"}
						onClick={onToggleStatus}
						isLoading={isToggleStatusPending}
					>
						<ArrowLeftRight
							className={
								category.isActive ? "text-green-500" : "text-destructive"
							}
						/>
					</ButtonLoading>
					<ConfirmDeletionDialog
						itemId={category.id}
						refetchCallback={refetchBudgetCategories}
						confirmationCallback={deleteBudgetCategory}
					/>
				</div>
			</CardFooter>
		</Card>
	);
};

export default BudgetCategoryCard;
