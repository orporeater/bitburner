import { Servers } from 'scripts/classes/servers';
import { ScriptPaths } from 'scripts/enums/enums';

/** @param {NS} ns */
export async function main(ns) {
	const servers = new Servers(ns);
	const hackableServers = servers.hackableWithRootAndMoneyAndRam;
	const scriptName = ScriptPaths.moneyFarm;
	const ramScriptNeeded = ns.getScriptRam(scriptName);

	for (let server of hackableServers) {
		let serverStats = ns.getServer(server);

		ns.scp(scriptName, server);

		if (ns.fileExists(scriptName, server)) {
			if (!ns.scriptRunning(scriptName, server)) {
				let maxNumberOfScripts = Math.floor(
					serverStats.maxRam / ramScriptNeeded
				);

				if (maxNumberOfScripts > 0) {
					ns.exec(scriptName, server, maxNumberOfScripts, server);
				}
			}
		}
	}
}
