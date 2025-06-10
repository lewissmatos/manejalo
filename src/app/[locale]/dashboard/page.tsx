import { redirect } from "next/navigation";

const page = async () => {
	redirect("/dashboard/overview");
};

export default page;
