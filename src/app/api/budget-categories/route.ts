import { withTranslator } from "@/i18n/withTranslator";
import { getBudgetCategoriesService } from "@/lib/services/budget-categories-service";
import { serviceResponseHandler } from "@/lib/services/utils/actions.utils";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
	const profileId = req.nextUrl.searchParams.get("profileId");

	if (!profileId) {
		return NextResponse.json(
			{ error: "Missing required query parameter: profileId." },
			{ status: 400 }
		);
	}
	const res = await serviceResponseHandler(
		async () => await getBudgetCategoriesService(profileId)
	);

	return NextResponse.json(res, { status: res.isSuccess ? 200 : 400 });
}

export async function POST(req: NextRequest) {
	const { t } = await withTranslator(req, "MyBudgetPage.messages");

	const body = await req.json();

	const res = await serviceResponseHandler(
		async () => await getBudgetCategoriesService(body),
		{
			successMessage: t("createSuccessMessage"),
			errorMessage: t("createErrorMessage"),
		}
	);

	return NextResponse.json(res, { status: res.isSuccess ? 200 : 400 });
}
