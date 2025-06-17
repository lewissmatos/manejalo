import React from "react";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Label } from "../ui/label";
import { useTranslations } from "next-intl";

type Props = {
	defaultYear: number | string;
	yearInThePast?: number;
	setYear: (year: number) => void;
};
const YearPicker = ({ defaultYear, yearInThePast = 10, setYear }: Props) => {
	const t = useTranslations();
	return (
		<div className="grid gap-3">
			<Label>{t("common.year")}</Label>
			<Select
				onValueChange={(value) => {
					setYear(Number(value));
				}}
				defaultValue={String(defaultYear)}
			>
				<SelectTrigger className="w-32 bg-background text-foreground">
					<SelectValue />
				</SelectTrigger>
				<SelectContent>
					{Array.from({ length: yearInThePast }, (_, i) =>
						String(new Date().getFullYear() - 9 + i)
					).map((year) => (
						<SelectItem key={year} value={year} className="flex items-center">
							<span className="text-lg">{year}</span>
						</SelectItem>
					))}
				</SelectContent>
			</Select>
		</div>
	);
};

export default YearPicker;
