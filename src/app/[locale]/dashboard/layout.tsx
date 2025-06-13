import React from "react";
import AppNavBar from "./_components/app-navbar";
const AppSideCalendar = dynamic(
	() => import("./_components/app-side-calendar"),
	{
		loading: () => <Skeleton className="w-full h-96 rounded-md" />,
		ssr: !!false,
	}
);
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { Metadata } from "next";
import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";
import AppSideHistorySummary from "./_components/app-side-history-summary";

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
	const cookieStore = await cookies();
	const isAuthenticated =
		(await cookieStore.get("is-authenticated")?.value) === "true";

	if (!isAuthenticated) {
		redirect("/");
	}

	return (
		<div className="flex w-screen flex-col gap-2">
			<AppNavBar />
			<div className="w-full flex flex-col md:flex-row gap-4 p-4 items-start">
				<div className="overflow-x-hidden overflow-y-auto w-full">
					{children}
				</div>
				<div className="flex flex-col items-center justify-center w-full md:w-fit gap-2">
					<AppSideCalendar />
					<AppSideHistorySummary />
				</div>
			</div>
		</div>
	);
};

export default layout;
