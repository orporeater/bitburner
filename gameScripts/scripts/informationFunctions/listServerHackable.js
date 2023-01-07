import { Servers } from 'scripts/classes/servers';

/** @param {NS} ns */
export async function main(ns) {
	const func = ns.args[0] ? ns.args[0] : 0;
	const servers = new Servers(ns);
	const serversHackable = servers.hackable;
	let count = 1;
	const RAM = Intl.NumberFormat('de-de', {
		style: 'unit',
		unit: 'gigabyte',
	});
	const MONEY = Intl.NumberFormat('en-us', {
		style: 'currency',
		currency: 'USD',
		maximumFractionDigits: 4,
		notation: 'compact',
	});
	switch (func) {
		case 0:
			for (let server of serversHackable) {
				printing(server);
				count++;
			}
			break;
		case 1:
			for (let server of servers.value) {
				printing(server);
				count++;
			}
	}
	function dash(minLength, length) {
		const diff = minLength - length;
		let dashString = '';
		for (let i = 0; i < diff; i++) {
			dashString = dashString + ' ';
		}
		dashString = dashString + '-';
		return dashString;
	}
	function printing(server) {
		const serverStats = ns.getServer(server);
		let rootAccess = serverStats.hasAdminRights ? 'YES' : 'NO ';
		let backdoor = serverStats.backdoorInstalled ? 'YES' : 'NO ';
		let dashNumber = dash(2, count.toString().length);
		let dashLvl = dash(4, serverStats.requiredHackingSkill.toString().length);
		let dashName = dash(20, server.length);
		let dashRam = dash(8, serverStats.maxRam.toString().length);
		ns.tprintf(
			`${count} ${dashNumber} Name: ${server} ${dashName} Lvl: ${
				serverStats.requiredHackingSkill
			} ${dashLvl} root: ${rootAccess} - backD: ${backdoor} - ${RAM.format(
				serverStats.maxRam
			)} ${dashRam} ${MONEY.format(serverStats.moneyMax)}`
		);
	}
}
