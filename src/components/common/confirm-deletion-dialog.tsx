"use client";

import { useDisclosure } from "@/hooks/useDisclosure";
import { useTranslations } from "next-intl";
import React, { useTransition } from "react";
import { toast } from "sonner";
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

				toast(res.message || t("common.success.defaultSuccessMessage"));
				await refetchCallback();
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
