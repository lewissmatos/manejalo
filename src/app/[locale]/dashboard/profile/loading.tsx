import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
	return (
		<div className="h-calculate(100vh - 64px) gap-4 w-full">
			<Skeleton className="h-8 w-60 mb-2" />
			<Skeleton className="h-4 w-[12rem] mb-3" />
			<Skeleton className="h-4 w-[6rem] mb-3" />
			<Skeleton className="h-4 w-[20rem] mb-5" />
			<Skeleton className="h-5 w-[8rem] mb-4" />
			<div className="flex flex-wrap mt-4 gap-4 w-full max-h-[33rem] justify-start items-start overflow-y-auto">
				<div className="flex flex-col w-full md:w-36 max-w-sm h-36 gap-2 justify-between">
					<Skeleton className="h-40 w-full rounded-lg" />
				</div>{" "}
				{Array(9)
					.fill("")
					?.map((_, i) => (
						<div
							className="flex flex-col w-full md:w-80 max-w-sm h-36 gap-2 justify-between"
							key={i}
						>
							<Skeleton className="h-64 w-full rounded-md" />
							<div className="space-y-2">
								<Skeleton className="h-8 w-full" />
							</div>
						</div>
					))}
			</div>
			<Skeleton className="h-20 w-full mt-4" />
		</div>
	);
}
