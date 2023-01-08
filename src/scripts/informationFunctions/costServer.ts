import { NS } from '@ns';
import { DATATYPE, MONEY } from '/scripts/formats/formats.js';

export async function main(ns: NS): Promise<void> {
	ns.tprintf(
		`Maximum GB :${DATATYPE.GB.format(ns.getPurchasedServerMaxRam())}`
	);

	for (let i = 1; i <= 20; i++) {
		const ram = Math.pow(2, i);
		const price = ns.getPurchasedServerCost(ram);
		ns.tprintf(
			`${i} -- Server ram: ${DATATYPE.GB.format(ram)} -- Price: ${MONEY.format(
				price
			)}`
		);
	}
}
