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
import { useSetAtom } from "jotai/react";
import { authAtom } from "@/lib/jotai/auth-atoms";

export type Inputs = {
	email: string;
	password: string;
};

type Props = {
	dialogTrigger?: React.ReactNode;
};
const LoginDialog = ({ dialogTrigger }: Props) => {
	const localT = useTranslations("LoginDialog");
	const commonT = useTranslations("common");
	const { isOpen, onClose, onOpenChange } = useDisclosure();

	const {
		register,
		handleSubmit,

		reset,
		formState: { errors, isValid, isSubmitting },
	} = useForm<Inputs>();

	const onSetAuthData = useSetAtom(authAtom);

	const onSubmit: SubmitHandler<Inputs> = async (data) => {
		try {
			const res = await login({
				...data,
			} as Inputs);

			if (!res.isSuccess) {
				throw new Error(res.message || localT("messages.defaultErrorMessage"));
			}
			const { profile, user } = res.data || {};

			onSetAuthData({
				isAuthenticated: true,
				profile: profile || null,
				user: user || null,
			});

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
				{dialogTrigger || (
					<Button
						variant="default"
						size="lg"
						className="text-xl p-4 rounded-lg"
					>
						{localT("triggerText")}
					</Button>
				)}
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
