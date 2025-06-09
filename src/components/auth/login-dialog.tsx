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
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { useTranslations } from "next-intl";
import { PasswordInput } from "../ui/password-input";
import { useForm, SubmitHandler } from "react-hook-form";
import { useDisclosure } from "@/hooks/useDisclosure";
import { login } from "@/app/server-actions/(auth)/actions";
import { toast } from "sonner";
import { ButtonLoading } from "../ui/button-loading";

export type Inputs = {
	email: string;
	password: string;
};
const LoginDialog = () => {
	const localT = useTranslations("LoginDialog");
	const commonT = useTranslations("common");
	const { isOpen, onClose, onOpenChange } = useDisclosure();

	const {
		register,
		handleSubmit,

		reset,
		formState: { errors, isValid, isSubmitting },
	} = useForm<Inputs>();

	const onSubmit: SubmitHandler<Inputs> = async (data) => {
		try {
			const res = await login({
				...data,
			} as Inputs);

			console.log("res", res);
			if (!res.isSuccess) {
				throw new Error(res.message || localT("messages.defaultErrorMessage"));
			}
			toast(res.message);
			handleCloseDialog();
		} catch (err) {
			console.log(err);
			toast.error(err instanceof Error ? err.message : String(err));
		}
	};

	const handleCloseDialog = () => {
		reset();
		onClose();
	};

	return (
		<Dialog open={isOpen} onOpenChange={onOpenChange}>
			<DialogTrigger asChild>
				<Button variant="default" size="lg">
					{localT("triggerText")}
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[425px]" showCloseButton={false}>
				<form onSubmit={handleSubmit(onSubmit)}>
					<DialogHeader>
						<DialogTitle>{localT("title")}</DialogTitle>
						<DialogDescription>{localT("subtitle")}</DialogDescription>
					</DialogHeader>
					<div className="grid gap-4 mt-2">
						<div className="grid gap-3">
							<Label htmlFor="email">{commonT("email")}</Label>
							<Input
								type="email"
								id="email"
								{...register("email", { required: true })}
							/>
						</div>
						<div className="grid gap-3">
							<Label htmlFor="password">{commonT("password")}</Label>
							<PasswordInput
								id="password"
								{...register("password", { required: true, minLength: 8 })}
							/>
						</div>
					</div>
					<DialogFooter className="mt-4">
						<DialogClose asChild>
							<Button variant="outline" onClick={handleCloseDialog}>
								{commonT("cancel")}
							</Button>
						</DialogClose>
						<ButtonLoading
							isLoading={isSubmitting}
							disabled={!isValid}
							type="submit"
						>
							{commonT("submit")}
						</ButtonLoading>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
};

export default LoginDialog;
