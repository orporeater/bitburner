import { NS } from '@ns';
import { ServersList } from '/scripts/classes/serverslist.js';
import { OwnServerList, ScriptPath } from '/scripts/enums/enums.js';

export async function main(ns: NS): Promise<void> {
	const servers: ServersList = new ServersList(ns);
	const serversHackable: string[] = servers.hackableWithRootAndMoney;
	const scriptRam = ns.getScriptRam(ScriptPath.MONEY_FARM);
	const serverMaxRam = ns.getServerMaxRam(OwnServerList.HOME) - 128;
	const threadsPerTarget =
		serversHackable.length !== 0
			? Math.floor(serverMaxRam / serversHackable.length / scriptRam)
			: 0;

	if (threadsPerTarget !== 0) {
		if (ns.scriptRunning(ScriptPath.MONEY_FARM, OwnServerList.HOME)) {
			ns.scriptKill(ScriptPath.MONEY_FARM, OwnServerList.HOME);
		}
		for (const target of serversHackable) {
			ns.exec(
				ScriptPath.MONEY_FARM,
				OwnServerList.HOME,
				threadsPerTarget,
				target
			);
		}
	}
}
