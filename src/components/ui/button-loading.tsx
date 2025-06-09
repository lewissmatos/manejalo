import { Loader2Icon } from "lucide-react";

import { Button } from "@/components/ui/button";

export function ButtonLoading({
	isLoading = false,
	children,
	...rest
}: {
	isLoading?: boolean;
} & React.ComponentProps<typeof Button>) {
	return (
		<Button {...rest} disabled={rest.disabled || isLoading}>
			{children}
			{isLoading ? <Loader2Icon className="animate-spin" /> : null}
		</Button>
	);
}
