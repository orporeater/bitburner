import { NS, Server } from '@ns';
import { ServersList } from '/scripts/classes/serverslist.js';
import { OwnServerList, ScriptPath } from '/scripts/enums/enums.js';

export async function main(ns: NS): Promise<void> {
	const servers: ServersList = new ServersList(ns);

	let startBit = true;

	while (true) {
		const serversHackable = servers.hackable;

		let countNewRootServers = 0;
		let countHasRamAndMoneyServers = 0;

		ns.print(`runnig`);

		for (const server of serversHackable) {
			const serverStats: Server = ns.getServer(server);
			const portsNeeded = ns.getServerNumPortsRequired(server);

			let portsOpen = 0;

			if (
				ns.fileExists('BruteSSH.exe', OwnServerList.HOME) &&
				!serverStats.sshPortOpen
			) {
				ns.brutessh(server);
			}

			if (
				ns.fileExists('relaySMTP.exe', OwnServerList.HOME) &&
				!serverStats.smtpPortOpen
			) {
				ns.relaysmtp(server);
			}

			if (
				ns.fileExists('FTPCrack.exe', OwnServerList.HOME) &&
				!serverStats.ftpPortOpen
			) {
				ns.ftpcrack(server);
			}

			if (
				ns.fileExists('HTTPworm.exe', OwnServerList.HOME) &&
				!serverStats.httpPortOpen
			) {
				ns.httpworm(server);
			}

			if (
				ns.fileExists('SQLInject.exe', OwnServerList.HOME) &&
				!serverStats.sqlPortOpen
			) {
				ns.sqlinject(server);
			}

			serverStats.ftpPortOpen ? portsOpen++ : (portsOpen = portsOpen);
			serverStats.smtpPortOpen ? portsOpen++ : (portsOpen = portsOpen);
			serverStats.sshPortOpen ? portsOpen++ : (portsOpen = portsOpen);
			serverStats.httpPortOpen ? portsOpen++ : (portsOpen = portsOpen);
			serverStats.sqlPortOpen ? portsOpen++ : (portsOpen = portsOpen);

			if (!ns.hasRootAccess(server) && portsOpen >= portsNeeded) {
				ns.nuke(server);
				countNewRootServers++;
				if (serverStats.maxRam > 0 && serverStats.moneyMax > 0) {
					countHasRamAndMoneyServers++;
				}
			}
		}
		if (countNewRootServers > 0 || startBit) {
			ns.exec(ScriptPath.RUN_HOME_SERVER, OwnServerList.HOME);
			ns.exec(ScriptPath.RUN_MONEY_SERVERS, OwnServerList.HOME);
			ns.exec(
				ScriptPath.RUN_EXP_SERVERS,
				OwnServerList.HOME,
				1,
				OwnServerList.TARGET_EXP_FARM_SERVERS
			);
			if (!ns.scriptRunning(ScriptPath.HACK_NODES, OwnServerList.HOME)) {
				ns.exec(ScriptPath.HACK_NODES, OwnServerList.HOME);
			}
			if (countHasRamAndMoneyServers > 0 || startBit) {
				ns.exec(ScriptPath.RUN_REMOTE_ON_TARGET, OwnServerList.HOME);
			}
			startBit = false;
		}
		await ns.sleep(10000);
	}
}
