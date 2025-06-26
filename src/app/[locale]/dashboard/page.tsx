import { Metadata } from "next";
import { redirect } from "next/navigation";

export async function generateMetadata({
	params,
}: {
	params: Promise<{ section: string }>;
}): Promise<Metadata> {
	const { section } = await params;
	return {
		title: `Presupuestalo - ${section}`,
		description: `Explora la sección ${section} de tus finanzas.`,
	};
}
const page = async () => {
	redirect("/dashboard/overview");
};

export default page;
