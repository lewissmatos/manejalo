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
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { formatCurrency } from "@/lib/formatters";
import { BudgetAmountType, BudgetCategory } from "@/generated/prisma";
import { Input } from "@/components/ui/input";
import { Save } from "lucide-react";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useTranslations } from "next-intl";
import { ButtonLoading } from "@/components/ui/button-loading";
import { addBudgetAmountRegistration } from "@/app/_server-actions/(budget-amount-registrations)/actions";
import { selectedDateAtom } from "@/lib/jotai/app-filters-atoms";
import { useAtomValue } from "jotai/react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import feedbackService from "@/app/_components/utils/feedback-service";

type Props = {
	category: BudgetCategory;
	refetchData: () => void;
};
const RegisterAmountToCategoryCard = ({ category, refetchData }: Props) => {
	const t = useTranslations();
	const currentSelectedDate = useAtomValue(selectedDateAtom);

	const { emoji, description, name, estimation } = category;
	const [isPending, startTransition] = useTransition();
	const [amountData, setAmountData] = React.useState<{
		amount: number | string;
		type: BudgetAmountType;
		details: string;
	}>({
		amount: "",
		type: BudgetAmountType.EXPENSE,
		details: "",
	});

	const handleUpdateAmountData = (
		field: keyof typeof amountData,
		value: any
	) => {
		setAmountData((prev) => ({
			...prev,
			[field]: value,
		}));
	};

	const onRegisterAmount = async () => {
		startTransition(async () => {
			try {
				const res = await addBudgetAmountRegistration({
					...amountData,
					amount: Number(amountData.amount) || 0,
					budgetCategoryId: category.id,
					correspondingDate: currentSelectedDate || new Date(),
					budgetCategoryReference: {
						name: category.name,
						estimation: category.estimation,
					},
				});

				if (!res.isSuccess)
					throw new Error(res.message || "Failed to register amount");

				feedbackService().send({
					type: "success",
					message: res.message,
				});

				setAmountData({
					amount: "",
					type: BudgetAmountType.EXPENSE,
					details: "",
				});
				await refetchData();
			} catch (error) {
				console.error("Error registering amount:", error);
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

	const isSaveDisabled =
		!amountData.amount || Number(amountData.amount) <= 0 || !amountData.type;
	return (
		<Card className="w-full md:w-80 p-2 max-w-sm h-64 gap-1 justify-between">
			<CardHeader className="p-0 flex flex-row gap-2 items-center">
				{emoji ? (
					<div className="size-8">
						<Avatar className="size-8 rounded-full border-2 border-primary/50 flex items-center justify-center">
							<AvatarFallback className="text-lg">{emoji}</AvatarFallback>
						</Avatar>
					</div>
				) : null}
				<Tooltip>
					<TooltipTrigger asChild>
						<CardTitle className="line-clamp-2 w-full max-w-52 text-start text-primary font-semibold text-lg">
							{name}
						</CardTitle>
					</TooltipTrigger>
					<TooltipContent
						side="top"
						className="bg-secondary text-primary max-w-52 max-h-44 overflow-y-auto"
					>
						<span className="text-sm">{name}</span>
					</TooltipContent>
				</Tooltip>
			</CardHeader>
			<CardContent className="p-0 flex flex-col gap-2 items-start">
				<CardDescription className="line-clamp-2 text-md max-w-72 ">
					{description || ""}
				</CardDescription>
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
			</CardContent>
			<CardFooter className="flex flex-col gap-2 items-start p-0 justify-between">
				<span className="text-sm text-primary">
					{t("OverviewPage.RegisterAmountToCategoryCard.registerAValue")}
				</span>
				<div className="flex flex-row items-center justify-end gap-2 w-full">
					<Input
						type="number"
						placeholder="0.00"
						className="text-primary w-1/2"
						onChange={(e) => {
							const value = parseFloat(e.target.value);
							if (!isNaN(value)) {
								handleUpdateAmountData("amount", value);
							} else {
								handleUpdateAmountData("amount", 0);
							}
						}}
						step="1"
						min={0}
						value={amountData.amount}
					/>
					<Select
						defaultValue={BudgetAmountType.EXPENSE}
						onValueChange={(value) => {
							handleUpdateAmountData("type", value as BudgetAmountType);
						}}
						value={amountData.type}
					>
						<SelectTrigger className="min-w-1/2 bg-background text-foreground">
							<SelectValue placeholder={t("common.type")} />
						</SelectTrigger>
						<SelectContent>
							{Object.values(BudgetAmountType).map((val) => (
								<SelectItem key={val} value={val}>
									{`${t(
										`OverviewPage.budgetAmountTypes.${val.toLocaleLowerCase()}`
									)}`}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
				<div className="flex flex-row items-center justify-between gap-2 w-full">
					<Input
						id="description"
						placeholder={t("common.details")}
						maxLength={50}
						className="text-primary"
						value={amountData.details}
						onChange={(e) => {
							handleUpdateAmountData("details", e.target.value);
						}}
					/>
					<ButtonLoading
						isLoading={isPending}
						disabled={isSaveDisabled}
						className="w-12"
						variant={"outline"}
						onClick={onRegisterAmount}
					>
						<Save className="text-primary" />
					</ButtonLoading>
				</div>
			</CardFooter>
		</Card>
	);
};

export default RegisterAmountToCategoryCard;
