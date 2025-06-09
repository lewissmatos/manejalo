import { useTranslations } from "next-intl";
import React from "react";

const MyBudget = () => {
	const t = useTranslations("HomePage");
	return (
		<div>
			<h1 className="text-2xl font-bold">{t("slogan")}</h1>
		</div>
	);
};

export default MyBudget;
