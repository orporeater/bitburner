import { NS } from '@ns';
import { OwnServerList, ScriptPath } from '/scripts/enums/enums.js';
import { MONEY, DATATYPE } from '/scripts/formats/formats.js';

export async function main(ns: NS): Promise<void> {
	const ramList: Record<string, number> = {};
	let newServerName = '';
	let serverNumber = 0;

	const serverType: string = (await ns.prompt(
		'What kind of a server you want to purchase?',
		{
			type: 'select',
			choices: [OwnServerList.FARM_SERVER, OwnServerList.MONEY_SERVER],
		}
	)) as string;

	if (serverType === OwnServerList.FARM_SERVER) {
		while (
			ns.serverExists(OwnServerList.FARM_SERVER + '-' + serverNumber.toString())
		) {
			serverNumber++;
		}
		newServerName = OwnServerList.FARM_SERVER + '-' + serverNumber.toString();
	}

	if (serverType === OwnServerList.MONEY_SERVER) {
		while (
			ns.serverExists(
				OwnServerList.MONEY_SERVER + '-' + serverNumber.toString()
			)
		) {
			serverNumber++;
		}
		newServerName = OwnServerList.MONEY_SERVER + '-' + serverNumber.toString();
	}

	for (let i = 1; i <= 20; i++) {
		const ram = Math.pow(2, i);
		const cost = ns.getPurchasedServerCost(ram);
		ramList[DATATYPE.GB.format(ram) + ' - ' + MONEY.format(cost)] = Math.pow(
			2,
			i
		);
	}

	const serverRam: string = (await ns.prompt(
		'How much ram do you want to choose',
		{
			type: 'select',
			choices: [...Object.keys(ramList)],
		}
	)) as string;

	const buy: boolean = (await ns.prompt(
		`Do you want to buy a ${newServerName} with ${DATATYPE.GB.format(
			ramList[serverRam]
		)}. It will cost ${MONEY.format(
			ns.getPurchasedServerCost(ramList[serverRam])
		)}!`
	)) as boolean;

	if (buy) {
		ns.purchaseServer(newServerName, ramList[serverRam]);
		if (serverType === OwnServerList.MONEY_SERVER) {
			ns.exec(ScriptPath.RUN_MONEY_SERVERS, OwnServerList.HOME);
		}
		if (serverType === OwnServerList.FARM_SERVER) {
			ns.exec(
				ScriptPath.RUN_EXP_SERVERS,
				OwnServerList.HOME,
				1,
				OwnServerList.TARGET_EXP_FARM_SERVERS
			);
		}
	}
}
