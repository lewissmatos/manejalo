import React from "react";

import {
	Card,
	CardContent,
	CardDescription,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getTranslations } from "next-intl/server";

type Props = {
	title: string;
	description?: string;
};
const RecommendedCategoryCard = async ({ title, description }: Props) => {
	const t = await getTranslations("MyBudget.RecommendedCategories.Card");
	return (
		<Card className="w-full md:w-72 p-2 max-w-sm">
			<CardContent className="p-0">
				<CardTitle>{title}</CardTitle>
				<CardDescription>{description}</CardDescription>
				<div className="flex justify-end">
					<Button variant="default" size={"sm"} className="w-full mt-2">
						{t("actionTitle")}
					</Button>
				</div>
			</CardContent>
		</Card>
	);
};

export default RecommendedCategoryCard;
