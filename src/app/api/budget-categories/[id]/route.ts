import { withTranslator } from "@/i18n/withTranslator";
import {
	deleteBudgetCategoryService,
	updateBudgetCategoryService,
} from "@/lib/services/budget-categories-service";
import { serviceResponseHandler } from "@/lib/services/utils/actions.utils";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
	req: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	const { t } = await withTranslator(req, "MyBudgetPage.messages");

	const body = await req.json();
	const { id } = await params;

	const res = await serviceResponseHandler(
		async () => await updateBudgetCategoryService(id, body),
		{
			successMessage: t("updateSuccessMessage"),
			errorMessage: t("updateErrorMessage"),
		}
	);

	return NextResponse.json(res, { status: res.isSuccess ? 200 : 400 });
}

export async function DELETE(
	req: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	const { t } = await withTranslator(req, "MyBudgetPage.messages");
	const { id } = await params;

	const res = await serviceResponseHandler(
		async () => await deleteBudgetCategoryService(id),
		{
			successMessage: t("deleteSuccessMessage"),
			errorMessage: t("deleteErrorMessage"),
		}
	);

	return NextResponse.json(res, { status: res.isSuccess ? 200 : 400 });
}
