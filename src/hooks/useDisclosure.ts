import React from "react";

export const useDisclosure = (isDefaultOpen = false) => {
	const [isOpen, setIsOpen] = React.useState(isDefaultOpen);

	const onOpenChange = (open: boolean) => {
		setIsOpen(open);
	};

	const onOpen = () => {
		setIsOpen(true);
	};

	const onClose = () => {
		setIsOpen(false);
	};

	return {
		isOpen,
		onOpenChange,
		onOpen,
		onClose,
	};
};
