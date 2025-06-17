import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

const loading = () => {
	return (
		<div className="h-calculate(100vh - 64px) gap-4 w-full">
			<Skeleton className="h-8 w-48 mb-2" />
			<Skeleton className="h-6 w-[12rem] mb-8" />
			<div className="flex flex-row items-start justify-start gap-4 mt-2">
				<div className="w-5/12">
					{Array.from({ length: 17 }, (_, i) => {
						return <Skeleton key={i} className="h-7 w-full mb-2" />;
					})}
				</div>
				<div className="w-7/12 flex flex-col gap-2 justify-start">
					<Skeleton className="h-24 w-96 mb-2" />
					<Skeleton className="h-36 w-full mb-2" />
					<div className="flex flex-row items-start justify-start w-full gap-2">
						<Skeleton className="h-[340px] w-[650px] mb-2" />
						<Skeleton className="h-32 w-44 mb-2" />
					</div>
				</div>
			</div>
		</div>
	);
};

export default loading;
