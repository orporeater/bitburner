/** @param {NS} ns */
export async function main(ns) {
	const priceF = new Intl.NumberFormat('en-us', {
		currency: 'USD',
		style: 'currency',
		maximumFractionDigits: 4,
		notation: 'compact',
	});
	const dataF = new Intl.NumberFormat(undefined, {
		style: 'unit',
		unit: 'gigabyte',
	});

	ns.tprintf(`Maximum GB :${dataF.format(ns.getPurchasedServerMaxRam())}`);

	for (let i = 1; i <= 20; i++) {
		let ram = Math.pow(2, i);
		let price = ns.getPurchasedServerCost(ram);
		ns.tprintf(
			`${i} -- Server ram: ${dataF.format(ram)} -- Price: ${priceF.format(
				price
			)}`
		);
	}
}
