export const formatCurrency = (
	value?: number | null,
	currency: string = "DOP",
	omitCurrency: boolean = false
): string => {
	const output = new Intl.NumberFormat("en-US", {
		maximumFractionDigits: 0,
		style: "currency",
		currency: currency,
	}).format(value || 0);

	return omitCurrency ? output.replaceAll(currency, "").trim() : output;
};
