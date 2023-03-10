import { NS, NodeStats } from '@ns';
import { HacknetNode } from '/scripts/enums/enums.js';

export async function main(ns: NS): Promise<void> {
	while (true) {
		let whileCounter = 0;

		let numberNodes = ns.hacknet.numNodes();
		const moneyAvailable = ns.getPlayer().money;

		while (
			numberNodes < HacknetNode.MAX_NUMBER &&
			whileCounter < HacknetNode.MAX_NUMBER
		) {
			const nodeCost = ns.hacknet.getPurchaseNodeCost();
			if (numberNodes < HacknetNode.MAX_NUMBER) {
				if (nodeCost < moneyAvailable) {
					ns.hacknet.purchaseNode();
				}
			}
			numberNodes = ns.hacknet.numNodes();

			whileCounter++;
		}
		for (let node = 0; node < numberNodes; node++) {
			const nodeStats: NodeStats = ns.hacknet.getNodeStats(node);

			for (let lvl = 0; lvl < HacknetNode.MAX_LVL - nodeStats.level; lvl++) {
				const lvlCost = ns.hacknet.getLevelUpgradeCost(node, 1);
				if (lvlCost < moneyAvailable) {
					ns.hacknet.upgradeLevel(node, 1);
				} else {
					break;
				}
			}

			for (let ram = 0; ram < HacknetNode.MAX_RAM - nodeStats.ram; ram++) {
				const ramCost = ns.hacknet.getRamUpgradeCost(node, 1);
				if (ramCost < moneyAvailable) {
					ns.hacknet.upgradeRam(node, 1);
				} else {
					break;
				}
			}
			for (
				let cores = 0;
				cores < HacknetNode.MAX_CORES - nodeStats.cores;
				cores++
			) {
				const coresCost = ns.hacknet.getCoreUpgradeCost(node, 1);
				if (coresCost < moneyAvailable) {
					ns.hacknet.upgradeCore(node, 1);
				} else {
					break;
				}
			}
		}
		// await ns.sleep(5000);
		await ns.sleep(600000);
	}
}
