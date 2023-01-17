import { NS } from '@ns';
import { ServersList } from '/scripts/classes/serverslist.js';
import { DATATYPE, MONEY } from '/scripts/formats/formats.js';

export async function main(ns: NS) {
	const divideSymbol = '_';
	const func = ns.args[0] ? ns.args[0] : 0;
	const servers = new ServersList(ns);
	const serversHackable = servers.hackable;
	let count = 1;

	switch (func) {
		case 0:
			for (const server of serversHackable) {
				printing(server);
				count++;
			}
			break;
		case 1:
			for (const server of servers.value) {
				printing(server);
				count++;
			}
			break;
		case 2:
			for (const server of servers.ownedServer) {
				printing(server);
				count++;
			}
			break;
	}

	function dash(minLength: number, length: number): string {
		const diff = minLength - length;
		let dashString = '';
		for (let i = 0; i < diff; i++) {
			dashString = dashString + ' ';
		}
		dashString = dashString + divideSymbol;
		return dashString;
	}

	function printing(server: string): void {
		const serverStats = ns.getServer(server);
		const rootAccess = serverStats.hasAdminRights ? 'YES' : 'NO ';
		const backdoor = serverStats.backdoorInstalled ? 'YES' : 'NO ';
		const dashNumber = dash(2, count.toString().length);
		const dashLvl = dash(4, serverStats.requiredHackingSkill.toString().length);
		const dashName = dash(20, server.length);
		const dashRam = dash(8, serverStats.maxRam.toString().length);
		ns.tprintf(
			`${count} ${dashNumber} Name: ${server} ${dashName} Lvl: ${
				serverStats.requiredHackingSkill
			} ${dashLvl} root: ${rootAccess} ${divideSymbol} backD: ${backdoor} ${divideSymbol} Ports: ${
				serverStats.openPortCount
			}/${
				serverStats.numOpenPortsRequired
			} ${divideSymbol} ${DATATYPE.GB.format(
				serverStats.maxRam
			)} ${dashRam} ${MONEY.format(serverStats.moneyMax)}`
		);
	}
}
