import { NS, Player, Server } from '@ns';

export class ServersList {
	private servers: string[];
	private ns;

	public constructor(ns: NS) {
		this.ns = ns;
		this.servers = this.getAllServers();
	}

	public get value(): string[] {
		return this.servers;
	}

	public get hackable(): string[] {
		const serverList: string[] = [];
		const player: Player = this.ns.getPlayer();
		for (const server of this.servers) {
			const serverStats: Server = this.ns.getServer(server);
			if (serverStats.requiredHackingSkill <= player.skills.hacking) {
				serverList.push(server);
			}
		}
		return serverList;
	}

	public get hackableWithRoot(): string[] {
		const serverList: string[] = [];
		const player: Player = this.ns.getPlayer();

		for (const server of this.servers) {
			const serverStats: Server = this.ns.getServer(server);

			if (
				serverStats.requiredHackingSkill <= player.skills.hacking &&
				serverStats.hasAdminRights
			) {
				serverList.push(server);
			}
		}
		return serverList;
	}

	public get hackableWithRootAndMoney(): string[] {
		const serverList: string[] = [];
		const player: Player = this.ns.getPlayer();
		for (const server of this.servers) {
			const serverStats: Server = this.ns.getServer(server);
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

	public get hackableWithRootAndMoneyAndRam(): string[] {
		const serverList: string[] = [];
		const player: Player = this.ns.getPlayer();

		for (const server of this.servers) {
			const serverStats: Server = this.ns.getServer(server);
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

	public get documentsLit(): Record<string, string[]> {
		const serverDocuments: Record<string, string[]> = { '': [] };

		for (const server of this.servers) {
			const files: string[] = this.ns.ls(server, 'lit');

			if (files.length && server !== 'home') {
				serverDocuments[server] = files;
			}
		}
		return serverDocuments;
	}

	public get documentsCct(): Record<string, string[]> {
		const serverDocuments: Record<string, string[]> = { '': [] };

		for (const server of this.servers) {
			const files = this.ns.ls(server, 'cct');

			if (files.length && server !== 'home') {
				serverDocuments[server] = files;
			}
		}
		return serverDocuments;
	}

	public get allFiles(): Record<string, string[]> {
		const serverDocuments: Record<string, string[]> = { '': [] };

		for (const server of this.servers) {
			const files = this.ns.ls(server);

			if (files.length && server !== 'home') {
				serverDocuments[server] = files;
			}
		}
		return serverDocuments;
	}

	public get hasNoBackdoor(): string[] {
		const serverList: string[] = [];
		for (const server of this.servers) {
			const serverStats: Server = this.ns.getServer(server);
			if (!serverStats.backdoorInstalled) {
				serverList.push(server);
			}
		}
		return serverList;
	}

	public get hasBackdoor(): string[] {
		const serverList: string[] = [];
		for (const server of this.servers) {
			const serverStats: Server = this.ns.getServer(server);
			if (serverStats.backdoorInstalled) {
				serverList.push(server);
			}
		}
		return serverList;
	}

	private getAllServers(rootHost = 'home') {
		this.ns.disableLog('ALL');
		let pendingScan = [rootHost];
		const list = new Set(pendingScan);
		while (pendingScan.length) {
			const hostname: string = pendingScan.shift()!;
			list.add(hostname);

			pendingScan.push(...this.ns.scan(hostname));
			pendingScan = pendingScan.filter((host) => !list.has(host));
		}
		const finalList = [...list].sort(
			(a, b) =>
				this.ns.getServerRequiredHackingLevel(a) -
				this.ns.getServerRequiredHackingLevel(b)
		);
		return [...finalList];
	}
}
