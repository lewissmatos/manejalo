export type ResponseModel<T> = {
	data: T | null;
	message: string;
	isSuccess: boolean;
};
