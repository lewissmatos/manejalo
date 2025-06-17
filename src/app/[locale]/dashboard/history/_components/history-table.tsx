"use client";
import React from "react";
import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableFooter,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	BudgetAmountRegistration,
	BudgetAmountType,
	BudgetCategory,
} from "@/generated/prisma";
import { format } from "date-fns";
import { formatCurrency } from "@/lib/formatters";
import { useTranslations } from "next-intl";

type Props = {
	data: Array<BudgetAmountRegistration & { budgetCategory: BudgetCategory }>;
	totalAmount: number;
};
const HistoryTable = ({ data, totalAmount }: Props) => {
	const t = useTranslations();
	return (
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead className="w-[100px]">{t("common.category")}</TableHead>
					<TableHead>{t("common.details")}</TableHead>
					<TableHead>{t("common.date")}</TableHead>
					<TableHead className="text-right">{t("common.amount")}</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{data.map((item) => (
					<TableRow key={item.id}>
						<TableCell className="font-medium">
							{item.budgetCategory?.name}
						</TableCell>
						<TableCell className="w-72">{item.details}</TableCell>
						<TableCell>{format(item.correspondingDate, "PPP")}</TableCell>
						<TableCell
							className={`text-right ${
								item.type === BudgetAmountType.EXPENSE
									? "text-primary"
									: "text-green-500 font-semibold"
							}`}
						>
							{item.type === BudgetAmountType.EXPENSE
								? `${formatCurrency(item.amount)}`
								: `+${formatCurrency(Math.abs(item.amount))}`}
						</TableCell>
					</TableRow>
				))}
			</TableBody>
			<TableFooter>
				<TableRow>
					<TableCell colSpan={3}>Total</TableCell>
					<TableCell className="text-right">
						{formatCurrency(totalAmount)}
					</TableCell>
				</TableRow>
			</TableFooter>
		</Table>
	);
};

export default HistoryTable;
