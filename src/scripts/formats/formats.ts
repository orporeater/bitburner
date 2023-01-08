export const DATATYPE = {
	GB: Intl.NumberFormat('de-de', {
		style: 'unit',
		unit: 'gigabyte',
	}),
};

export const MONEY = Intl.NumberFormat('en-us', {
	style: 'currency',
	currency: 'USD',
	maximumFractionDigits: 4,
	notation: 'compact',
});
