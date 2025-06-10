import React, { Suspense } from "react";
import Loading from "./loading";
import AppNavBar from "./_components/AppNavBar";
import AppSideCalendar from "./_components/AppSideCalendar";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

const layout = async ({ children }: { children: React.ReactNode }) => {
	const cookieStore = await cookies();
	const isAuthenticated =
		(await cookieStore.get("is-authenticated")?.value) === "true";

	if (!isAuthenticated) {
		redirect("/");
	}
	return (
		<div className="flex w-screen flex-col gap-2">
			<div className="p-4 flex justify-end">
				<AppNavBar />
			</div>
			<div className="w-screen flex flex-row gap-2 p-4">
				<div className="flex-1 overflow-hidden p-4">
					<Suspense fallback={<Loading />}>{children}</Suspense>
				</div>
				<div className="flex flex-col items-center justify-center">
					<AppSideCalendar />
				</div>
			</div>
		</div>
	);
};

export default layout;
