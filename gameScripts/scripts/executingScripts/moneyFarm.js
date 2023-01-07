/** @param {NS} ns */
export async function main(ns) {
	const target = ns.args[0];
	const moneyTreshhold = ns.getServerMaxMoney(target) * 0.75;
	const securityThreshhold = ns.getServerMinSecurityLevel(target) + 5;

	while (true) {
		let moneyAvailable = ns.getServerMoneyAvailable(target);
		let securityLevel = ns.getServerSecurityLevel(target);

		if (securityLevel > securityThreshhold) {
			await ns.weaken(target);
		} else if (moneyAvailable < moneyTreshhold) {
			await ns.grow(target);
		} else {
			await ns.hack(target);
		}
	}
}
