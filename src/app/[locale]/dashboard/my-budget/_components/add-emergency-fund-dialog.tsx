"use client";
import React, { useTransition } from "react";
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
import { ButtonLoading } from "@/components/ui/button-loading";
import { Button } from "@/components/ui/button";

import { Heart } from "lucide-react";
import { formatCurrency } from "@/lib/formatters";
import { addEmergencyFund } from "@/app/_server-actions/(emergency-fund)/actions";
import feedbackService from "@/app/_components/utils/feedback-service";

type Props = {
	estimation: number;
	profileId: string;
	refetch: () => void;
};

const AddEmergencyFundDialog = ({ estimation, profileId, refetch }: Props) => {
	const t = useTranslations();

	const [isPending, startTransition] = useTransition();
	const onAccept = async () => {
		startTransition(async () => {
			try {
				const res = await addEmergencyFund({
					estimation,
					profileId,
					isActive: true,
					actualAmount: 0,
				});

				if (!res.isSuccess) {
					feedbackService().send({
						type: "error",
						message: t("MyBudgetPage.AddEmergencyFundDialog.messages.error"),
					});
				}

				await refetch();
				feedbackService().send({
					type: "success",
					message: t("MyBudgetPage.AddEmergencyFundDialog.messages.success"),
				});
			} catch (error) {
				feedbackService().send({
					type: "error",
					message:
						error instanceof Error
							? error.message
							: t("MyBudgetPage.AddEmergencyFundDialog.messages.error"),
				});
			}
		});
	};

	return (
		<Dialog>
			<DialogTrigger asChild>
				<div className="flex flex-col items-end justify-end w-full md:w-80 ">
					<Button
						variant={"ghost"}
						color="primary"
						className="text-primary hover:text-primary"
					>
						{t("common.add")}
						<Heart />
					</Button>
				</div>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[425px]" showCloseButton={false}>
				<DialogHeader>
					<DialogTitle>
						{t("MyBudgetPage.AddEmergencyFundDialog.title")}
					</DialogTitle>
					<DialogDescription>
						{t("MyBudgetPage.AddEmergencyFundDialog.subtitle")}
					</DialogDescription>
				</DialogHeader>
				<DialogDescription className="text-2xl font-semibold">
					{formatCurrency(estimation)}
				</DialogDescription>
				<DialogFooter className="mt-4">
					<DialogClose asChild>
						<Button variant="outline">{t("common.cancel")}</Button>
					</DialogClose>
					<ButtonLoading isLoading={isPending} onClick={onAccept}>
						{t("common.accept")}
					</ButtonLoading>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

export default AddEmergencyFundDialog;
