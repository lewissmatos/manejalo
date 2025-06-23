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
import { Button } from "../../components/ui/button";
import { Label } from "../../components/ui/label";
import { Input } from "../../components/ui/input";
import { useTranslations } from "next-intl";
import { PasswordInput } from "../../components/ui/password-input";
import { useForm, SubmitHandler } from "react-hook-form";
import { useDisclosure } from "@/hooks/useDisclosure";
import { login } from "@/app/_server-actions/(auth)/actions";
import { ButtonLoading } from "../../components/ui/button-loading";
import { useSetAtom } from "jotai/react";
import { authAtom } from "@/lib/jotai/auth-atom";
import { useRouter } from "next/navigation";
import feedbackService from "@/app/_components/utils/feedback-service";

export type Inputs = {
	email: string;
	password: string;
};

type Props = {
	dialogTrigger?: React.ReactNode;
};
const LoginDialog = ({ dialogTrigger }: Props) => {
	const t = useTranslations();

	const { isOpen, onClose, onOpenChange } = useDisclosure();

	const router = useRouter();
	const {
		register,
		handleSubmit,
		reset,
		formState: { isValid, isSubmitting },
	} = useForm<Inputs>();

	const onSetAuthData = useSetAtom(authAtom);

	const onSubmit: SubmitHandler<Inputs> = async (data) => {
		try {
			const res = await login({
				...data,
			} as Inputs);

			if (!res.isSuccess) {
				throw new Error(
					res.message || t("LoginDialog.messages.defaultErrorMessage")
				);
			}
			const { profile, user } = res.data || {};

			onSetAuthData({
				isAuthenticated: true,
				profile: profile || null,
				user: user || null,
				totalMonthlyIncome: profile?.totalMonthlyIncome || 0,
			});

			feedbackService().send({
				type: "success",
				message: res.message,
			});

			handleCloseDialog();
			router.push("/dashboard/overview");
		} catch (err) {
			feedbackService().send({
				type: "error",
				message:
					err instanceof Error
						? err.message
						: t("LoginDialog.messages.defaultErrorMessage"),
			});
		}
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
				{dialogTrigger || (
					<Button
						variant="default"
						size="lg"
						className="text-xl p-4 rounded-lg"
					>
						{t("LoginDialog.triggerText")}
					</Button>
				)}
			</DialogTrigger>
			<DialogContent className="sm:max-w-[425px]" showCloseButton={false}>
				<form onSubmit={handleSubmit(onSubmit)}>
					<DialogHeader>
						<DialogTitle>{t("LoginDialog.title")}</DialogTitle>
						<DialogDescription>{t("LoginDialog.subtitle")}</DialogDescription>
					</DialogHeader>
					<div className="grid gap-4 mt-2">
						<div className="grid gap-3">
							<Label htmlFor="email">{t("common.email")}</Label>
							<Input
								type="email"
								id="email"
								{...register("email", { required: true })}
							/>
						</div>
						<div className="grid gap-3">
							<Label htmlFor="password">{t("common.password")}</Label>
							<PasswordInput
								id="password"
								{...register("password", { required: true, minLength: 8 })}
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
							{t("common.submit")}
						</ButtonLoading>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
};

export default LoginDialog;
