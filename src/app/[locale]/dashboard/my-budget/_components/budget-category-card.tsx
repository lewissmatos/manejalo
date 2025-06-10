import React from "react";

import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getTranslations } from "next-intl/server";
import { formatCurrency } from "@/lib/formatters";
import { CircleMinus } from "lucide-react";

type Props = {
	title: string;
	description?: string;
	estimation: number;
};
const BudgetItemCard = async ({ title, description, estimation }: Props) => {
	const t = await getTranslations("MyBudget.RecommendedCategories.Card");
	return (
		<Card className="w-full md:w-72 p-2 max-w-sm">
			<CardContent className="p-0 gap-1 flex flex-col">
				<CardTitle>{title}</CardTitle>
				<CardDescription>{description}</CardDescription>
				<CardFooter className="flex flex-row gap-2 items-start p-0 mt-2 justify-between">
					<span className="text-xl text-primary font-semibold">
						{formatCurrency(estimation)}
					</span>
					<Button
						variant="ghost"
						size={"sm"}
						className="text-red-500 hover:bg-red-100"
					>
						<CircleMinus />
					</Button>
				</CardFooter>
			</CardContent>
		</Card>
	);
};

export default BudgetItemCard;
