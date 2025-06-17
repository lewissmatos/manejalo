import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

const loading = () => {
	return (
		<div className="h-calculate(100vh - 64px) gap-4 w-full">
			<Skeleton className="h-8 w-48 mb-2" />
			<Skeleton className="h-6 w-[12rem] mb-8" />
			<div className="flex flex-row items-center justify-center gap-4 mt-2">
				<div className="w-7/12">
					{Array.from({ length: 12 }, (_, i) => {
						return <Skeleton key={i} className="h-7 w-[40rem] mb-2" />;
					})}
				</div>
				<div className="w-5/12 flex flex-col gap-4 justify-start">
					<Skeleton className="h-48 w-full mb-2" />
					<Skeleton className="h-48 w-full mb-2" />
				</div>
			</div>
			<div className="flex flex-col items-start w-full h-fit gap-2 mt-6 pr-24">
				<Skeleton className="h-6 w-64" />
				<Skeleton className="w-full h-96 mt-4 " />
			</div>
		</div>
	);
};

export default loading;
