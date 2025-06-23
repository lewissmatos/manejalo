import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
	return (
		<div className="h-calculate(100vh - 64px) gap-4 w-full">
			<Skeleton className="h-8 w-48 mb-2" />
			<Skeleton className="h-6 w-[40rem] mb-8" />

			<div className="flex flex-row mt-4 gap-4 items-start">
				<div className="flex flex-col w-1/2 gap-4 pr-4">
					<Skeleton className="h-4 w-20" />
					<Skeleton className="h-8 w-44" />
					<div className="flex flex-wrap gap-4 max-h-[33rem] justify-start items-start overflow-y-auto">
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
				</div>
				<div className="flex flex-col gap-6 items-center justify-center w-1/2">
					<div className="flex flex-row gap-4 w-full items-start pl-4">
						<div className="flex flex-col gap-4 w-[70%] items-center">
							<Skeleton className="h-6 w-64" />
							<Skeleton className="rounded-full size-72"></Skeleton>
						</div>
						<Skeleton className="h-[350px] w-[34%]" />
					</div>
					<Skeleton className="h-52 w-full" />
				</div>
			</div>
		</div>
	);
}
