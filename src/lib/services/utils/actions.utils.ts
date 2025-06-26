import { getSession } from "@/middleware";

export type ResponseModel<T> = {
	data: T | null;
	message: string;
	isSuccess: boolean;
};

type ServerActionResponseHandlerOptions = {
	successMessage?: string;
	errorMessage?: string;
	translator?: (key: string, params?: Record<string, any>) => string;
	disableMiddleware?: boolean;
};

export const serviceResponseHandler = async <T>(
	action: () => Promise<T>,
	{
		successMessage = "",
		errorMessage,
		translator,
		disableMiddleware = false,
	}: ServerActionResponseHandlerOptions = {}
): Promise<ResponseModel<T>> => {
	if (!disableMiddleware) {
		const { isAuthenticated } = (await getSession()) || {};
		if (!isAuthenticated) {
			return {
				data: null,
				message: "You must be logged in to perform this action",
				isSuccess: false,
			};
		}
	}
	try {
		const data = await action();

		return {
			data,
			message: successMessage,
			isSuccess: true,
		};
	} catch (error: any) {
		console.error("Error: ", error);

		const errorOutput =
			(error instanceof Error
				? error.message
				: Boolean(error)
				? translator?.(error)
				: errorMessage) || "An error occurred";

		return {
			data: null,
			message: errorOutput,
			isSuccess: false,
		};
	}
};
