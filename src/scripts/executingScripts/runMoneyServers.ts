import { NS } from '@ns';
import { ServersList } from '/scripts/classes/serverslist.js';
import { OwnServerList, ScriptPath } from '/scripts/enums/enums.js';

export async function main(ns: NS): Promise<void> {
	const servers: ServersList = new ServersList(ns);
	const serversHackable: string[] = servers.hackableWithRootAndMoney;
	const moneyServers: string[] = [];
	const scriptRam = ns.getScriptRam(ScriptPath.MONEY_FARM);
	let serverNumber = 0;

	while (
		ns.serverExists(OwnServerList.MONEY_SERVER + '-' + serverNumber.toString())
	) {
		moneyServers.push(
			OwnServerList.MONEY_SERVER + '-' + serverNumber.toString()
		);
		serverNumber++;
	}

	for (const moneyServer of moneyServers) {
		if (moneyServer) {
			const serverMaxRam = ns.getServerMaxRam(moneyServer);
			const threadsPerTarget =
				serversHackable.length !== 0
					? Math.floor(serverMaxRam / serversHackable.length / scriptRam)
					: 0;

			ns.scp(ScriptPath.MONEY_FARM, moneyServer);
			if (threadsPerTarget !== 0) {
				if (ns.scriptRunning(ScriptPath.MONEY_FARM, moneyServer)) {
					ns.scriptKill(ScriptPath.MONEY_FARM, moneyServer);
				}
				for (const target of serversHackable) {
					ns.exec(ScriptPath.MONEY_FARM, moneyServer, threadsPerTarget, target);
				}
			}
		}
	}
}
