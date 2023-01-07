import { OwnServerList, ScriptPaths } from 'scripts/enums/enums';

/** @param {NS} ns */
export async function main(ns) {
	const RAM = Intl.NumberFormat('de-de', {
		style: 'unit',
		unit: 'gigabyte',
	});
	const MONEY = Intl.NumberFormat('en-us', {
		style: 'currency',
		currency: 'USD',
		maximumFractionDigits: 4,
		notation: 'compact',
	});
	let ramList = {};
	let newServerName = '';
	let serverNumber = 0;

	let serverType = await ns.prompt(
		'What kind of a server you want to purchase?',
		{
			type: 'select',
			choices: [OwnServerList.farmServers, OwnServerList.moneyServers],
		}
	);

	if (serverType === OwnServerList.farmServers) {
		while (
			ns.serverExists(OwnServerList.farmServers + '-' + serverNumber.toString())
		) {
			serverNumber++;
		}
		newServerName = OwnServerList.farmServers + '-' + serverNumber.toString();
	}

	if (serverType === OwnServerList.moneyServers) {
		while (
			ns.serverExists(
				OwnServerList.moneyServers + '-' + serverNumber.toString()
			)
		) {
			serverNumber++;
		}
		newServerName = OwnServerList.moneyServers + '-' + serverNumber.toString();
	}

	for (let i = 1; i <= 20; i++) {
		let ram = Math.pow(2, i);
		let cost = ns.getPurchasedServerCost(ram);
		ramList[RAM.format(ram) + ' - ' + MONEY.format(cost)] = Math.pow(2, i);
	}

	let serverRam = await ns.prompt('How much ram do you want to choose', {
		type: 'select',
		choices: [...Object.keys(ramList)],
	});
	let buy = await ns.prompt(
		`Do you want to buy a ${newServerName} with ${RAM.format(
			ramList[serverRam]
		)}. It will cost ${MONEY.format(
			ns.getPurchasedServerCost(ramList[serverRam])
		)}!`
	);

	if (buy) {
		ns.purchaseServer(newServerName, ramList[serverRam]);
		if (serverType === OwnServerList.moneyServers) {
			ns.exec(ScriptPaths.runMoneyServers, OwnServerList.home);
		}
		if (serverType === OwnServerList.farmServers) {
			ns.exec(ScriptPaths.runExpFarmServers, OwnServerList.home);
		}
	}
}
