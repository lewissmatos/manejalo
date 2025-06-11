import { getTranslations } from "next-intl/server";
import React from "react";
import contacts from "@/lib/constants/contacts-info.json";
import { ExternalLink } from "lucide-react";
const HomePageFooter = async () => {
	const t = await getTranslations("HomePageFooter");
	return (
		<footer className="bg-secondary/30 w-full h-fit p-4">
			<div className="max-w-5xl mx-auto px-4 h-full flex items-center justify-between flex-col gap-2">
				<p className="text-lg font-semibold text-primary">
					{t("top", {
						year: new Date().getFullYear(),
						appName: "Manejalo!",
					})}
				</p>
				<div className="flex flex-col items-center justify-between">
					<p className="text-md text-primary/60">{t("contacts")}:</p>
					<div className="flex flex-wrap md:flex-row items-center gap-4">
						{contacts.map((contact) => (
							<a
								key={contact.label}
								href={contact.href}
								target="_blank"
								rel="noopener noreferrer"
								className="flex flex-row items-center gap-1 hover:underline hover:text-primary text-primary/80 transition-all duration-200"
							>
								<span>{contact.label}</span>
								<ExternalLink size={14} />
							</a>
						))}
					</div>
				</div>
				<p className="text-md text-primary">
					{t("bottom", {
						developerName: "Lewis Matos",
					})}
				</p>
			</div>
		</footer>
	);
};

export default HomePageFooter;
