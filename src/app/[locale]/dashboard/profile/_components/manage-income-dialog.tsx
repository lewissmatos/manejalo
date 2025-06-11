"use client";
import React from "react";
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

import { useTranslations } from "next-intl";
import { useDisclosure } from "@/hooks/useDisclosure";
import { ButtonLoading } from "@/components/ui/button-loading";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PlusCircle } from "lucide-react";
import { SubmitHandler, useForm } from "react-hook-form";
import { IncomeType, MonthlyIncome } from "@/generated/prisma";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
	addMonthlyIncome,
	updateMonthlyIncome,
} from "@/app/_server-actions/(monthly-incomes)/actions";
import { useAtom } from "jotai/react";
import { updateProfileDataAtom } from "@/lib/jotai/auth-atom";
import { toast } from "sonner";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
const incomeEmojis = [
	"💸", // Other
	"👨‍💼", // Salary
	"🧑‍💻", // Freelance / Contract Work
	"💵", // Overtime Pay
	"💰", // Bonus
	"📊", // Stock Dividends
	"🏠", // Rental Income
	"🤖", // Crypto Gains
	"💳", // Interest
	"🧾", // Tax Refund
	"🧓", // Pension
	"🏥", // Social Security
	"🏪", // Business Profits
	"🧼", // Product Sales
	"📦", // Marketplace
	"🎁", // Cash Gift
	"🧧", // Family Allowance
	"💌", // Partner Transfer
	"🪙", // Piggy Bank
	"🎲", // Lottery Win
	"🕹️", // Gaming Income
	"📱", // App Payouts
];

type Props = {
	canAddMore?: boolean;
	dialogTrigger?: React.ReactNode;
	defaultValues?: Partial<MonthlyIncome>;
};

