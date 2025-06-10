"use client";
import React, { useTransition } from "react";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Locale, useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";

export const langs = {
	en: "English",
	es: "Español",
};
const LanguageSelector = () => {
	const t = useTranslations("LanguageSelector");
	const [, startTransition] = useTransition();
	const locale = useLocale();
	const router = useRouter();
	const handleChange = async (value: Locale) => {
		startTransition(() => {
			document.cookie = `NEXT_LOCALE=${value}; path=/; max-age=31536000; samesite=strict; secure`;
			router.refresh();
		});
	};

	return (
		<Select
			defaultValue={langs[locale as keyof typeof langs] || "es"}
			value={locale as Locale}
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
