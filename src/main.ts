import { NS, Server } from '@ns';
import { ServersList } from '/scripts/classes/serverslist.js';
import { OwnServerList, ScriptPath } from '/scripts/enums/enums.js';

export async function main(ns: NS): Promise<void> {
	const servers: ServersList = new ServersList(ns);
	const hackNodesActivated = await ns.prompt('Automated HackNodes?', {
		type: 'boolean',
	});
	const upgradeServerActivated = await ns.prompt(
		'Upgrade for Servers Acktiv??',
		{
			type: 'boolean',
		}
	);
	let startBit = true;

	while (true) {
		const serversHackable = servers.hackable;

		let countNewRootServers = 0;
		let countHasRamAndMoneyServers = 0;

		ns.print(`runnig`);

		for (const server of serversHackable) {
			let serverStats: Server = ns.getServer(server);
			const portsNeeded = serverStats.numOpenPortsRequired;

			ns.fileExists('BruteSSH.exe', OwnServerList.HOME) &&
			!serverStats.sshPortOpen
				? ns.brutessh(server)
				: null;

			ns.fileExists('relaySMTP.exe', OwnServerList.HOME) &&
			!serverStats.smtpPortOpen
				? ns.relaysmtp(server)
				: null;

			ns.fileExists('FTPCrack.exe', OwnServerList.HOME) &&
			!serverStats.ftpPortOpen
				? ns.ftpcrack(server)
				: null;

			ns.fileExists('HTTPworm.exe', OwnServerList.HOME) &&
			!serverStats.httpPortOpen
				? ns.httpworm(server)
				: null;

			ns.fileExists('SQLInject.exe', OwnServerList.HOME) &&
			!serverStats.sqlPortOpen
				? ns.sqlinject(server)
				: null;

			serverStats = ns.getServer(server);
			const portsOpen = serverStats.openPortCount;

			if (!ns.hasRootAccess(server) && portsOpen >= portsNeeded) {
				ns.nuke(server);
				countNewRootServers++;
				if (serverStats.maxRam > 0 && serverStats.moneyMax > 0) {
					countHasRamAndMoneyServers++;
				}
			}
		}
		if (countNewRootServers > 0 || startBit) {
			ns.scriptKill(ScriptPath.HACK_NODES, OwnServerList.HOME);

			ns.scriptKill(ScriptPath.UPGRADE_SERVERS, OwnServerList.HOME);

			hackNodesActivated
				? ns.exec(ScriptPath.HACK_NODES, OwnServerList.HOME)
				: null;

			if (countHasRamAndMoneyServers > 0 || startBit) {
				ns.exec(ScriptPath.RUN_REMOTE_ON_TARGET, OwnServerList.HOME);
			}

			ns.exec(ScriptPath.RUN_HOME_SERVER, OwnServerList.HOME);

			ns.exec(ScriptPath.RUN_MONEY_SERVERS, OwnServerList.HOME);

			upgradeServerActivated
				? ns.exec(ScriptPath.UPGRADE_SERVERS, OwnServerList.HOME)
				: null;

			ns.exec(
				ScriptPath.RUN_EXP_SERVERS,
				OwnServerList.HOME,
				1,
				OwnServerList.TARGET_EXP_FARM_SERVERS
			);
			startBit = false;
		}
		await ns.sleep(30000);
	}
}
