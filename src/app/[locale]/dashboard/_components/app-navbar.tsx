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
import { useLocale, useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { LogOut, Menu, User, X } from "lucide-react";
import { useAtom } from "jotai/react";
import { logoutAtom } from "@/lib/jotai/auth-atom";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { logout } from "@/app/_server-actions/(auth)/actions";
import { useMemo, useState } from "react";
import LanguageSelector from "@/components/language/language-selector";
import { ThemeSelector } from "@/components/theme/theme-selector";
import { setDefaultOptions } from "date-fns";
import { enUS, es } from "date-fns/locale";
import { Profile } from "@/generated/prisma";

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

type Props = {
	profile: Profile | null;
};
export default function AppNavBar({ profile }: Props) {
	const t = useTranslations("AppNavBar");
	const searchParams = useSearchParams();
	const queryString = searchParams.toString();
	const [, onLogout] = useAtom(logoutAtom);
	const router = useRouter();
	const pathname = usePathname();
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
	const locale = useLocale();
	setDefaultOptions({
		locale: [es, enUS].find((l) => l.code.includes(locale)) || es,
	});

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

	const handleLogOut = async () => {
		await logout();
		router.push("/");
		await onLogout();
	};

	return (
		<nav className="px-4 py-2 flex justify-between items-center w-full ">
			<div className="flex items-center">
				<h1 className="text-2xl sm:text-4xl font-bold text-primary w-auto sm:w-1/5">
					Manejalo!
				</h1>
			</div>
			{/* Desktop Navigation */}
			<div className="hidden md:flex flex-1 justify-center ">
				<NavigationMenu
					className="border-1 border-background-200 shadow-sm rounded-md justify-end z-30 bg-background"
					viewport={false}
				>
					<NavigationMenuList className="flex justify-end items-center gap-4 p-1">
						{navItems.map((item) => {
							const isSelected = pathname?.includes(item.href);
							return (
								<NavigationMenuItem key={item.titleKey}>
									<NavigationMenuLink
										asChild
										className={`${navigationMenuTriggerStyle()} ${
											isSelected ? "bg-muted text-foreground" : ""
										}`}
									>
										<Link href={item.href}>
											{t(`navigationItems.${item.titleKey}`)}
										</Link>
									</NavigationMenuLink>
								</NavigationMenuItem>
							);
						})}
						<NavigationMenuItem>
							<NavigationMenuTrigger
								className={`${navigationMenuTriggerStyle()} ${
									pathname?.includes("profile")
										? "bg-accent text-accent-foreground"
										: ""
								}`}
								onClick={(e) => {
									e.preventDefault();
									const profileHref = queryString
										? `/dashboard/profile?${queryString}`
										: "/dashboard/profile";
									router.push(profileHref);
								}}
							>
								{userName || t("navigationItems.profile")}
							</NavigationMenuTrigger>
							<NavigationMenuContent>
								<Button
									variant="ghost"
									onClick={() => {
										const profileHref = queryString
											? `/dashboard/profile?${queryString}`
											: "/dashboard/profile";
										router.push(profileHref);
									}}
									className="w-full justify-between"
								>
									{t("profile")}
									<User className="ml-2" />
								</Button>
								<Button
									variant="ghost"
									onClick={handleLogOut}
									className="w-full justify-between"
								>
									{t("logout")}
									<LogOut />
								</Button>
							</NavigationMenuContent>
						</NavigationMenuItem>
					</NavigationMenuList>
				</NavigationMenu>
			</div>
			{/* Mobile Hamburger */}
			<div className="md:hidden flex items-center justify-end">
				<Button
					className="p-2 rounded-md focus:outline-none"
					onClick={() => setMobileMenuOpen((v) => !v)}
					aria-label="Open menu"
					variant={"outline"}
				>
					<Menu size={28} />
				</Button>
			</div>
			{/* Theme/Language Selectors */}
			<div className=" items-center gap-2 w-auto justify-end hidden md:flex">
				<ThemeSelector />
				<LanguageSelector />
			</div>
			{/* Mobile Menu Drawer */}
			{mobileMenuOpen && (
				<div
					className="fixed inset-0 z-40 bg-black/40 md:hidden"
					onClick={() => setMobileMenuOpen(false)}
				>
					<div
						className="absolute top-0 right-0 w-3/4 max-w-xs bg-background shadow-lg h-full flex flex-col p-6 gap-4 justify-between"
						onClick={(e) => e.stopPropagation()}
					>
						<div className="flex flex-col gap-4">
							<Button
								variant="ghost"
								className="self-end mb-4"
								onClick={() => setMobileMenuOpen(false)}
								aria-label="Close menu"
							>
								<X size={24} />
							</Button>
							{navItems.map((item) => {
								return (
									<Link
										key={item.titleKey}
										href={item.href}
										className="py-2 text-lg font-medium"
										onClick={() => setMobileMenuOpen(false)}
									>
										{t(`navigationItems.${item.titleKey}`)}
									</Link>
								);
							})}
							<div className="border-t pt-4 mt-4">
								<Button
									variant="ghost"
									className="w-full justify-start"
									onClick={() => {
										router.push("/dashboard/profile");
									}}
								>
									{t("profile")}
									<User className="ml-2" />
								</Button>
								<Button
									variant="ghost"
									className="w-full justify-start"
									onClick={handleLogOut}
								>
									{t("logout")}
									<LogOut className="ml-2" />
								</Button>
							</div>
						</div>

						<div className="flex items-end gap-2 w-auto justify-end ">
							<ThemeSelector />
							<LanguageSelector />
						</div>
					</div>
				</div>
			)}
		</nav>
	);
}
