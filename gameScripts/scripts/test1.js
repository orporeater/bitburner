/** @param {NS} ns */
export async function main(ns) {
	let text = await ns.prompt('What kind of a server you want to purchase?', {
		type: 'select',
		choices: ['ExpFarming', 'MoneyFarming'],
	});
	ns.tprint(text);
}
