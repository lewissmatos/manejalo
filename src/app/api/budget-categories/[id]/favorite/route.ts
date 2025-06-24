import { withTranslator } from "@/i18n/withTranslator";
import { markBudgetCategoryAsFavoriteService } from "@/lib/services/budget-categories-service";
import { serviceResponseHandler } from "@/lib/services/utils/actions.utils";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
	req: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	const { t } = await withTranslator(req, "MyBudgetPage.messages");

	const body = await req.json();
	const isFavorite = body.isFavorite;
	if (typeof isFavorite !== "boolean") {
		return NextResponse.json(
			{ error: "Invalid favorite status value" },
			{ status: 400 }
		);
	}
	const { id } = await params;

	const res = await serviceResponseHandler(
		async () => await markBudgetCategoryAsFavoriteService(id, isFavorite),
		{
			successMessage: isFavorite
				? t("markAsFavoriteSuccessMessage")
				: t("unmarkAsFavoriteSuccessMessage"),
		}
	);

	return NextResponse.json(res, { status: res.isSuccess ? 200 : 400 });
}
