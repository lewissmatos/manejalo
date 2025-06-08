"use client";
import React from "react";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "./ui/select";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
const langs = {
	en: "English",
	es: "Español",
};
const LanguageSelector = () => {
	const t = useTranslations("LanguageSelector");
	const locale = useLocale();
	const router = useRouter();
	const pathname = usePathname();
	const handleChange = (value: "en" | "es") => {
		const segments = pathname.split("/");
		if (Object.keys(langs).includes(segments[1])) {
			segments[1] = value;
		} else {
			segments.splice(1, 0, value);
		}
		const newPath = segments.join("/") || "/";
		router.push(newPath);
	};

	return (
		<Select
			defaultValue={langs[locale as keyof typeof langs] || "es"}
			value={locale as "en" | "es"}
			onValueChange={handleChange}
		>
			<SelectTrigger className="w-32 bg-background text-foreground">
				<SelectValue placeholder={t("label")} />
			</SelectTrigger>
			<SelectContent>
				{Object.entries(langs).map(([key, value]) => (
					<SelectItem key={key} value={key}>
						{value}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
};

export default LanguageSelector;
