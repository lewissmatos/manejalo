import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
	return (
		<div className="h-calculate(100vh - 64px) gap-4 w-full">
			<Skeleton className="h-8 w-48 mb-2" />
			<Skeleton className="h-6 w-[22rem] mb-8" />
			<Skeleton className="h-6 w-96" />
			<div className="flex flex-wrap mt-4 gap-4 w-full max-h-[33rem] justify-start items-start overflow-y-auto">
				<div className="flex flex-col w-full md:w-36 max-w-sm h-44 gap-2 justify-between">
					<Skeleton className="h-44 w-full rounded-lg" />
				</div>{" "}
				{Array(9)
					.fill("")
					?.map((_, i) => (
						<div
							className="flex flex-col w-full md:w-96 max-w-sm h-44 gap-2 justify-between"
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
			<Skeleton className="h-20 w-full mt-4" />
		</div>
	);
}
