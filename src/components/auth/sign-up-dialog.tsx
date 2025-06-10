"use client";
import React, { useMemo } from "react";
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
import { DatePicker } from "../ui/date-picker";
import { signUp } from "@/app/server-actions/(auth)/actions";
import { ButtonLoading } from "../ui/button-loading";
import { toast } from "sonner";
import { useDisclosure } from "@/hooks/useDisclosure";

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
	const localT = useTranslations("SignUpDialog");
	const commonT = useTranslations("common");

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
				throw new Error(res.message || localT("messages.defaultErrorMessage"));
			}
			toast(res.message);
			handleCloseDialog();
		} catch (err) {
			console.error(err);
			toast.error(err instanceof Error ? err.message : String(err));
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
		<Dialog open={isOpen} onOpenChange={onOpenChange}>
			<DialogTrigger asChild>
				{dialogTrigger || (
					<Button variant="link" size="lg" className="p-1">
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
							<Label isRequired htmlFor="fullName">
								{commonT("fullName")}
							</Label>
							<Input
								id="fullName"
								placeholder="Lewis Matos"
								{...register("fullName", { required: true })}
							/>
						</div>

						<div className="grid gap-3">
							<Label isRequired htmlFor="email">
								{commonT("email")}
							</Label>
							<Input
								id="email"
								placeholder="lewissmatos@gmail.com"
								type="email"
								{...register("email", { required: true })}
							/>
						</div>
						<div className="grid gap-3">
							<Label>{commonT("birthdate")}</Label>
							<DatePicker
								onChangeDate={(date) =>
									setValue("birthdate", date?.toISOString())
								}
							/>
						</div>
						<div className="grid gap-3">
							<Label htmlFor="phoneNumber">{commonT("phoneNumber")}</Label>
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
								{commonT("password")}
							</Label>
							<PasswordInput
								id="password"
								placeholder="********"
								{...register("password", { required: true, minLength: 8 })}
							/>
						</div>
						<div className="grid gap-3">
							<Label isRequired htmlFor="confirmPassword">
								{commonT("confirmPassword")}
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
							{commonT("cancel")}
						</Button>
						<ButtonLoading
							type="submit"
							disabled={!isValid || !hasMatchedPasswords}
							isLoading={isSubmitting}
						>
							{commonT("submit")}
						</ButtonLoading>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
};

export default SignUpDialog;
