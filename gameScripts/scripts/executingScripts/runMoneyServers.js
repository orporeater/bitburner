import { Servers } from 'scripts/classes/servers';
import { OwnServerList, ScriptPaths } from '/scripts/enums/enums';

/** @param {NS} ns */
export async function main(ns) {
	const servers = new Servers(ns);
	const serversHackable = servers.hackableWithRootAndMoney;
	const scriptName = ScriptPaths.moneyFarm;
	const moneyServers = [];
	const scriptRam = ns.getScriptRam(scriptName);
	let serverNumber = 0;

	while (
		ns.serverExists(OwnServerList.moneyServers + '-' + serverNumber.toString())
	) {
		moneyServers.push(
			OwnServerList.moneyServers + '-' + serverNumber.toString()
		);
		serverNumber++;
	}

	for (let moneyServer of moneyServers) {
		if (moneyServer) {
			let serverMaxRam = ns.getServerMaxRam(moneyServer);
			let threadsPerTarget =
				serversHackable.length !== 0
					? Math.floor(serverMaxRam / serversHackable.length / scriptRam)
					: 0;

			ns.scp(scriptName, moneyServer);
			if (threadsPerTarget !== 0) {
				if (ns.scriptRunning(scriptName, moneyServer)) {
					ns.scriptKill(scriptName, moneyServer);
				}
				for (let target of serversHackable) {
					ns.exec(scriptName, moneyServer, threadsPerTarget, target);
				}
			}
		}
	}
}
