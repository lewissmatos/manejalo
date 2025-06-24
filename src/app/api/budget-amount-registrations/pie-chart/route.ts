import { getBudgetAmountRegistrationsGroupedByCategoryForPieChart } from "@/app/_server-actions/(budget-amount-registrations)/actions";
import { serviceResponseHandler } from "@/lib/services/utils/actions.utils";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
	const profileId = req.nextUrl.searchParams.get("profileId");

	const startDate = req.nextUrl.searchParams.get("startDate");
	const endDate = req.nextUrl.searchParams.get("endDate");
	if (!profileId || !startDate || !endDate) {
		return NextResponse.json(
			{ error: "Missing required query parameters." },
			{ status: 400 }
		);
	}
	const res = await serviceResponseHandler(
		async () =>
			await getBudgetAmountRegistrationsGroupedByCategoryForPieChart({
				profileId,
				startDate: new Date(startDate),
				endDate: new Date(endDate),
			})
	);

	return NextResponse.json(res, { status: res.isSuccess ? 200 : 400 });
}
