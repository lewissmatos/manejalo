"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "./input";

type Props = {
	className?: string;
	onChangeDate?: (date: Date | undefined) => void;
	defaultDate?: Date;
};
export function DatePicker({ defaultDate = new Date(), onChangeDate }: Props) {
	const [date, setDate] = React.useState<Date>(
		defaultDate instanceof Date ? defaultDate : new Date()
	);

	return (
		<div className="flex flex-col gap-3">
			<div className="relative flex gap-2">
				<Input
					id="date"
					value={date instanceof Date ? format(date, "dd/MM/yyyy") : ""}
					placeholder="June 01, 2025"
					className="bg-background pr-10"
					onChange={(e) => {
						const date = new Date(e.target.value);
						setDate(date || new Date());
					}}
					readOnly
				/>
				<Popover>
					<PopoverTrigger asChild>
						<Button
							id="date-picker"
							variant="ghost"
							className="absolute top-1/2 right-2 size-6 -translate-y-1/2"
						>
							<CalendarIcon className="size-3.5" />
							<span className="sr-only">Select date</span>
						</Button>
					</PopoverTrigger>
					<PopoverContent
						className="w-auto overflow-hidden p-0"
						align="end"
						alignOffset={-8}
						sideOffset={10}
					>
						<Calendar
							mode="single"
							selected={date}
							captionLayout="dropdown"
							onSelect={(selectedDate) => {
								setDate(selectedDate || new Date());
								onChangeDate?.(selectedDate);
							}}
						/>
					</PopoverContent>
				</Popover>
			</div>
		</div>
	);
}
