"use client";
import React, { useEffect } from "react";
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
import { BudgetCategory } from "@/generated/prisma";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAtomValue } from "jotai/react";
import { updateProfileDataAtom } from "@/lib/jotai/auth-atom";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

import incomeEmojis from "@/lib/constants/emojis.json";
import {
	addBudgetCategory,
	updateBudgetCategory,
} from "@/app/_server-actions/(budget-categories)/actions";
import feedbackService from "@/app/_components/utils/feedback-service";

type Props = {
	canAddMore?: boolean;
	dialogTrigger?: React.ReactNode;
	defaultValues?: Partial<BudgetCategory>;
	refetchBudgetCategories: () => void;
	maxBudgetCategories: number;
	categoriesLength: number;
};

type Input = Partial<BudgetCategory>;

const ManageBudgetCategoryDialog = ({
	dialogTrigger,
	defaultValues,
	refetchBudgetCategories,
	maxBudgetCategories,
	categoriesLength,
}: Props) => {
	const t = useTranslations();

	const canAddMore = categoriesLength < maxBudgetCategories;
	const { isOpen, onClose, onOpenChange } = useDisclosure();

	const profileData = useAtomValue(updateProfileDataAtom);

	const {
		register,
		handleSubmit,
		reset,
		formState: { isValid, isSubmitting },
		setValue,
	} = useForm<Input>({
		defaultValues: {
			emoji: incomeEmojis[0],
			...defaultValues,
		},
	});

	const isEditMode = !!defaultValues?.id;

	const onSubmit: SubmitHandler<Input> = async (data) => {
		if (
			!profileData?.id ||
			!data.estimation ||
			data.estimation <= 0 ||
			!data.name
		) {
			return;
		}

		try {
			const payload = {
				estimation: data.estimation || 0,
				description: data.description?.trim() || "",
				name: data.name.trim(),
				emoji: data?.emoji || incomeEmojis[0],
				profileId: profileData?.id || "",
			};
			const res = !isEditMode
				? await addBudgetCategory(
						payload as Omit<BudgetCategory, "id" | "createdAt">
				  )
				: await updateBudgetCategory(defaultValues?.id!, payload);

			if (!res.isSuccess) {
				throw new Error(
					res.message || t("MyBudgetPage.messages.defaultErrorMessage")
				);
			}

			feedbackService().send({
				type: "success",
				message: res.message,
			});
			await refetchBudgetCategories();
			reset();
			onClose();
		} catch (err) {
			console.error("Error adding monthly income:", err);

			feedbackService().send({
				type: "error",
				message:
					err instanceof Error
						? err.message
						: t("MyBudgetPage.messages.defaultErrorMessage"),
			});
		}
	};

	const handleCloseDialog = () => {
		reset();
		onClose();
	};

	useEffect(() => {
		reset({
			emoji: defaultValues?.emoji || incomeEmojis[0],
			name: defaultValues?.name || "",
			description: defaultValues?.description || "",
			estimation: defaultValues?.estimation,
		});
	}, [defaultValues, reset, isOpen]);
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
					<div className="flex flex-col items-start justify-between w-full md:w-36 ">
						<Card
							className={`w-full p-2 h-44 items-center justify-center ${
								canAddMore
									? "cursor-pointer hover:bg-secondary/20"
									: "opacity-40 cursor-not-allowed select-none"
							}  transition-all`}
						>
							<CardContent className="flex items-center justify-between gap-2 flex-col p-0">
								<PlusCircle size={30} className="text-primary/80" />
								<span className="text-sm text-primary/80 font-semibold">
									{t("MyBudgetPage.addBudgetCategoryButton")}
								</span>
								<span
									className={`text-sm text-center ${
										canAddMore ? "text-muted-foreground" : "text-destructive/70"
									}`}
								>
									{canAddMore
										? t("MyBudgetPage.addBudgetCategoryInfo", {
												value: maxBudgetCategories || 0,
										  })
										: t("MyBudgetPage.limitReached")}
								</span>
							</CardContent>
						</Card>
					</div>
				)}
			</DialogTrigger>
			<DialogContent className="sm:max-w-[425px]" showCloseButton={false}>
				<form onSubmit={handleSubmit(onSubmit)}>
					<DialogHeader>
						<DialogTitle>
							{t("MyBudgetPage.ManageBudgetCategoryDialog.title")}
						</DialogTitle>
						<DialogDescription>
							{t("MyBudgetPage.ManageBudgetCategoryDialog.subtitle")}
						</DialogDescription>
					</DialogHeader>
					<div className="grid gap-4 mt-2">
						<div className="grid gap-3">
							<Label htmlFor="name">{t("common.name")}</Label>
							<Input
								id="name"
								{...register("name", {
									required: true,
								})}
								disabled={isEditMode}
								maxLength={30}
							/>
						</div>
						<div className="grid gap-3">
							<Label htmlFor="description">{t("common.description")}</Label>
							<Textarea
								id="description"
								{...register("description")}
								maxLength={150}
							/>
						</div>

						<div className="flex flex-row gap-4">
							<div className="grid gap-3">
								<Label>{t("common.emoji")}</Label>
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
							<div className="grid gap-3 w-full">
								<Label htmlFor="estimation">{t("common.estimation")}</Label>
								<Input
									id="estimation"
									type="number"
									{...register("estimation", {
										required: true,
										valueAsNumber: true,
										min: 1,
										max: Number.MAX_SAFE_INTEGER,
									})}
									step="1"
									placeholder="DOP 0.00"
									min={1}
									max={Number.MAX_SAFE_INTEGER}
								/>
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

export default ManageBudgetCategoryDialog;
