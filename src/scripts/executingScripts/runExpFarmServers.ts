import { NS } from '@ns';
import { OwnServerList, ScriptPath } from '/scripts/enums/enums.js';

export async function main(ns: NS): Promise<void> {
	const target: string = ns.args[0] as string;
	const farmServers: string[] = [];
	let serverNumber = 0;

	while (
		ns.serverExists(OwnServerList.FARM_SERVER + '-' + serverNumber.toString())
	) {
		farmServers.push(OwnServerList.FARM_SERVER + '-' + serverNumber.toString());
		serverNumber++;
	}
	const scriptName: string = ScriptPath.EXP_FARM;

	for (const farmServer of farmServers) {
		if (farmServer) {
			const threadsMax = Math.floor(
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
