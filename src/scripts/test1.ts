import { NS, Server } from '@ns';
import { NSEnums, OwnServerList } from '/scripts/enums/enums.js';
import { ServersList } from '/scripts/classes/serverslist.js';

export async function main(ns: NS) {
	for (let i = 1; i <= 20; i++) {
		const costUpgrade = ns.getPurchasedServerUpgradeCost('Formula', 2 ** i);
		const costBuy = ns.getPurchasedServerCost(2 ** i);
		ns.tprintf(`${2 ** i} - ${costUpgrade} - ${costBuy}`);
	}
}
