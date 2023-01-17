import { NS } from '@ns';
import { NSEnums, OwnServerList } from '/scripts/enums/enums.js';
import { ServersList } from '/scripts/classes/serverslist.js';

export async function main(ns: NS) {
	const test = await ns.prompt('Which server type?', {
		type: 'text',
		choices: [OwnServerList.MONEY_SERVER, OwnServerList.FARM_SERVER],
	});
	ns.tprint(test);
}
