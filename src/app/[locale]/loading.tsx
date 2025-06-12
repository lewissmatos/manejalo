import { Loader2Icon } from "lucide-react";
import { useTranslations } from "next-intl";
import React from "react";

const Loading = () => {
	const t = useTranslations();
	return (
		<div className="flex flex-col p-4 w-36 h-42 items-center justify-center gap-4 ">
			<p className="text-md text-primary">{t("common.loading")}</p>
			<Loader2Icon className="animate-spin text-primary ml-2" size={30} />
		</div>
	);
};

export default Loading;
