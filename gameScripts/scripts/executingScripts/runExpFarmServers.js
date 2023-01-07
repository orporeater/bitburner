import { OwnServerList, ScriptPaths } from 'scripts/enums/enums';

/** @param {NS} ns */
export async function main(ns) {
	const target = ns.args[0];
	const farmServers = [];
	let serverNumber = 0;

	while (
		ns.serverExists(OwnServerList.farmServers + '-' + serverNumber.toString())
	) {
		farmServers.push(OwnServerList.farmServers + '-' + serverNumber.toString());
		serverNumber++;
	}
	const scriptName = ScriptPaths.expFarm;

	for (let farmServer of farmServers) {
		if (farmServer) {
			let threadsMax = Math.floor(
				ns.getServerMaxRam(farmServer) / ns.getScriptRam(scriptName)
			);
			ns.scp(scriptName, farmServer);

			if (ns.scriptRunning(scriptName, farmServer)) {
				ns.scriptKill(scriptName, farmServer);
			}
			ns.exec(scriptName, farmServer, threadsMax, target);
		}
	}
}
