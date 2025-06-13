"use client";

import { Calendar } from "@/components/ui/calendar";
import { selectedDateAtom } from "@/lib/jotai/app-filters-atoms";
import { useAtom } from "jotai/react";
import React from "react";
import { useLocale } from "next-intl";
import { es, enUS } from "date-fns/locale";

export const locales = {
	en: enUS,
	es: es,
};

const AppSideCalendar = () => {
	const [date, setSelectedDate] = useAtom(selectedDateAtom);
	const locale = useLocale();

	return (
		<Calendar
			mode="single"
			selected={date || new Date()}
			onSelect={(date) => {
				setSelectedDate(date || new Date());
			}}
			locale={locales[locale as keyof typeof locales] || locales.en}
			className="rounded-md border shadow-sm w-64"
			captionLayout="dropdown"
			disabled={(date) => date > new Date()}
		/>
	);
};

export default AppSideCalendar;
