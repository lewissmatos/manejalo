"use client";

import { useDisclosure } from "@/hooks/useDisclosure";
import { useTranslations } from "next-intl";
import React, { useTransition } from "react";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "../ui/button";
import { CircleMinus } from "lucide-react";
import { ButtonLoading } from "../ui/button-loading";
import feedbackService from "@/app/_components/utils/feedback-service";

type Props = {
	itemId: string;
	refetchCallback: () => void;
	confirmationCallback: (itemId: string) => Promise<any>;
};
const ConfirmDeletionDialog = ({
	confirmationCallback,
	refetchCallback,
	itemId,
}: Props) => {
	const t = useTranslations();
	const { onClose } = useDisclosure();
	const [isPending, startTransition] = useTransition();
	const onDelete = async () => {
		startTransition(async () => {
			try {
				const res = await confirmationCallback(itemId);
				if (!res.isSuccess) {
					throw new Error(res.message || t("common.error.defaultErrorMessage"));
				}

				feedbackService().send({
					type: "success",
					message: res.message,
				});
				await refetchCallback();
				onClose();
			} catch (error) {
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

	return (
		<AlertDialog onOpenChange={onClose}>
			<AlertDialogTrigger asChild>
				<Button
					variant="ghost"
					size={"sm"}
					className="text-destructive hover:bg-red-100 hover:text-destructive"
				>
					<CircleMinus />
				</Button>
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>
						{t("ConfirmDeletionDialog.title")}
					</AlertDialogTitle>
					<AlertDialogDescription>
						{t("ConfirmDeletionDialog.subtitle")}
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
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
					<AlertDialogCancel onClick={onClose}>
						{t("common.cancel")}
					</AlertDialogCancel>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
};

export default ConfirmDeletionDialog;
