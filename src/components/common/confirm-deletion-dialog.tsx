"use client";

import { useDisclosure } from "@/hooks/useDisclosure";
import { useTranslations } from "next-intl";
import React, { useTransition } from "react";
import { toast } from "sonner";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "../ui/dialog";
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
		<Dialog onOpenChange={onClose}>
			<DialogTrigger asChild>
				<Button
					variant="ghost"
					size={"sm"}
					className="text-red-500 hover:bg-red-100 hover:text-red-500"
				>
					<CircleMinus />
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[380px] p-4" showCloseButton={false}>
				<DialogHeader>
					<DialogTitle>{t("ConfirmDeletionDialog.title")}</DialogTitle>
					<DialogDescription>
						{t("ConfirmDeletionDialog.subtitle")}
					</DialogDescription>
				</DialogHeader>
				<DialogFooter>
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

export default ConfirmDeletionDialog;
