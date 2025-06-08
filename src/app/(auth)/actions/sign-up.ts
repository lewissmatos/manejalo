"use server";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import { Inputs as SignUpPayload } from "@/components/auth/sign-up-dialog";
export const signUp = async (formData: SignUpPayload) => {
	const { fullName, username, email, password, birthdate, phoneNumber } =
		formData;
	const supabase = await createServerSupabaseClient();
	try {
		const { error: signUpError, data: signUpData } = await supabase.auth.signUp(
			{
				email,
				password,
				options: {
					data: {
						full_name: fullName,
						phone_number: phoneNumber,
					},
				},
			}
		);
		console.log(signUpData, signUpError);
		if (signUpError || !signUpData?.user) throw signUpError;
		const { error: profileError } = await supabase.from("profiles").insert({
			user_id: signUpData.user!.id,
			full_name: fullName,
			username,
			birthdate,
			password,
			phone_number: phoneNumber,
		});
		if (profileError) throw profileError;
		return {
			user: signUpData.user,
			message: "Sign up successful",
			status: "success",
			error: null,
			isSuccess: true,
		};
	} catch (error) {
		console.error("Sign up error:", error);
		return {
			user: null,
			profile: null,
			message: "Sign up failed",
			status: "error",
			error: error instanceof Error ? error.message : "Unknown error",
			isSuccess: false,
		};
	}
};
