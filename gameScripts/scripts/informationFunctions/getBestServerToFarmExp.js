import { Servers } from 'scripts/classes/servers';

/** @param {NS} ns */
export async function main(ns) {
	ns.disableLog('ALL');
	ns.clearLog();
	const servers = new Servers(ns);
	const hackableSevers = servers.hackable;
	const player = ns.getPlayer();
	const serverEXPList = [];

	for (let server of hackableSevers) {
		let serverStats = ns.getServer(server);
		let serverWeakenTime = Math.round(
			ns.formulas.hacking.weakenTime(serverStats, player) / 1000
		);
		let serverHackinExp = ns.formulas.hacking.hackExp(serverStats, player);
		let expPerSecond = parseFloat(
			(serverHackinExp / serverWeakenTime).toFixed(5)
		);

		serverEXPList.push({
			server: server,
			exp: serverHackinExp,
			weakenTime: serverWeakenTime,
			expPerSecond: expPerSecond,
		});
	}
	serverEXPList.sort((a, b) => b.expPerSecond - a.expPerSecond);
	for (let entry of serverEXPList) {
		ns.print(entry);
	}
}
