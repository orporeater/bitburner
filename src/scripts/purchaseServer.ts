import { NS } from '@ns';
import { OwnServerList, ScriptPath } from '/scripts/enums/enums.js';
import { MONEY, DATATYPE } from '/scripts/formats/formats.js';
import { ServersList } from '/scripts/classes/serverslist.js';

export async function main(ns: NS): Promise<void> {
	const ramList: Record<string, number> = {};
	const ownedServerList = new ServersList(ns).ownedServer;
	const maxNewServer = ns.getPurchasedServerLimit() - ownedServerList.length;

	const serverType: string = (await ns.prompt(
		'What kind of a server you want to purchase?',
		{
			type: 'select',
			choices: [OwnServerList.FARM_SERVER, OwnServerList.MONEY_SERVER],
		}
	)) as string;

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

	const howMany: string = (await ns.prompt('How many servers you want to buy', {
		type: 'text',
	})) as string;
	const numberToBuy = parseInt(howMany);
	if (
		typeof numberToBuy === 'number' &&
		numberToBuy > 0 &&
		numberToBuy <= maxNewServer
	) {
		let serverNumber = ownedServerList.filter((entry) =>
			entry.includes(serverType)
		).length;

		const cost = ns.getPurchasedServerCost(ramList[serverRam]) * numberToBuy;
		if (cost < ns.getPlayer().money) {
			for (let i = 1; i <= numberToBuy; i++) {
				ns.purchaseServer(
					serverType + '-' + serverNumber.toString(),
					ramList[serverRam]
				);
				ns.tprintf(`purchased ${serverType + '-' + serverNumber.toString()}`);
				serverNumber++;
			}

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
}
