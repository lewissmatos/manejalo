import { withTranslator } from "@/i18n/withTranslator";
import {
	addBudgetAmountRegistrationService,
	getBudgetAmountRegistrationsService,
} from "@/lib/services/budget-amount-registrations-service";
import { serviceResponseHandler } from "@/lib/services/utils/actions.utils";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
	const { t } = await withTranslator(req, "OverviewPage.messages");

	const body = await req.json();

	const res = await serviceResponseHandler(
		async () => await addBudgetAmountRegistrationService(body),
		{
			successMessage: t("registerAmountSuccessMessage"),
			errorMessage: t("registerAmountErrorMessage"),
		}
	);

	return NextResponse.json(res, { status: res.isSuccess ? 200 : 400 });
}

export async function GET(req: NextRequest) {
	const profileId = req.nextUrl.searchParams.get("profileId");
	const page = req.nextUrl.searchParams.get("page") || "1";
	const limit = req.nextUrl.searchParams.get("limit") || "10";

	const res = await serviceResponseHandler(
		async () =>
			await getBudgetAmountRegistrationsService({
				profileId,
				page: parseInt(page, 10) || 1,
				limit: parseInt(limit, 10) || 10,
			})
	);

	return NextResponse.json(res, { status: res.isSuccess ? 200 : 400 });
}
