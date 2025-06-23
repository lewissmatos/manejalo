"use client";
import React, { useMemo } from "react";
import {
	Dialog,
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
import { DatePicker } from "../../components/ui/date-picker";
import { signUp } from "@/app/_server-actions/(auth)/actions";
import { ButtonLoading } from "../../components/ui/button-loading";
import { useDisclosure } from "@/hooks/useDisclosure";
import feedbackService from "@/app/_components/utils/feedback-service";

export type Inputs = {
	fullName: string;
	password: string;
	email: string;
	confirmPassword?: string;
	birthdate?: string;
	phoneNumber?: string;
};

type Props = {
	dialogTrigger?: React.ReactNode;
};
const SignUpDialog = ({ dialogTrigger }: Props) => {
	const t = useTranslations();

	const { isOpen, onClose, onOpenChange } = useDisclosure();
	const {
		register,
		handleSubmit,
		setValue,
		reset,
		formState: { isSubmitting, isValid },
		watch,
	} = useForm<Inputs>();

	const onSubmit: SubmitHandler<Inputs> = async (data) => {
		try {
			const res = await signUp({
				...data,
			} as Inputs);
			if (!res.isSuccess) {
				throw new Error(
					res.message || t("SignUpDialog.messages.defaultErrorMessage")
				);
			}
			feedbackService().send({
				type: "success",
				message: res.message,
			});
			handleCloseDialog();
		} catch (err) {
			feedbackService().send({
				type: "error",
				message:
					err instanceof Error
						? err.message
						: t("SignUpDialog.messages.defaultErrorMessage"),
			});
		}
	};

	const hasMatchedPasswords = useMemo(() => {
		const password = watch("password");
		const confirmPassword = watch("confirmPassword");
		return String(password) === String(confirmPassword);
	}, [watch("password"), watch("confirmPassword")]);

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
					<Button variant="link" size="lg" className="p-1">
						{t("SignUpDialog.triggerText")}
					</Button>
				)}
			</DialogTrigger>
			<DialogContent className="sm:max-w-[425px]" showCloseButton={false}>
				<form onSubmit={handleSubmit(onSubmit)}>
					<DialogHeader>
						<DialogTitle>{t("SignUpDialog.title")}</DialogTitle>
						<DialogDescription>{t("SignUpDialog.subtitle")}</DialogDescription>
					</DialogHeader>
					<div className="grid gap-4 mt-2">
						<div className="grid gap-3">
							<Label isRequired htmlFor="fullName">
								{t("common.fullName")}
							</Label>
							<Input
								id="fullName"
								placeholder="Lewis Matos"
								{...register("fullName", { required: true })}
							/>
						</div>

						<div className="grid gap-3">
							<Label isRequired htmlFor="email">
								{t("common.email")}
							</Label>
							<Input
								id="email"
								placeholder="lewissmatos@gmail.com"
								type="email"
								{...register("email", { required: true })}
							/>
						</div>
						<div className="grid gap-3">
							<Label>{t("common.birthdate")}</Label>
							<DatePicker
								onChangeDate={(date) =>
									setValue("birthdate", date?.toISOString())
								}
							/>
						</div>
						<div className="grid gap-3">
							<Label htmlFor="phoneNumber">{t("common.phoneNumber")}</Label>
							<Input
								id="phoneNumber"
								placeholder="849-123-4567"
								type="tel"
								{...register("phoneNumber")}
								onBlur={(e) => {
									const value = e.target.value.replace(/\D/g, "");
									if (value.length === 10) {
										const formattedValue = `(${value.slice(
											0,
											3
										)}) ${value.slice(3, 6)}-${value.slice(6)}`;
										setValue("phoneNumber", formattedValue);
									}
								}}
								pattern="^\(\d{3}\) \d{3}-\d{4}$"
							/>
						</div>
						<div className="grid gap-3">
							<Label isRequired htmlFor="password">
								{t("common.password")}
							</Label>
							<PasswordInput
								id="password"
								placeholder="********"
								{...register("password", { required: true, minLength: 8 })}
							/>
						</div>
						<div className="grid gap-3">
							<Label isRequired htmlFor="confirmPassword">
								{t("common.confirmPassword")}
							</Label>
							<PasswordInput
								id="confirmPassword"
								placeholder="********"
								{...register("confirmPassword", {
									required: true,
									minLength: 8,
								})}
							/>
						</div>
					</div>
					<DialogFooter className="mt-4">
						<Button variant="outline" onClick={handleCloseDialog}>
							{t("common.cancel")}
						</Button>
						<ButtonLoading
							type="submit"
							disabled={!isValid || !hasMatchedPasswords}
							isLoading={isSubmitting}
						>
							{t("common.submit")}
						</ButtonLoading>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
};

export default SignUpDialog;