const ManageIncomeDialog = ({
	canAddMore = true,
	dialogTrigger,
	defaultValues,
}: Props) => {
	const t = useTranslations();

	const { isOpen, onClose, onOpenChange } = useDisclosure();

	const [profileData, setProfileData] = useAtom(updateProfileDataAtom);

	const {
		register,
		handleSubmit,
		reset,
		formState: { isValid, isSubmitting },
		setValue,
	} = useForm<Partial<MonthlyIncome>>({
		defaultValues: {
			type: IncomeType.EMPLOYMENT,
			emoji: incomeEmojis[0],
			...defaultValues,
		},
	});

	const isEditMode = !!defaultValues?.id;

	const onSubmit: SubmitHandler<Partial<MonthlyIncome>> = async (data) => {
		if (
			!profileData?.id ||
			!data.amount ||
			data.amount <= 0 ||
			!data.description
		) {
			throw new Error(t("ProfilePage.AddIncomeDialog.errors.profileNotFound"));
		}

		try {
			const res = !isEditMode
				? await addMonthlyIncome({
						amount: data.amount || 0,
						description: data.description || "",
						emoji: data?.emoji || incomeEmojis[0],
						type: data?.type || IncomeType.EMPLOYMENT,
						profileId: profileData?.id || "",
				  })
				: await updateMonthlyIncome(defaultValues?.id!, {
						amount: data.amount || 0,
						description: data.description || "",
						emoji: data?.emoji || incomeEmojis[0],
						type: data?.type || IncomeType.EMPLOYMENT,
						profileId: profileData?.id || "",
				  });

			if (!res.isSuccess) {
				throw new Error(
					res.message ||
						t("ProfilePage.AddIncomeDialog.messages.defaultErrorMessage")
				);
			}
			toast.success(
				res.message ||
					t("ProfilePage.AddIncomeDialog.messages.defaultSuccessMessage")
			);

			if (isEditMode) {
				// Update the existing income in the profile data
				setProfileData({
					incomes: profileData.incomes.map((income) =>
						income.id === defaultValues?.id
							? (res.data as MonthlyIncome)
							: income
					),
				});
			} else {
				// Add the new income to the profile data
				setProfileData({
					incomes: [...profileData.incomes, res.data as MonthlyIncome],
				});
			}

			reset();
			onClose();
		} catch (err) {
			console.error("Error adding monthly income:", err);
			toast.error(
				t(
					err instanceof Error
						? err.message
						: "An error occurred while adding income"
				)
			);
		}
	};

	const handleCloseDialog = () => {
		reset();
		onClose();
	};

	return (
		<Dialog
			open={isOpen && canAddMore}
			onOpenChange={(isOpen) => {
				onOpenChange(isOpen);
				if (!isOpen) {
					handleCloseDialog();
				}
			}}
		>
			<DialogTrigger asChild>
				{dialogTrigger || (
					<div className="flex flex-col items-start gap-1 justify-between w-full md:w-32 ">
						<Card
							className={`w-full md:w-32 p-0 max-w-sm h-36 items-center justify-center ${
								canAddMore
									? "cursor-pointer hover:bg-secondary/20"
									: "opacity-40 cursor-not-allowed select-none"
							}  transition-all`}
						>
							<CardContent className="flex items-center justify-between gap-2 flex-col p-0">
								<PlusCircle size={30} className="text-primary/80" />
								<span className="text-sm text-primary/80 font-semibold">
									{t("ProfilePage.AddIncomeDialog.addIncomeButton")}
								</span>
								<span
									className={`text-sm ${
										canAddMore
											? "text-center text-muted-foreground"
											: "text-red-500/70"
									}`}
								>
									{canAddMore
										? t("ProfilePage.AddIncomeDialog.addIncomeInfo")
										: t("ProfilePage.AddIncomeDialog.limitReached")}
								</span>
							</CardContent>
						</Card>
					</div>
				)}
			</DialogTrigger>
			<DialogContent className="sm:max-w-[425px]" showCloseButton={false}>
				<form onSubmit={handleSubmit(onSubmit)}>
					<DialogHeader>
						<DialogTitle>{t("ProfilePage.AddIncomeDialog.title")}</DialogTitle>
						<DialogDescription>
							{t("ProfilePage.AddIncomeDialog.subtitle")}
						</DialogDescription>
					</DialogHeader>
					<div className="grid gap-4 mt-2">
						<div className="grid gap-3">
							<Label htmlFor="description">{t("ui.description")}</Label>
							<Textarea
								id="description"
								{...register("description", { required: true })}
								maxLength={60}
							/>
						</div>
						<div className="grid gap-3">
							<Label htmlFor="amount">{t("common.amount")}</Label>
							<Input
								id="amount"
								type="number"
								{...register("amount", { required: true, valueAsNumber: true })}
								step="1"
								placeholder="DOP 0.00"
							/>
						</div>
						<div className="flex flex-row gap-4">
							<div className="grid gap-3">
								<Label>{t("ProfilePage.AddIncomeDialog.emoji")}</Label>
								<Select
									onValueChange={(value) => {
										setValue("emoji", value);
									}}
									defaultValue={defaultValues?.emoji || incomeEmojis[0]}
								>
									<SelectTrigger className="w-20 bg-background text-foreground">
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										{incomeEmojis.map((emoji) => (
											<SelectItem
												key={emoji}
												value={emoji}
												className="flex items-center"
											>
												<span className="text-lg">{emoji}</span>
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
							<div className="grid gap-3">
								<Label>{t("common.type")}</Label>
								<Select
									defaultValue={defaultValues?.type || IncomeType.EMPLOYMENT}
									onValueChange={(value) => {
										setValue("type", value as IncomeType);
									}}
								>
									<SelectTrigger className="w-32 bg-background text-foreground">
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										{Object.values(IncomeType).map((type) => (
											<SelectItem key={type} value={type}>
												{t(`IncomeTypes.${type.toLowerCase()}`)}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
						</div>
					</div>
					<DialogFooter className="mt-4">
						<DialogClose asChild>
							<Button variant="outline" onClick={handleCloseDialog}>
								{t("common.cancel")}
							</Button>
						</DialogClose>
						<ButtonLoading
							isLoading={isSubmitting}
							disabled={!isValid}
							type="submit"
						>
							{t("common.save")}
						</ButtonLoading>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
};

export default ManageIncomeDialog;
