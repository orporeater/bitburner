import { NS, Server } from '@ns';
import { ServersList } from '/scripts/classes/serverslist.js';
import { OwnServerList, ScriptPath } from '/scripts/enums/enums.js';

export async function main(ns: NS): Promise<void> {
	const servers: ServersList = new ServersList(ns);
	const scriptName = ScriptPath.MONEY_FARM;
	const ramScriptNeeded = ns.getScriptRam(scriptName);

	const hackableServersWithMoney: string[] =
		servers.hackableWithRootAndMoneyAndRam;
	for (const server of hackableServersWithMoney) {
		const serverStats: Server = ns.getServer(server);

		ns.scp(scriptName, server);

		if (ns.fileExists(scriptName, server)) {
			if (!ns.scriptRunning(scriptName, server)) {
				const maxNumberOfScripts = Math.floor(
					serverStats.maxRam / ramScriptNeeded
				);

				if (maxNumberOfScripts > 0) {
					ns.exec(scriptName, server, maxNumberOfScripts, server);
				}
			}
		}
	}

	const hackableServersWitRam: string[] =
		servers.hackableWithRootAndRamAndNoMoney;
	for (const server of hackableServersWitRam) {
		ns.scriptKill(ScriptPath.MONEY_FARM, server);
		const serverStats: Server = ns.getServer(server);
		let targets = ns.scan(server);
		targets = targets.filter(
			(target) => target !== OwnServerList.HOME && ns.hasRootAccess(target)
		);

		ns.scp(scriptName, server);

		const maxNumberTreadsPerTarget = Math.floor(
			serverStats.maxRam / ramScriptNeeded / targets.length
		);

		if (ns.fileExists(scriptName, server)) {
			for (const target of targets) {
				if (maxNumberTreadsPerTarget > 0) {
					ns.exec(scriptName, server, maxNumberTreadsPerTarget, target);
				}
			}
		}
	}
}
