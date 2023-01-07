/** @param {NS} ns */
export class Servers {
	#servers;
	#ns;
	constructor(ns) {
		this.#ns = ns;
		this.#servers = this.#getAllServers();
	}

	#getAllServers(rootHost = 'home') {
		this.#ns.disableLog('ALL');
		let pendingScan = [rootHost];
		const list = new Set(pendingScan);
		while (pendingScan.length) {
			const hostname = pendingScan.shift();
			list.add(hostname);

			pendingScan.push(...this.#ns.scan(hostname));
			pendingScan = pendingScan.filter((host) => !list.has(host));
		}
		let finalList = [...list].sort(
			(a, b) =>
				this.#ns.getServerRequiredHackingLevel(a) -
				this.#ns.getServerRequiredHackingLevel(b)
		);
		return [...finalList];
	}
	get value() {
		return this.#servers;
	}

	get hackable() {
		const serverList = [];
		const player = this.#ns.getPlayer();
		for (let server of this.#servers) {
			let serverStats = this.#ns.getServer(server);
			if (serverStats.requiredHackingSkill <= player.skills.hacking) {
				serverList.push(server);
			}
		}
		return serverList;
	}

	get hackableWithRoot() {
		const serverList = [];
		const player = this.#ns.getPlayer();

		for (let server of this.#servers) {
			let serverStats = this.#ns.getServer(server);

			if (
				serverStats.requiredHackingSkill <= player.skills.hacking &&
				serverStats.hasAdminRights
			) {
				serverList.push(server);
			}
		}
		return serverList;
	}

	get hackableWithRootAndMoney() {
		const serverList = [];
		const player = this.#ns.getPlayer();
		for (let server of this.#servers) {
			let serverStats = this.#ns.getServer(server);
			if (
				serverStats.requiredHackingSkill <= player.skills.hacking &&
				serverStats.hasAdminRights &&
				serverStats.moneyMax > 0
			) {
				serverList.push(server);
			}
		}
		return serverList;
	}

	get hackableWithRootAndMoneyAndRam() {
		const serverList = [];
		const player = this.#ns.getPlayer();
		for (let server of this.#servers) {
			let serverStats = this.#ns.getServer(server);
			if (
				serverStats.requiredHackingSkill <= player.skills.hacking &&
				serverStats.hasAdminRights &&
				serverStats.moneyMax > 0 &&
				serverStats.maxRam > 0
			) {
				serverList.push(server);
			}
		}
		return serverList;
	}

	get documentsLit() {
		const serverWithDocumentsLit = [];

		for (let server of this.#servers) {
			let files = this.#ns.ls(server, 'lit');

			if (files.length && server !== 'home') {
				serverWithDocumentsLit.push({ server: server, files: files });
			}
		}
		return serverWithDocumentsLit;
	}

	get documentsCct() {
		const serverWithDocumentsLit = [];

		for (let server of this.#servers) {
			let files = this.#ns.ls(server, 'cct');

			if (files.length && server !== 'home') {
				serverWithDocumentsLit.push({ server: server, files: files });
			}
		}
		return serverWithDocumentsLit;
	}

	get allFiles() {
		const serverWithDocumentsLit = [];

		for (let server of this.#servers) {
			let files = this.#ns.ls(server);

			if (files.length && server !== 'home') {
				serverWithDocumentsLit.push({ server: server, files: files });
			}
		}
		return serverWithDocumentsLit;
	}

	get hasNoBackdoor() {
		const serverList = [];
		for (let server of this.#servers) {
			let serverStats = this.#ns.getServer(server);
			if (!serverStats.backdoorInstalled) {
				serverList.push(server);
			}
		}
		return serverList;
	}

	get hasBackdoor() {
		const serverList = [];
		for (let server of this.#servers) {
			let serverStats = this.#ns.getServer(server);
			if (serverStats.backdoorInstalled) {
				serverList.push(server);
			}
		}
		return serverList;
	}
}
