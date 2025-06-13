"use client";

import { selectedDateAtom } from "@/lib/jotai/app-filters-atoms";
import { format } from "date-fns";
import { useAtomValue } from "jotai/react";
import { useLocale, useTranslations } from "next-intl";
import React from "react";
import { locales } from "./app-side-calendar";

const CurrentFormattedDate = () => {
	const date = useAtomValue(selectedDateAtom);
	const locale = useLocale();
	const t = useTranslations("ui");

	const formattedDate = format(date || new Date(), "PPP", {
		locale: locales[locale as keyof typeof locales] || locales.es,
	});

	return (
		<div className="text-xl font-semibold text-primary">
			{t("selectedDateWithValue", {
				date: formattedDate,
			})}
		</div>
	);
};

export default CurrentFormattedDate;
