import React from "react";
import dynamic from "next/dynamic";

const CurrentDateFormatted = dynamic(
	() => import("../_components/current-formatted-date"),
	{
		loading: () => <div className="text-lg text-primary">Loading...</div>,
		ssr: !!false,
	}
);
const Overview = () => {
	return (
		<div className="h-96 px-4">
			<CurrentDateFormatted />
		</div>
	);
};

export default Overview;
