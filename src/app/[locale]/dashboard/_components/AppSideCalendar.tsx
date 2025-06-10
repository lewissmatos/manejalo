"use client";

import { Calendar } from "@/components/ui/calendar";
import { setSelectedDateAtom } from "@/lib/jotai/app-filters-atoms";
import { useAtom, useAtomValue } from "jotai/react";
import React, { useEffect } from "react";
import { useLocale } from "next-intl";
import { es, enUS } from "date-fns/locale";

export const locales = {
	en: enUS,
	es,
};

const AppSideCalendar = () => {
	const [date, setSelectedDate] = useAtom(setSelectedDateAtom);
	const locale = useLocale();

	return (
		<Calendar
			mode="single"
			selected={date || new Date()}
			onSelect={(date) => {
				setSelectedDate(date || new Date());
			}}
			locale={locales[locale as keyof typeof locales] || locales.en}
			className="rounded-md border shadow-sm w-full"
			captionLayout="dropdown"
		/>
	);
};

export default AppSideCalendar;
