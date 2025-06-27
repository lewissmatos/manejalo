"use client";
import * as React from "react";

import { cn } from "@/lib/utils";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip";
import { useTranslations } from "next-intl";
import { Input } from "./input";

function PasswordInput({ className, ...props }: React.ComponentProps<"input">) {
	const [isPasswordVisible, setIsPasswordVisible] = React.useState(false);
	const t = useTranslations("ui");

	return (
		<div className="relative w-full">
			<Input
				type={isPasswordVisible ? "text" : "password"}
				className={cn("pr-10", className)} // add padding to the right for the icon
				{...props}
			/>
			<Tooltip>
				<TooltipTrigger asChild>
					<button
						type="button"
						onClick={() => setIsPasswordVisible(!isPasswordVisible)}
						className="absolute inset-y-0 right-2 flex items-center text-muted-foreground"
					>
						{isPasswordVisible ? (
							<EyeOffIcon className="h-4 w-4" />
						) : (
							<EyeIcon className="h-4 w-4" />
						)}
					</button>
				</TooltipTrigger>
				<TooltipContent>
					{isPasswordVisible ? t("hidePassword") : t("showPassword")}
				</TooltipContent>
			</Tooltip>
		</div>
	);
}

export { PasswordInput };
