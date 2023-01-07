import { HacknetNodes } from 'scripts/enums/enums';

/** @param {NS} ns */
export async function main(ns) {
	const maxStats = {
		lvl: 200,
		ram: 64,
		cores: 16,
	};

	while (true) {
		let countMaxNodes = HacknetNodes.maxNumber;
		let whileCounter = 0;

		let numberNodes = ns.hacknet.numNodes();
		let moneyAvailable = ns.getPlayer().money;

		while (numberNodes < countMaxNodes && whileCounter < countMaxNodes) {
			let nodeCost = ns.hacknet.getPurchaseNodeCost();

			if (nodeCost < moneyAvailable) {
				ns.hacknet.purchaseNode();
			}

			whileCounter++;
		}
		for (let node = 0; node < numberNodes; node++) {
			let nodeStats = ns.hacknet.getNodeStats(node);

			for (let lvl = 0; lvl < maxStats.lvl - nodeStats.level; lvl++) {
				let lvlCost = ns.hacknet.getLevelUpgradeCost(node, 1);
				if (lvlCost < moneyAvailable) {
					ns.hacknet.upgradeLevel(node, 1);
				} else {
					break;
				}
			}

			for (let ram = 0; ram < maxStats.ram - nodeStats.ram; ram++) {
				let ramCost = ns.hacknet.getRamUpgradeCost(node, 1);
				if (ramCost < moneyAvailable) {
					ns.hacknet.upgradeRam(node, 1);
				} else {
					break;
				}
			}
			for (let cores = 0; cores < maxStats.cores - nodeStats.cores; cores++) {
				let coresCost = ns.hacknet.getCoreUpgradeCost(node, 1);
				if (coresCost < moneyAvailable) {
					ns.hacknet.upgradeCore(node, 1);
				} else {
					break;
				}
			}
		}
		await ns.sleep(60000);
	}
}
