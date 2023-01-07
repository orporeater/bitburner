/** @param {NS} ns */
export async function main(ns) {
	ns.disableLog('ALL');
	let rootHost = 'home';
	let pendingScan = [rootHost];
	const list = new Set(pendingScan);
	while (pendingScan.length) {
		const hostname = pendingScan.shift();
		if (ns.fileExists('BruteSSH.exe', 'home')) {
			ns.brutessh(hostname);
		}
		if (ns.fileExists('relaySMTP.exe', 'home')) {
			ns.relaysmtp(hostname);
		}
		if (ns.fileExists('FTPCrack.exe', 'home')) {
			ns.ftpcrack(hostname);
		}
		if (ns.fileExists('HTTPworm.exe', 'home')) {
			ns.httpworm(hostname);
		}
		if (ns.fileExists('SQLInject.exe', 'home')) {
			ns.sqlinject(hostname);
		}
		if (!ns.hasRootAccess(hostname)) {
			ns.nuke(hostname);
		}
		if (ns.hasRootAccess(hostname)) {
			if (ns.getServer(hostname).backdoorInstalled) {
				installBackdoor(hostname);
				ns.printf(`Backdoor on ${hostname} installed`);
			}
		}
		list.add(hostname);

		pendingScan.push(...ns.scan(hostname));
		pendingScan = pendingScan.filter((host) => !list.has(host));
	}
}
