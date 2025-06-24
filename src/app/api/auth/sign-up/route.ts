import { withTranslator } from "@/i18n/withTranslator";
import { signUpService } from "@/lib/services/auth-services";
import { serviceResponseHandler } from "@/lib/services/utils/actions.utils";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
	const { t } = await withTranslator(req, "SignUpDialog.messages");

	const body = await req.json();

	const res = await serviceResponseHandler(() => signUpService(body), {
		successMessage: t("defaultSuccessMessage"),
		errorMessage: t("defaultErrorMessage"),
		translator: t,
	});

	return NextResponse.json(res, { status: res.isSuccess ? 200 : 400 });
}
