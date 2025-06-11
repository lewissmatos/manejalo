"use client";

import { authAtom, updateProfileDataAtom } from "@/lib/jotai/auth-atom";
import { useAtomValue, useSetAtom } from "jotai/react";
import { useTranslations } from "next-intl";
import React, { use, useEffect, useMemo } from "react";
import ScreenTitle from "../../_components/screen-title";
import { formatCurrency } from "@/lib/formatters";
import MonthlyIncomeCard from "./monthly-icome-card";
import ManageIncomeDialog from "./manage-income-dialog";
import { getProfileData } from "@/app/_server-actions/(profile)/actions";
import { useQuery } from "@tanstack/react-query";
import { MonthlyIncome } from "@/generated/prisma";

const ProfileInfoSection = () => {
	const t = useTranslations("ProfilePage");

	const { profile, totalMonthlyIncome } = useAtomValue(authAtom);
	const onSetProfileData = useSetAtom(updateProfileDataAtom);

	const { data: profileData, refetch } = useQuery({
		queryKey: ["profileData", profile?.id],
		queryFn: () => getProfileData(profile?.id || ""),
		enabled: !!profile?.id,
	});

	useEffect(() => {
		if (!profileData?.data) return;

		onSetProfileData(profileData?.data || null);
	}, [profileData]);

	const age = useMemo(() => {
		if (!profile?.birthdate) return 0;
		return calculateAge(new Date(profile.birthdate));
	}, [profile?.birthdate]);

	if (!profile) {
		return (
			<section className="flex flex-col justify-center w-full max-w-3xl">
				<ScreenTitle>{t("profileNotFound")}</ScreenTitle>
				<span className="text-lg text-muted-foreground">
					{t("profileNotFoundMessage")}
				</span>
			</section>
		);
	}

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
					value: formatCurrency(totalMonthlyIncome || 0),
				})}
			</p>
			<section className="flex flex-col items justify-center mt-4 ">
				<p className="text-lg text-primary/90 ">{t("myMonthlyIncomes")}</p>
				<section className="flex flex-wrap gap-4 overflow-y-auto max-h-[calc(70vh-100px)] mt-2">
					<ManageIncomeDialog
						canAddMore={profile.incomes?.length < 5}
						refetchProfileData={refetch}
					/>

					{profile.incomes?.map((income) => (
						<MonthlyIncomeCard
							refetchProfileData={refetch}
							key={income.id}
							income={income}
						/>
					))}
				</section>
			</section>
		</main>
	);
};

const calculateAge = (birthdate: string | Date) => {
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

export default ProfileInfoSection;
