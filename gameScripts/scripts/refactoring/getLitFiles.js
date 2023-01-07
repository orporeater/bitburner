import { Servers } from 'scripts/classes/servers';

/** @param {NS} ns */
export async function main(ns) {
	const servers = new Servers(ns);
	const dataList = servers.documentsLit;
	for (let entry of dataList) {
		ns.tprintf(entry);
		ns.scp(entry.files, 'home', entry.server);
	}
}
