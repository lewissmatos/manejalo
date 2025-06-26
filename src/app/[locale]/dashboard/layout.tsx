import React from "react";
import AppNavBar from "./_components/app-navbar";
import { redirect } from "next/navigation";
import { Metadata } from "next";
import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";
import { getLocale } from "next-intl/server";
import { setDefaultOptions } from "date-fns";
import { enUS, es } from "date-fns/locale";
import { getSession } from "@/middleware";

const AppSideCalendar = dynamic(
	() => import("./overview/_components/overview-date-selector"),
	{
		loading: () => <Skeleton className="w-full h-96 rounded-md" />,
		ssr: !!false,
	}
);

export const metadata: Metadata = {
	title: {
		default: "Manejalo - Your Finance Manager",
		template: "%s | Manejalo",
	},
	description: "Track and manage your personal finances effortlessly.",
	openGraph: {
		title: "Manejalo",
		description: "Finance management app for personal budgeting.",
		url: "https://manejalo.app",
		siteName: "Manejalo",
		type: "website",
	},
};

const layout = async ({ children }: { children: React.ReactNode }) => {
	const [locale, session] = await Promise.all([getLocale(), getSession()]);

	setDefaultOptions({ locale: locale === "en" ? enUS : es });

	const isAuthenticated = Boolean(session?.isAuthenticated);

	if (!isAuthenticated || !session?.profile) {
		redirect("/");
	}

	const profileData = session?.profile;
	return (
		<div className="flex w-screen flex-col gap-2 h-screen">
			<AppNavBar profile={profileData} />
			<div className="w-full h-full flex flex-col md:flex-row gap-4 p-4 items-start">
				<div className="overflow-x-hidden overflow-y-auto w-full">
					{children}
				</div>
			</div>
		</div>
	);
};

export default layout;
