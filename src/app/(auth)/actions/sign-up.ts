"use server";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import { Inputs as SignUpPayload } from "@/components/auth/sign-up-dialog";
import { getTranslations } from "next-intl/server";
export const signUp = async (payload: SignUpPayload) => {
	const t = await getTranslations("SignUpDialog");
	const { fullName, email, password, birthdate, phoneNumber } = payload;
	const supabase = await createServerSupabaseClient();
	try {
		const profileExists = await supabase
			.from("profiles")
			.select("id")
			.eq("email", email)
			.single();

		if (profileExists.data)
			throw new Error(t("messages.usernameOrEmailExists"));

		const { error: signUpError, data: signUpData } = await supabase.auth.signUp(
			{
				email,
				password,
				options: {
					data: {
						full_name: fullName,
						phone: phoneNumber,
					},
				},
			}
		);
		if (signUpError || !signUpData?.user)
			throw new Error(t("messages.defaultErrorMessage"));

		const { error: profileError } = await supabase.from("profiles").insert({
			user_id: signUpData.user!.id,
			full_name: fullName,
			birthdate,
			password,
			email,
			phone_number: phoneNumber?.replaceAll(/[^0-9]/g, ""),
		});
		if (profileError) throw t("messages.defaultErrorMessage");
		return {
			data: signUpData.user,
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
