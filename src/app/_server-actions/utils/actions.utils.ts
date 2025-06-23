import { getTranslations } from "next-intl/server";

export type ResponseModel<T> = {
	data: T | null;
	message: string;
	isSuccess: boolean;
};

type ServerActionResponseHandlerOptions = {
	translationsPath?: string;
	successMessageKey?: string;
	errorMessageKey?: string;
};
export const serverActionResponseHandler = async <T>(
	action: () => Promise<T>,
	{
		translationsPath,
		successMessageKey,
		errorMessageKey,
	}: ServerActionResponseHandlerOptions = {}
): Promise<ResponseModel<T>> => {
	const t = await getTranslations(translationsPath);
	try {
		const data = await action();

		return {
			data,
			message: successMessageKey ? t(successMessageKey) : "",
			isSuccess: true,
		};
	} catch (error) {
		console.error("Error: ", error);
		return {
			data: null,
			message: errorMessageKey
				? t(errorMessageKey)
				: error instanceof Error
				? t(error.message)
				: "An unexpected error occurred.",
			isSuccess: false,
		};
	}
};
