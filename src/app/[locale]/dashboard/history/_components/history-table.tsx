"use client";
import React from "react";
import {
	Table,
	TableBody,
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
import { MessageCircle } from "lucide-react";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";

type Props = {
	data: Array<BudgetAmountRegistration & { budgetCategory: BudgetCategory }>;
	totalAmount: number;
};
const HistoryTable = ({ data, totalAmount }: Props) => {
	const t = useTranslations();
	return (
		<section className="rounded-md w-full flex flex-col gap-1">
			<h2 className="text-lg font-semibold text-primary">
				{t("HistoryPage.HistoryTable.title")}
			</h2>
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead className="w-[100px]">{t("common.category")}</TableHead>
						<TableHead className="w-[100px]">{t("common.details")}</TableHead>
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
							<TableCell className="w-24 flex items-center justify-center">
								{item.details ? (
									<Tooltip>
										<TooltipTrigger>
											<MessageCircle />
										</TooltipTrigger>
										<TooltipContent>
											<div className="max-w-80 text-lg">{item.details}</div>
										</TooltipContent>
									</Tooltip>
								) : null}
							</TableCell>
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
		</section>
	);
};

export default HistoryTable;
