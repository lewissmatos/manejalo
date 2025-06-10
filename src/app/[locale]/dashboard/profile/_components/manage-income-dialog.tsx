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

const ManageIncomeDialog = () => {
	const t = useTranslations();

	const { isOpen, onClose, onOpenChange } = useDisclosure();
	return (
		<Dialog open={isOpen} onOpenChange={onOpenChange}>
			<DialogTrigger asChild>
				<Button variant="default" size="lg" className="text-xl p-4 rounded-lg">
					{t("LoginDialog.triggerText")}
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[425px]" showCloseButton={false}>
				<DialogHeader>
					<DialogTitle>{t("LoginDialog.title")}</DialogTitle>
					<DialogDescription>{t("LoginDialog.subtitle")}</DialogDescription>
				</DialogHeader>

				<DialogFooter className="mt-4">
					<DialogClose asChild>
						<Button variant="outline">{t("common.cancel")}</Button>
					</DialogClose>
					<ButtonLoading
						// isLoading={isSubmitting}
						// disabled={!isValid}
						type="submit"
					>
						{t("common.submit")}
					</ButtonLoading>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

export default ManageIncomeDialog;
