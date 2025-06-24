// app/api/login/route.ts
import { serviceResponseHandler } from "@/lib/services/utils/actions.utils";
import { loginService } from "@/lib/services/auth-services";
import { NextRequest, NextResponse } from "next/server";
import { withTranslator } from "@/i18n/withTranslator";

export async function POST(req: NextRequest) {
	const { t } = await withTranslator(req, "LoginDialog.messages");

	const body = await req.json();

	const res = await serviceResponseHandler(() => loginService(body), {
		successMessage: t("defaultSuccessMessage", {
			userName: body.email.split("@")?.[0],
		}),
		errorMessage: t("defaultErrorMessage"),
	});

	return NextResponse.json(res, { status: res.isSuccess ? 200 : 400 });
}
