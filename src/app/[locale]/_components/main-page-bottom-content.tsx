"use client";

import { Button } from "@/components/ui/button";
import { authAtom } from "@/lib/jotai/auth-atom";
import { useAtomValue } from "jotai/react";
import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import React from "react";

const LoginDialog = React.lazy(() => import("@/app/_components/login-dialog"));
const SignUpDialog = React.lazy(
	() => import("@/app/_components/sign-up-dialog")
);
const MainPageBottomContent = () => {
	const { isAuthenticated } = useAtomValue(authAtom);
	return (
		<>
			{isAuthenticated ? (
				<AuthenticatedBottomContent />
			) : (
				<UnauthenticatedBottomContent />
			)}
		</>
	);
};

const AuthenticatedBottomContent = () => {
	const t = useTranslations("HomePage");
	const { profile } = useAtomValue(authAtom);
	const router = useRouter();

	return (
		<div className="flex flex-col items-center">
			<Button
				variant="default"
				size="lg"
				onClick={() => router.push("/dashboard")}
				disabled={!profile}
				className="text-xl p-4 rounded-lg "
			>
				{`${t("authState.loggedIn")} ${profile?.fullName?.split(" ")?.[0]}`}{" "}
				{/* Replace NAME with actual user name */}
				<ArrowRight className="animate-pulse" />
			</Button>
			<LoginDialog
				dialogTrigger={
					<Button variant="link" size="lg" className="p-1">
						{t("authState.switchAccountAlt")}
					</Button>
				}
			/>
		</div>
	);
};

const UnauthenticatedBottomContent = () => {
	const t = useTranslations("HomePage");
	return (
		<div className="flex flex-col items-center gap-4">
			<LoginDialog />
			<span>
				{t("authState.signUpAlt")}:
				<SignUpDialog />
			</span>
		</div>
	);
};

export default MainPageBottomContent;
