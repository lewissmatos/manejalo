import { User } from "@supabase/supabase-js";
import { ProfileWithIncomes } from "../jotai/auth-atom";
import { prisma } from "../prisma/prisma";
import { createServerSupabaseClient } from "../supabase/server";
import {
	Inputs,
	Inputs as SignUpPayload,
} from "@/app/_components/sign-up-dialog";
import supabaseAdmin from "../supabase/admin";
import { Inputs as LoginPayload } from "@/app/_components/login-dialog";

const loginService = async ({
	email,
	password,
}: LoginPayload): Promise<{
	profile: ProfileWithIncomes | null;
	user: User;
}> => {
	const supabase = await createServerSupabaseClient();
	const { error: signUpError, data: signUpData } =
		await supabase.auth.signInWithPassword({ email, password });

	if (signUpError?.code === "invalid_credentials") throw "wrongCredentials";
	else {
		if (signUpError || !signUpData?.user) throw "defaultErrorMessage";
	}

	const profilePrisma = await prisma.profile.findUnique({
		where: {
			email: email,
		},
		include: { incomes: true },
	});

	if (!profilePrisma) {
		throw "profileNotFound";
	}

	return {
		profile: profilePrisma,
		user: signUpData.user,
	};
};

const signUpService = async (payload: SignUpPayload) => {
	const { fullName, email, password, birthdate, phoneNumber } = payload;
	const supabase = await supabaseAdmin;
	const profileExists = await prisma.profile.findFirst({
		where: { email },
	});

	if (profileExists?.id) throw "usernameOrEmailExists";

	const { error: signUpError, data: signUpData } = await supabase.auth.signUp({
		email,
		password,
		phone: phoneNumber?.replaceAll(/[^0-9]/g, ""),
		options: {
			data: {
				full_name: fullName,
			},
		},
	});

	if (
		signUpError &&
		["email-already-in-use", "user_already_exists"].includes(signUpError?.code!)
	)
		throw "usernameOrEmailExists";
	else if (signUpError || !signUpData?.user) throw "defaultErrorMessage";

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
		throw "defaultErrorMessage";
	}

	return signUpData.user;
};

export { loginService, signUpService };
