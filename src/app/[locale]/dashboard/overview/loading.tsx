import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
	return (
		<div className="h-calculate(100vh - 64px) gap-4 w-full">
			<Skeleton className="h-8 w-48 mb-2" />
			<Skeleton className="h-6 w-[40rem] mb-8" />
			<Skeleton className="h-6 w-96" />
			<div className="flex flex-row mt-4 gap-4 items-start w-">
				<div className="flex flex-wrap gap-4 w-7/12 max-h-[33rem] justify-start items-start overflow-y-auto">
					{Array(4)
						.fill("")
						?.map((_, i) => (
							<div
								className="flex flex-col w-full md:w-80 max-w-sm h-64 gap-2 justify-between"
								key={i}
							>
								<Skeleton className="h-64 w-full rounded-md" />
								<div className="space-y-2">
									<Skeleton className="h-8 w-full" />
									<Skeleton className="h-8 w-full" />
								</div>
							</div>
						))}
				</div>
				<div className="flex flex-col gap-10 items-center w-5/12">
					<Skeleton className="h-6 w-64" />
					<Skeleton className="rounded-full size-72"></Skeleton>
				</div>
			</div>
			<div className="flex flex-col items-start w-full h-fit gap-2 mt-6 pr-24">
				<Skeleton className="h-6 w-64" />
				<Skeleton className="w-full h-96 mt-4 " />
			</div>
		</div>
	);
}
