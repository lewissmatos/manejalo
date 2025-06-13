"use client";

import { Calendar } from "@/components/ui/calendar";
import { selectedDateAtom } from "@/lib/jotai/app-filters-atoms";
import { useAtom } from "jotai/react";
import React, { useEffect, useState, useTransition } from "react";
import { useLocale } from "next-intl";
import { es, enUS } from "date-fns/locale";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
	differenceInCalendarDays,
	endOfMonth,
	format,
	parseISO,
	startOfMonth,
	subDays,
} from "date-fns";

export const locales = {
	en: enUS,
	es: es,
};

const AppSideCalendar = () => {
	const [date, setSelectedDate] = useAtom(selectedDateAtom);
	const [visibleMonth, setVisibleMonth] = useState<Date>(date || new Date());
	const locale = useLocale();
	const searchParams = useSearchParams();
	const [isPending, startTransition] = useTransition();
	const pathname = usePathname();
	const { replace } = useRouter();

	const selectedDateParam = searchParams.get("selected_date");

	useEffect(() => {
		if (!selectedDateParam) {
			const params = new URLSearchParams(searchParams.toString());
			params.set("selected_date", format(date || new Date(), "yyyy-MM-dd"));
			replace(`${pathname}?${params.toString()}`);
		}
	}, [selectedDateParam, pathname, replace, date]);

	// Update visibleMonth when date changes (e.g., after selecting a date)
	useEffect(() => {
		if (date) setVisibleMonth(date);
	}, [date]);

	const handleSetDate = (date: Date | undefined) => {
		startTransition(() => {
			const selectedDate = date || new Date();
			setSelectedDate(selectedDate);

			const params = new URLSearchParams(searchParams.toString());
			if (!selectedDate) {
				params.delete("selected_date");
			} else {
				params.set("selected_date", format(selectedDate, "yyyy-MM-dd"));
			}
			replace(`${pathname}?${params.toString()}`);
		});
	};

	return (
		<Calendar
			mode="single"
			selected={date || new Date()}
			month={visibleMonth}
			onMonthChange={setVisibleMonth}
			onSelect={(date) => {
				handleSetDate(date || new Date());
			}}
			locale={locales[locale as keyof typeof locales] || locales.en}
			className="rounded-md border shadow-sm w-64"
			captionLayout="dropdown"
			disabled={(date) =>
				isPending ||
				date > new Date() ||
				(new Date().getDate() <= 7
					? differenceInCalendarDays(new Date(), date) > 8 &&
					  startOfMonth(date) < startOfMonth(new Date())
					: startOfMonth(date) < startOfMonth(new Date()))
			}
		/>
	);
};

export default AppSideCalendar;
