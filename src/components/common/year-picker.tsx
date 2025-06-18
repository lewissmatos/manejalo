"use client";

import React, { useEffect, useTransition } from "react";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Label } from "../ui/label";
import { useTranslations } from "next-intl";
import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { Loader2Icon } from "lucide-react";

type Props = {
	defaultYear: number | string;
	yearsInThePast?: number;
	refresh?: () => void;
};
const YearPicker = ({ defaultYear, yearsInThePast = 10, refresh }: Props) => {
	const t = useTranslations();
	const [isPending, startTransition] = useTransition();

	const searchParams = useSearchParams();
	const { replace } = useRouter();
	const pathname = usePathname();

	const yearFromUrl = searchParams.get("year");

	useEffect(() => {
		if (!yearFromUrl) {
			const params = new URLSearchParams(searchParams.toString());
			params.set("year", String(defaultYear));
			replace(`${pathname}?${params.toString()}`);
		}
	}, [yearFromUrl, defaultYear, pathname, replace, searchParams]);

	const handleSetYear = async (year: number) => {
		startTransition(async () => {
			const params = new URLSearchParams(searchParams.toString());
			params.set("year", year.toString());
			replace(`${pathname}?${params.toString()}`);
			await refresh?.();
		});
	};

	return (
		<div className="grid">
			<Label>{t("common.year")}</Label>
			<Select
				onValueChange={(value) => {
					handleSetYear(Number(value));
				}}
				disabled={isPending}
				defaultValue={
					yearFromUrl
						? String(yearFromUrl)
						: String(defaultYear) || new Date().getFullYear().toString()
				}
			>
				<SelectTrigger className="w-32 bg-background text-foreground">
					<SelectValue />
					{isPending ? <Loader2Icon className="animate-spin" /> : null}
				</SelectTrigger>
				<SelectContent>
					{Array.from({ length: yearsInThePast }, (_, i) =>
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
