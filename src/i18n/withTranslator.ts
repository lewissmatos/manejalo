// lib/i18n/withTranslator.ts
import { createTranslator, NamespaceKeys } from "next-intl";
import messages_es from "../../messages/es.json";
import messages_en from "../../messages/en.json";

const messageMap = {
	en: messages_en,
	es: messages_es,
};

export async function withTranslator(req: Request, namespace: string = "") {
	const localeFromHeader = req.headers.get("accept-language") || "en";
	const locale = localeFromHeader.split(",")[0].trim();

	const messages = messageMap[locale as keyof typeof messageMap] ?? messages_es;

	const t = await createTranslator({
		locale,
		messages,
		namespace: namespace as any,
	});

	return {
		t: t as any as (
			keys: string,
			replaceableParams?: Record<string, any>
		) => string,
		locale,
	};
}
