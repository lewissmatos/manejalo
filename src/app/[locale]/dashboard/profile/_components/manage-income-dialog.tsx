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
import { MonthlyIncome } from "@/generated/prisma";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const ManageIncomeDialog = () => {
	const t = useTranslations();

	const { isOpen, onClose, onOpenChange } = useDisclosure();

	const {
		register,
		handleSubmit,
		reset,
		formState: { isValid, isSubmitting },
	} = useForm<Partial<MonthlyIncome>>();

	const onSubmit: SubmitHandler<Partial<MonthlyIncome>> = async (data) => {
		try {
		} catch (err) {}
	};

	const handleCloseDialog = () => {
		reset();
		onClose();
	};

	return (
		<Dialog
			open={isOpen}
			onOpenChange={(isOpen) => {
				onOpenChange(isOpen);
				if (!isOpen) {
					handleCloseDialog();
				}
			}}
		>
			<DialogTrigger asChild>
				<Card className="w-full md:w-28 p-0 max-w-sm h-24 items-center justify-center cursor-pointer hover:bg-secondary/20 transition-all">
					<CardContent className="flex items-center justify-between gap-2 flex-col p-0">
						<PlusCircle size={34} className="text-primary/80" />
						<span className="text-sm text-primary/80">
							{t("ProfilePage.addIncomeButton")}
						</span>
					</CardContent>
				</Card>
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
								maxLength={96}
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
