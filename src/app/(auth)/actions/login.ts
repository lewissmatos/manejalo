"use server";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import { Inputs as LoginPayload } from "@/components/auth/login-dialog";
import { getTranslations } from "next-intl/server";
export const login = async (payload: LoginPayload) => {
	const t = await getTranslations("LoginDialog");
	const { email, password } = payload;
	const supabase = await createServerSupabaseClient();
	try {
		const { error: signUpError, data: signUpData } =
			await supabase.auth.signInWithPassword({ email, password });

		if (signUpError?.code === "invalid_credentials")
			throw new Error(t("messages.wrongCredentials"));
		else {
			if (signUpError || !signUpData?.user)
				throw new Error(t("messages.defaultErrorMessage"));
		}

		const profileData = await supabase
			.from("profiles")
			.select("*")
			.eq("email", email)
			.single();

		return {
			data: {
				profile: profileData.data,
				user: signUpData.user,
			},
			message: t("messages.defaultSuccessMessage"),
			isSuccess: true,
		};
	} catch (error) {
		return {
			data: null,
			message: error instanceof Error ? error.message : "Unknown error",
			isSuccess: false,
		};
	}
};
