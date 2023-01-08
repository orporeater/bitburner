import { NS } from '@ns';
import { ServersList } from '/scripts/classes/serverslist.js';

export async function main(ns: NS): Promise<void> {
	const servers = new ServersList(ns);
	const hackableSevers = servers.hackable;
	const player = ns.getPlayer();
	const serverEXPList: {
		server: string;
		exp: number;
		weakenTime: number;
		expPerSecond: number;
	}[] = [];

	for (const server of hackableSevers) {
		const serverStats = ns.getServer(server);
		const serverWeakenTime = Math.round(
			ns.formulas.hacking.weakenTime(serverStats, player) / 1000
		);
		const serverHackinExp = ns.formulas.hacking.hackExp(serverStats, player);
		const expPerSecond = parseFloat(
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
	for (const entry of serverEXPList) {
		ns.print(entry);
	}
}
