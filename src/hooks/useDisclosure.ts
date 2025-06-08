import React from "react";

export const useDisclosure = () => {
	const [isOpen, setIsOpen] = React.useState(false);

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
