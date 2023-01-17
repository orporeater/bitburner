import { NS } from '@ns';
import { ServersList } from '/scripts/classes/serverslist.js';
import { OwnServerList, ScriptPath } from '/scripts/enums/enums.js';

export async function main(ns: NS): Promise<void> {
	while (true) {
		const ownServers: string[] = new ServersList(ns).ownedServer;
		const player = ns.getPlayer();

		for (const server of ownServers) {
			const actRam = ns.getServerMaxRam(server);
			let exponent = Math.log(actRam) / Math.log(2);
			if (exponent < 20) {
				exponent++;
				let cost = ns.getPurchasedServerUpgradeCost(server, 2 ** exponent);

				for (let i = exponent; i <= 20; i++) {
					if (ns.getPurchasedServerUpgradeCost(server, 2 ** i) > player.money) {
						exponent = i - 1;
						break;
					}
					exponent = 20;
				}

				cost = ns.getPurchasedServerUpgradeCost(server, 2 ** exponent);

				if (cost < player.money) {
					ns.upgradePurchasedServer(server, 2 ** exponent);
					if (server.includes(OwnServerList.MONEY_SERVER)) {
						ns.exec(ScriptPath.RUN_MONEY_SERVERS, OwnServerList.HOME);
					}
					if (server.includes(OwnServerList.FARM_SERVER)) {
						ns.exec(
							ScriptPath.RUN_EXP_SERVERS,
							OwnServerList.HOME,
							1,
							OwnServerList.TARGET_EXP_FARM_SERVERS
						);
					}
				}
			}
		}
		await ns.sleep(30000);
	}
}
