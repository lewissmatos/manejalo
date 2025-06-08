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

type Inputs = {
	username: string;
	password: string;
};
const LoginDialog = () => {
	const localT = useTranslations("LoginDialog");
	const commonT = useTranslations("common");
	const {
		register,
		handleSubmit,
		watch,
		formState: { errors, isValid },
	} = useForm<Inputs>();

	const onSubmit: SubmitHandler<Inputs> = (data) => console.log(data);

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button variant="default" size="lg">
					{localT("triggerText")}
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[425px]">
				<form onSubmit={handleSubmit(onSubmit)}>
					<DialogHeader>
						<DialogTitle>{localT("title")}</DialogTitle>
						<DialogDescription>{localT("subtitle")}</DialogDescription>
					</DialogHeader>
					<div className="grid gap-4 mt-2">
						<div className="grid gap-3">
							<Label htmlFor="username">{commonT("username")}</Label>
							<Input
								id="username"
								placeholder="@lewissmatos"
								{...register("username", { required: true })}
							/>
						</div>
						<div className="grid gap-3">
							<Label htmlFor="password">{commonT("password")}</Label>
							<PasswordInput
								id="password"
								placeholder="********"
								{...register("password", { required: true, minLength: 8 })}
							/>
						</div>
					</div>
					<DialogFooter className="mt-4">
						<DialogClose asChild>
							<Button variant="outline">{commonT("cancel")}</Button>
						</DialogClose>
						<Button disabled={!isValid} type="submit">
							{commonT("submit")}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
};

export default LoginDialog;
