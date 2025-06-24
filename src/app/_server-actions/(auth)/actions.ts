"use server";

import { Inputs as LoginPayload } from "@/app/_components/login-dialog";
import { Inputs as SignUpPayload } from "@/app/_components/sign-up-dialog";
import {
	ResponseModel,
	serviceResponseHandler,
} from "../../../lib/services/utils/actions.utils";
import { User } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { ProfileWithIncomes } from "@/lib/jotai/auth-atom";
import { loginService, signUpService } from "@/lib/services/auth-services";
import { getTranslations } from "next-intl/server";
type ResponseData = {
	profile: ProfileWithIncomes | null;
	user: User;
} | null;
export const login = async (
	payload: LoginPayload
): Promise<ResponseModel<ResponseData>> => {
	const { email, password } = payload;
	const t = await getTranslations("LoginDialog.messages");
	let userName = email.split("@")?.[0];
	const fn = async () => {
		const cookieStore = await cookies();
		const { profile, user } = await loginService({ email, password });

		if (!profile) throw new Error("profileNotFound");
		cookieStore.set("is-authenticated", "true", {
			httpOnly: true,
			path: "/",
			sameSite: "lax",
			secure: process.env.NODE_ENV === "production",
		});

		cookieStore.set("profile-id", profile?.id!, {
			httpOnly: true,
			path: "/",
			sameSite: "lax",
			secure: process.env.NODE_ENV === "production",
		});

		return {
			profile: profile,
			user: user,
		};
	};

	return await serviceResponseHandler<ResponseData>(fn, {
		successMessage: t("defaultSuccessMessage", { userName }),
		errorMessage: t("defaultErrorMessage"),
		translator: t,
	});
};

export const signUp = async (payload: SignUpPayload) => {
	const t = await getTranslations("SignUpDialog.messages");
	const fn = async () => await signUpService(payload);

	return await serviceResponseHandler(fn, {
		successMessage: t("defaultSuccessMessage"),
		errorMessage: t("defaultErrorMessage"),
		translator: t,
	});
};

export const logout = async () => {
	const cookieStore = await cookies();

	await cookieStore.set("is-authenticated", "false", {
		httpOnly: true,
	});
};
