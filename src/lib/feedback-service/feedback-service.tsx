import { toast } from "sonner";

const feedbackService = () => {
	const send = ({
		type,
		message,
	}: {
		type: "error" | "info" | "success";
		message: string;
	}) => {
		switch (type) {
			case "error":
				toast.error(message);
				break;
			case "info":
				toast.info(message);
				break;
			case "success":
				toast.success(message);
				break;
			default:
				toast(message);
		}
	};
	return { send };
};

export default feedbackService;
