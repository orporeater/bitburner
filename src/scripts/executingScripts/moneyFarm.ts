import { NS } from '@ns';

export async function main(ns: NS): Promise<void> {
	const target: string = ns.args[0] as string;
	const moneyTreshhold = ns.getServerMaxMoney(target) * 0.75;
	const securityThreshhold = ns.getServerMinSecurityLevel(target) + 5;

	while (true) {
		const moneyAvailable = ns.getServerMoneyAvailable(target);
		const securityLevel = ns.getServerSecurityLevel(target);

		if (securityLevel > securityThreshhold) {
			await ns.weaken(target);
		} else if (moneyAvailable < moneyTreshhold) {
			await ns.grow(target);
		} else {
			await ns.hack(target);
		}
	}
}
