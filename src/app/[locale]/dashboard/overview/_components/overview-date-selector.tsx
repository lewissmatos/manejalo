"use client";

import { Calendar } from "@/components/ui/calendar";
import { selectedDateAtom } from "@/lib/jotai/app-filters-atoms";
import { useAtom } from "jotai/react";
import React, { useEffect, useState, useTransition } from "react";
import { useLocale, useTranslations } from "next-intl";
import { es, enUS } from "date-fns/locale";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { differenceInCalendarDays, format, startOfMonth } from "date-fns";
import { Label } from "@/components/ui/label";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { ChevronDownIcon } from "lucide-react";

export const locales = {
	en: enUS,
	es: es,
};

const OverviewDateSelector = () => {
	const t = useTranslations();
	const [date, setSelectedDate] = useAtom(selectedDateAtom);
	const [open, setOpen] = React.useState(false);
	const [visibleMonth, setVisibleMonth] = useState<Date>(date || new Date());
	const searchParams = useSearchParams();
	const locale = useLocale();
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

	const formattedDate = format(date || new Date(), "PPP", {
		locale: locales[locale as keyof typeof locales] || locales.es,
	});
	return (
		<div>
			<div className="flex flex-col gap-3">
				<Label htmlFor="date" className="px-1">
					{t("OverviewPage.selectDate")}
				</Label>
				<Popover open={open} onOpenChange={setOpen}>
					<PopoverTrigger asChild>
						<Button
							variant="outline"
							id="date"
							className="w-48 justify-between font-normal"
						>
							{date ? format(date, "PPP") : "Select date"}
							<ChevronDownIcon />
						</Button>
					</PopoverTrigger>
					<PopoverContent className="w-auto overflow-hidden p-0" align="start">
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
					</PopoverContent>
				</Popover>
			</div>
		</div>
	);
};

export default OverviewDateSelector;
