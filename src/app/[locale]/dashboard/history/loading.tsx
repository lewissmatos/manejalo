import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

const loading = () => {
	return (
		<div className="h-calculate(100vh - 64px) gap-4 w-full">
			<Skeleton className="h-8 w-48 mb-2" />
			<Skeleton className="h-6 w-[16rem] mb-8" />
			<div className="flex flex-row items-start justify-start gap-8 mt-2">
				<div className="w-1/3">
					{Array.from({ length: 17 }, (_, i) => {
						return <Skeleton key={i} className="h-7 w-full mb-2" />;
					})}
				</div>
				<div className="w-2/3 flex flex-col gap-2 justify-start">
					<div className="flex flex-row items-start justify-between w-full gap-2">
						<div className="flex flex-col gap-1 w-full">
							<Skeleton className="h-4 w-16 mb-2" />
							<Skeleton className="h-8 w-32 mb-2" />
						</div>
						<Skeleton className="h-20 w-96 mb-2" />
					</div>
					<Skeleton className="h-4 w-72 mb-2" />
					<Skeleton className="h-36 w-full mb-2" />
					<div className="flex flex-row items-start justify-start w-full gap-2">
						<Skeleton className="h-[340px] w-full mb-2" />
						<Skeleton className="h-40 w-52 mb-2" />
					</div>
				</div>
			</div>
		</div>
	);
};

export default loading;
