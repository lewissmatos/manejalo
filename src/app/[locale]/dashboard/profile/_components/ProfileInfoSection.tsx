"use client";

import { authAtom } from "@/lib/jotai/auth-atom";
import { useAtomValue } from "jotai/react";
import { useTranslations } from "next-intl";
import React, { useMemo } from "react";
import ScreenTitle from "../../_components/ScreenTitle";
import { formatCurrency } from "@/lib/formatters";
import MonthlyIncomeCard from "./MonthlyIncomeCard";
import { Card, CardContent } from "@/components/ui/card";
import { PlusCircle } from "lucide-react";

const ProfileInfoSection = () => {
	const t = useTranslations("ProfilePage");

	const { profile, profileTotalMonthlyIncome } = useAtomValue(authAtom);

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
		<main className="flex flex-col justify-center w-full max-w-3xl">
			<ScreenTitle>{`${profile?.fullName} ${
				!age
					? ""
					: `(${t("yearsWithValue", {
							years: age,
					  })})`
			}`}</ScreenTitle>

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
					value: formatCurrency(profileTotalMonthlyIncome || 0),
				})}
			</p>
			<section className="flex flex-col items justify-center mt-4 ">
				<p className="text-lg text-primary/90 ">{t("myMonthlyIncomes")}</p>
				<section className="flex flex-wrap gap-4 overflow-y-auto max-h-[calc(70vh-100px)] mt-2">
					{profile.incomes?.length < 5 ? (
						<Card className="w-full md:w-28 p-0 max-w-sm h-24 items-center justify-center cursor-pointer hover:bg-secondary/20 transition-all">
							<CardContent className="flex items-center justify-between gap-2 flex-col p-0">
								<PlusCircle size={34} className="text-primary/80" />
								<span className="text-sm text-primary/80">
									{t("addIncomeButton")}
								</span>
							</CardContent>
						</Card>
					) : null}

					{profile.incomes?.map((income) => (
						<MonthlyIncomeCard
							key={income.id}
							description={income.description}
							amount={income.amount}
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
