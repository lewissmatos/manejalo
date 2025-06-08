"use client";
import * as React from "react";

import { cn } from "@/lib/utils";
import { Button } from "./button";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip";
import { useTranslations } from "next-intl";

function PasswordInput({ className, ...props }: React.ComponentProps<"input">) {
	const [isPasswordVisible, setIsPasswordVisible] = React.useState(false);
	const t = useTranslations("ui");
	return (
		<div className="flex flex-row gap-1">
			<input
				type={isPasswordVisible ? "text" : "password"}
				data-slot="input"
				className={cn(
					"file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
					"focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
					"aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
					className
				)}
				{...props}
			/>
			<Tooltip>
				<TooltipTrigger
					onClick={(e) => {
						e.preventDefault();
						e.stopPropagation();
						setIsPasswordVisible(!isPasswordVisible);
					}}
				>
					<div className="ml-2">
						{isPasswordVisible ? (
							<EyeOffIcon className="h-4 w-4" />
						) : (
							<EyeIcon className="h-4 w-4" />
						)}
					</div>
				</TooltipTrigger>
				<TooltipContent>
					{isPasswordVisible ? t("hidePassword") : t("showPassword")}
				</TooltipContent>
			</Tooltip>
		</div>
	);
}

export { PasswordInput };
