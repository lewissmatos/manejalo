"use server";

import supabaseAdmin from "@/lib/supabase/admin";
import { Inputs as LoginPayload } from "@/components/auth/login-dialog";
import { getTranslations } from "next-intl/server";
import { Inputs as SignUpPayload } from "@/components/auth/sign-up-dialog";
import { Profile } from "@/generated/prisma";
import { ResponseModel } from "../utils/actions.utils";
import { User } from "@supabase/supabase-js";
import { prisma } from "@/lib/prisma/prisma";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { ProfileWithIncomes } from "@/lib/jotai/auth-atom";
type ResponseData = {
	profile: ProfileWithIncomes | null;
	user: User;
} | null;
export const login = async (
	payload: LoginPayload
): Promise<ResponseModel<ResponseData>> => {
	const t = await getTranslations("LoginDialog");
	const { email, password } = payload;
	const supabase = await createServerSupabaseClient();
	const cookieStore = await cookies();

	cookieStore.set("is-authenticated", "true", {
		httpOnly: true,
		path: "/",
		sameSite: "lax",
		secure: process.env.NODE_ENV === "production",
	});

	try {
		const { error: signUpError, data: signUpData } =
			await supabase.auth.signInWithPassword({ email, password });

		if (signUpError?.code === "invalid_credentials")
			throw new Error(t("messages.wrongCredentials"));
		else {
			if (signUpError || !signUpData?.user)
				throw new Error(t("messages.defaultErrorMessage"));
		}

		const profilePrisma = await prisma.profile.findUnique({
			where: {
				email: email,
			},
			include: { incomes: true },
		});

		const userName =
			profilePrisma?.fullName?.split(" ")?.[0] ||
			email.split("@")?.[0] ||
			"bro";

		return {
			data: {
				profile: profilePrisma,
				user: signUpData.user,
			},
			message: t("messages.defaultSuccessMessage", {
				userName,
			}),
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

export const signUp = async (payload: SignUpPayload) => {
	const t = await getTranslations("SignUpDialog");
	const { fullName, email, password, birthdate, phoneNumber } = payload;
	const supabase = await supabaseAdmin;
	try {
		const profileExists = await prisma.profile.findFirst({
			where: { email },
		});

		if (profileExists?.id) throw new Error(t("messages.usernameOrEmailExists"));

		const { error: signUpError, data: signUpData } = await supabase.auth.signUp(
			{
				email,
				password,
				phone: phoneNumber?.replaceAll(/[^0-9]/g, ""),
				options: {
					data: {
						full_name: fullName,
					},
				},
			}
		);

		if (
			signUpError &&
			["email-already-in-use", "user_already_exists"].includes(
				signUpError?.code!
			)
		)
			throw new Error(t("messages.usernameOrEmailExists"));
		else if (signUpError || !signUpData?.user)
			throw new Error(t("messages.defaultErrorMessage"));

		const profileData = await prisma.profile.create({
			data: {
				userId: signUpData.user!.id,
				fullName,
				birthdate: birthdate ? new Date(birthdate) : null,
				email,
				phoneNumber: phoneNumber?.replaceAll(/[^0-9]/g, ""),
			},
		});

		if (!profileData) {
			await supabase.auth.admin.deleteUser(signUpData.user!.id);
			throw new Error(t("messages.defaultErrorMessage"));
		}

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

export const logout = async () => {
	const cookieStore = await cookies();

	cookieStore.set("is-authenticated", "false", {
		httpOnly: true,
	});
};
