import { NS } from '@ns';

export async function main(ns: NS): Promise<void> {
	const startServer: string = ns.getHostname();
	const target: string = ns.args[0] as string;

	const path = (
		target: string,
		serverName: string,
		serverList: string[],
		ignore: string[],
		isFound: boolean
	): [string[], boolean] => {
		ignore.push(serverName);
		const scanResults = ns.scan(serverName);
		for (const server of scanResults) {
			if (ignore.includes(server)) {
				continue;
			}
			if (server === target) {
				serverList.push(server);
				return [serverList, true];
			}
			serverList.push(server);
			[serverList, isFound] = path(target, server, serverList, ignore, isFound);
			if (isFound) {
				return [serverList, isFound];
			}
			serverList.pop();
		}
		return [serverList, false];
	};

	if (target === undefined) {
		ns.alert('Please provide target server');
		return;
	}

	const [results, isFound] = path(target, startServer, [], [], false);

	if (!isFound) {
		ns.alert('Server not found!');
	} else {
		ns.tprintf(results.join(' --> '));
	}
}
