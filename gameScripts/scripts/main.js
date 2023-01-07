import { Servers } from 'scripts/classes/servers';
import { OwnServerList, ScriptPaths } from 'scripts/enums/enums';

/** @param {NS} ns */
export async function main(ns) {
	const servers = new Servers(ns);
	let startBit = true;

	while (true) {
		let countNewRootServers = 0;
		let countHasRamAndMoneyServers = 0;
		let serversHackable = servers.hackable;

		ns.print(`runnig`);

		for (let server of serversHackable) {
			let portsOpen = 0;
			let serverStats = ns.getServer(server);
			let portsNeeded = ns.getServerNumPortsRequired(server);

			if (ns.fileExists('BruteSSH.exe', 'home') && !serverStats.sshPortOpen) {
				ns.brutessh(server);
			}

			if (ns.fileExists('relaySMTP.exe', 'home') && !serverStats.smtpPortOpen) {
				ns.relaysmtp(server);
			}

			if (ns.fileExists('FTPCrack.exe', 'home') && !serverStats.ftpPortOpen) {
				ns.ftpcrack(server);
			}

			if (ns.fileExists('HTTPworm.exe', 'home') && !serverStats.httpPortOpen) {
				ns.httpworm(server);
			}

			if (ns.fileExists('SQLInject.exe', 'home') && !serverStats.sqlPortOpen) {
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
			ns.exec(ScriptPaths.runHomeServer, OwnServerList.home);
			ns.exec(ScriptPaths.runMoneyServers, OwnServerList.home);
			ns.exec(
				ScriptPaths.runExpFarmServers,
				OwnServerList.home,
				1,
				OwnServerList.targetFarmServers
			);
			if (!ns.scriptRunning(ScriptPaths.hackNodes, OwnServerList.home)) {
				ns.exec(ScriptPaths.hackNodes, OwnServerList.home);
			}
			if (countHasRamAndMoneyServers > 0 || startBit) {
				ns.exec(ScriptPaths.runRemoteOnTarget, OwnServerList.home);
			}
			startBit = false;
		}
		await ns.sleep(10000);
	}
}
