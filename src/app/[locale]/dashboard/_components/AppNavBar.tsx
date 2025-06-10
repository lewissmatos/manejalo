"use client";

import {
	NavigationMenu,
	NavigationMenuContent,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	NavigationMenuTrigger,
	navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { LogOut } from "lucide-react";
import { useAtom, useAtomValue } from "jotai/react";
import { authAtom, logoutAtom } from "@/lib/jotai/auth-atom";
import { useRouter } from "next/navigation";
import { logout } from "@/app/server-actions/(auth)/actions";
import { useMemo } from "react";

const navItems = [
	{
		titleKey: "overview",
		href: "/dashboard/overview",
	},
	{
		titleKey: "myBudget",
		href: "/dashboard/my-budget",
	},
	{
		titleKey: "history",
		href: "/dashboard/history",
	},
];
export default function AppNavBar() {
	const t = useTranslations("AppNavBar");
	const [, onLogout] = useAtom(logoutAtom);

	const profile = useAtomValue(authAtom).profile;
	const userName = useMemo(() => {
		if (profile) {
			return (
				profile?.fullName?.split(" ")?.[0] ||
				profile?.email?.split("@")?.[0] ||
				null
			);
		}
		return null;
	}, [profile]);
	const router = useRouter();
	return (
		<NavigationMenu
			className="border-1 border-background-200 shadow-sm rounded-md justify-end z-30"
			viewport={false}
		>
			<NavigationMenuList className="flex justify-end items-center gap-4 px-4 py-1">
				{navItems.map((item) => (
					<NavigationMenuItem key={item.titleKey}>
						<NavigationMenuLink
							asChild
							className={navigationMenuTriggerStyle()}
						>
							<Link href={item.href}>
								{t(`navigationItems.${item.titleKey}`)}
							</Link>
						</NavigationMenuLink>
					</NavigationMenuItem>
				))}
				<NavigationMenuItem>
					<NavigationMenuTrigger>
						{userName || t("navigationItems.profile")}
					</NavigationMenuTrigger>
					<NavigationMenuContent>
						<Button
							variant="ghost"
							onClick={async () => {
								// remove the global state auth info
								await onLogout();
								// call the logout server action and remove the cookie
								await logout();
								router.push("/");
							}}
						>
							{t("logout")}

							<LogOut />
						</Button>
					</NavigationMenuContent>
				</NavigationMenuItem>
			</NavigationMenuList>
		</NavigationMenu>
	);
}

function ListItem({
	title,
	children,
	href,
	...props
}: React.ComponentPropsWithoutRef<"li"> & { href: string }) {
	return (
		<li {...props}>
			<NavigationMenuLink asChild className="bg-red-500">
				<Link href={href}>
					<div className="text-sm leading-none font-medium">{title}</div>
					<p className="text-muted-foreground line-clamp-2 text-sm leading-snug">
						{children}
					</p>
				</Link>
			</NavigationMenuLink>
		</li>
	);
}
