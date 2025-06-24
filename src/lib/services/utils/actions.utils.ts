export type ResponseModel<T> = {
	data: T | null;
	message: string;
	isSuccess: boolean;
};

type ServerActionResponseHandlerOptions = {
	successMessage?: string;
	errorMessage?: string;
	translator?: (key: string, params?: Record<string, any>) => string;
};

export const serviceResponseHandler = async <T>(
	action: () => Promise<T>,
	{
		successMessage = "",
		errorMessage,
		translator,
	}: ServerActionResponseHandlerOptions = {}
): Promise<ResponseModel<T>> => {
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
