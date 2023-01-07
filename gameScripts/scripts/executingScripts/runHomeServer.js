import { Servers } from 'scripts/classes/servers';
import { OwnServerList, ScriptPaths } from 'scripts/enums/enums';

/** @param {NS} ns */
export async function main(ns) {
	const servers = new Servers(ns);
	const serversHackable = servers.hackableWithRootAndMoney;
	const scriptName = ScriptPaths.moneyFarm;
	const runServer = OwnServerList.home;
	const scriptRam = ns.getScriptRam(scriptName);

	let serverMaxRam = ns.getServerMaxRam(runServer) - 512;

	let threadsPerTarget =
		serversHackable.length !== 0
			? Math.floor(serverMaxRam / serversHackable.length / scriptRam)
			: 0;

	if (threadsPerTarget !== 0) {
		if (ns.scriptRunning(scriptName, runServer)) {
			ns.scriptKill(scriptName, runServer);
		}
		for (let target of serversHackable) {
			ns.exec(scriptName, runServer, threadsPerTarget, target);
		}
	}
}
