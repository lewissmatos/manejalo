import React from "react";

import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/formatters";
import { PenIcon } from "lucide-react";
import { MonthlyIncome } from "@/generated/prisma";

const MonthlyIncomeCard = ({
	description,
	amount,
}: Pick<MonthlyIncome, "description" | "amount">) => {
	return (
		<Card className="w-full md:w-72 p-2 max-w-sm h-24">
			<CardContent className="p-0 gap-1 flex flex-col">
				<CardTitle>{description}</CardTitle>
				<CardFooter className="flex flex-row gap-2 items-start p-0 mt-2 justify-between">
					<span className="text-xl text-primary font-semibold">
						{formatCurrency(amount)}
					</span>
					<Button variant="ghost" size={"sm"}>
						<PenIcon />
					</Button>
				</CardFooter>
			</CardContent>
		</Card>
	);
};

export default MonthlyIncomeCard;
