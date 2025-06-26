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
import { formatCurrency } from "@/lib/formatters";
import { BudgetAmountType, EmergencyFund } from "@/generated/prisma";
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
import feedbackService from "@/app/_components/utils/feedback-service";
import CircularProgress from "@/components/ui/circular-progress";
import { addAmountToEmergencyFund } from "@/app/_server-actions/(emergency-fund)/actions";

type Props = {
	emergencyFund: EmergencyFund;
	refetchData: () => void;
};

const RegisterAmountEmergencyFundCard = ({
	emergencyFund,
	refetchData,
}: Props) => {
	const t = useTranslations();

	const { estimation, actualAmount, id } = emergencyFund;
	const [isPending, startTransition] = useTransition();
	const [amountData, setAmountData] = React.useState<{
		amount: number | string;
		type: "add" | "subtract";
	}>({
		amount: "",
		type: "add",
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
		if (isPending || isSaveDisabled) return;
		startTransition(async () => {
			try {
				const res = await addAmountToEmergencyFund(
					id,
					amountData.type === "add"
						? Number(amountData.amount)
						: Number(amountData.amount) * -1
				);

				if (!res.isSuccess)
					throw new Error(res.message || "Failed to register amount");

				feedbackService().send({
					type: "success",
					message: res.message,
				});

				setAmountData({
					amount: "",
					type: "add",
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

	const progress = (actualAmount / estimation) * 100;
	return (
		<Card className="w-full md:w-[41rem] flex flex-col md:flex-row p-2 h-fit md:h-54 gap-2 justify-between">
			<div className="flex flex-col gap-2">
				<CardHeader className="p-0 flex flex-row gap-2 items-start justify-start w-full">
					<div className="flex flex-row items-center justify-start gap-2 w-full">
						<CardTitle className="line-clamp-2 w-full flex gap-1 items-center text-start text-primary font-semibold text-2xl">
							<div className="size-8">🚨</div>
							{t("MyBudgetPage.AddEmergencyFundDialog.trigger.title")}
						</CardTitle>
					</div>
				</CardHeader>
				<CardContent className="flex items-start justify-between gap-2 flex-col p-0 h-full">
					<CardDescription className="line-clamp-4 text-md w-fit">
						{t("MyBudgetPage.AddEmergencyFundDialog.trigger.info", {
							value: ".",
						})}
					</CardDescription>
					<div className="flex flex-row items-center justify-between gap-2 w-full">
						<Select
							defaultValue={"Add"}
							onValueChange={(value) => {
								handleUpdateAmountData("type", value as BudgetAmountType);
							}}
							value={amountData.type}
						>
							<SelectTrigger className="min-w-1/2 bg-background text-foreground">
								<SelectValue placeholder={t("common.type")} />
							</SelectTrigger>
							<SelectContent>
								<SelectItem key={"add"} value={"add"}>
									{t("common.add")}
								</SelectItem>
								<SelectItem key={"subtract"} value={"subtract"}>
									{t("common.subtract")}
								</SelectItem>
							</SelectContent>
						</Select>
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
							onKeyUp={async (e) => {
								if (e.key === "Enter") {
									await onRegisterAmount();
								}
							}}
							value={amountData.amount}
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
				</CardContent>
			</div>
			<CardFooter className="flex flex-col gap-2 p-0 justify-between w-full md:w-60 items-center">
				<div className="flex flex-col justify-center w-fit">
					<span className="text-2xl text-primary font-semibold max-w-44 truncate">
						{formatCurrency(actualAmount)}
					</span>
					<span className="text-xl text-primary/75 font-semibold max-w-44 truncate">
						{`/${formatCurrency(estimation, "DOP", true)}`}
					</span>
				</div>
				<CircularProgress
					value={Math.min(progress, 100)}
					className="width-20 "
					labelClassName="text-md text-primary"
					circleStrokeWidth={10}
					progressStrokeWidth={14}
					size={140}
					showLabel
					renderLabel={() => `${Number(progress).toFixed(1)}%`}
				/>
			</CardFooter>
		</Card>
	);
};

export default RegisterAmountEmergencyFundCard;
