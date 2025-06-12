import React from "react";
import { getTranslations } from "next-intl/server";
import { cookies } from "next/headers";
import { getProfileData } from "@/app/_server-actions/(profile)/actions";
import ScreenTitle from "../_components/screen-title";
import { formatCurrency } from "@/lib/formatters";
import ManageIncomeDialog from "./_components/manage-income-dialog";
import MonthlyIncomeCard from "./_components/monthly-icome-card";
import { revalidatePath } from "next/cache";

const Profile = async () => {
	const t = await getTranslations("ProfilePage");
	const cookieStore = await cookies();

	const profileId = cookieStore.get("profile-id")?.value || "";
	if (!profileId) {
		return (
			<section className="flex flex-col justify-center w-full max-w-3xl">
				<h1 className="text-2xl font-bold">{t("profileNotFound")}</h1>
				<p className="text-lg text-muted-foreground">
					{t("profileNotFoundMessage")}
				</p>
			</section>
		);
	}

	const profileData = await getProfileData(profileId);

	const profile = profileData?.data;

	if (!profile) {
		return (
			<section className="flex flex-col justify-center w-full max-w-3xl">
				<h1 className="text-2xl font-bold">{t("profileNotFound")}</h1>
				<p className="text-lg text-muted-foreground">
					{t("profileNotFoundMessage")}
				</p>
			</section>
		);
	}

	const refetchProfileData = async () => {
		"use server";
		revalidatePath("/dashboard/profile");
	};

	const age = calculateAge(profile?.birthdate as unknown as string);

	return (
		<main className="flex flex-col justify-center w-full">
			<ScreenTitle>
				{`${profile?.fullName} ${
					!age ? "" : `(${t("yearsWithValue", { years: age })})`
				}`}
			</ScreenTitle>

			{profile.occupation ? (
				<span className="text-lg text-muted-foreground">
					{profile?.occupation}
				</span>
			) : null}

			<span className="text-lg text-primary/80">{profile?.email}</span>
			{profile?.phoneNumber ? (
				<span className="text-md text-primary/80">
					{profile?.phoneNumber.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3")}
				</span>
			) : null}
			<p className="text-xl text-primary font-semibold">
				{t("profileTotalMonthlyIncomeWithValue", {
					value: formatCurrency(profile.totalMonthlyIncome || 0),
				})}
			</p>
			<section className="flex flex-col items justify-center mt-4 ">
				<p className="text-lg text-primary/90 ">{t("myMonthlyIncomes")}</p>
				<section className="flex flex-wrap gap-4 overflow-y-auto max-h-[calc(70vh-100px)] mt-2">
					<ManageIncomeDialog
						canAddMore={profile.incomes?.length < 5}
						refetchProfileData={refetchProfileData}
					/>

					{profile.incomes?.map((income) => (
						<MonthlyIncomeCard
							refetchProfileData={refetchProfileData}
							key={income.id}
							income={income}
						/>
					))}
				</section>
			</section>
		</main>
	);
};

const calculateAge = (birthdate: string | null | Date) => {
	if (!birthdate) return 0;
	const birthDateObj = new Date(birthdate);
	const today = new Date();
	const age = today.getFullYear() - birthDateObj.getFullYear();
	const monthDiff = today.getMonth() - birthDateObj.getMonth();

	if (
		monthDiff < 0 ||
		(monthDiff === 0 && today.getDate() - 1 < birthDateObj.getDate())
	) {
		return age - 1;
	}

	return age;
};

export default Profile;
