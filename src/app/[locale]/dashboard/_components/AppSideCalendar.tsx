"use client";

import { Calendar } from "@/components/ui/calendar";
import {
	appFiltersAtom,
	setSelectedDateAtom,
} from "@/lib/jotai/app-filters-atoms";
import { useAtom, useAtomValue } from "jotai/react";
import React from "react";

const AppSideCalendar = () => {
	const [date, setSelectedDate] = useAtom(setSelectedDateAtom);

	return (
		<Calendar
			mode="single"
			selected={date || new Date()}
			onSelect={(date) => {
				setSelectedDate(date || new Date());
			}}
			className="rounded-md border shadow-sm"
			captionLayout="dropdown"
		/>
	);
};

export default AppSideCalendar;
