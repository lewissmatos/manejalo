import { Loader2Icon } from "lucide-react";
import { useTranslations } from "next-intl";
import React from "react";

const loading = () => {
	const t = useTranslations();
	return (
		<div className="flex w-screen flex-col p-4 h-screen items-center justify-center gap-4 ">
			<p className="text-2xl text-primary">{t("common.loading")}</p>
			<Loader2Icon className="animate-spin text-primary ml-2" size={36} />
		</div>
	);
};

export default loading;
