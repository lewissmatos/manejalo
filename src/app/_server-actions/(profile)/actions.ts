"use server";

import supabaseAdmin from "@/lib/supabase/admin";
import { Inputs as LoginPayload } from "@/components/auth/login-dialog";
import { getTranslations } from "next-intl/server";
import { Inputs as SignUpPayload } from "@/components/auth/sign-up-dialog";
import { MonthlyIncome, Profile } from "@/generated/prisma";
import { ResponseModel } from "../utils/actions.utils";
import { User } from "@supabase/supabase-js";
import { prisma } from "@/lib/prisma/prisma";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { ProfileWithIncomes } from "@/lib/jotai/auth-atom";
type ResponseData = ProfileWithIncomes | null;

export const getProfileData = async (
	profileId: string
): Promise<ResponseModel<ResponseData>> => {
	const t = await getTranslations("ProfilePage");
	try {
		const res = await prisma.profile.findUnique({
			where: { id: profileId },
			include: { incomes: true },
		});

		return {
			data: res,
			message: "",
			isSuccess: true,
		};
	} catch (error) {
		console.error("Error adding monthly income:", error);
		return {
			data: null,
			message: error instanceof Error ? error.message : "",
			isSuccess: false,
		};
	}
};
