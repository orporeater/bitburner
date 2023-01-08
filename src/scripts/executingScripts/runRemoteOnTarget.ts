import { NS, Server } from '@ns';
import { ServersList } from '/scripts/classes/serverslist.js';
import { ScriptPath } from '/scripts/enums/enums.js';

export async function main(ns: NS): Promise<void> {
	const servers: ServersList = new ServersList(ns);
	const hackableServers: string[] = servers.hackableWithRootAndMoneyAndRam;
	const scriptName = ScriptPath.MONEY_FARM;
	const ramScriptNeeded = ns.getScriptRam(scriptName);

	for (const server of hackableServers) {
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
}
