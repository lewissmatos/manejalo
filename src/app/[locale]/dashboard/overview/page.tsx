import React from "react";
import dynamic from "next/dynamic";

const CurrentDateFormatted = dynamic(
	() => import("../_components/CurrentFormattedDate"),
	{
		loading: () => <div className="text-lg text-primary">Loading...</div>,
		ssr: !!false,
	}
);
const Overview = () => {
	return (
		<div className="bg-primary-foreground rounded-md h-96 p-4">
			<CurrentDateFormatted />
		</div>
	);
};

export default Overview;
