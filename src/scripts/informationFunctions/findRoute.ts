import { NS } from '@ns';

export async function main(ns: NS): Promise<void> {
	const startServer: string = ns.getHostname();
	const target: string = ns.args[0] as string;

	if (target === undefined) {
		ns.alert('Please provide target server');
		return;
	}

	const [results, isFound] = findPath(target, startServer);
	if (!isFound) {
		ns.alert('Server not found!');
	} else {
		ns.tprintf(results.join(' --> '));
	}

	function findPath(target: string, startServer: string): [string[], boolean] {
		const ignore: string[] = [startServer];
		const scanResults: string[] = ns.scan(startServer);

		let isFound = false;
		let serverList: string[] = [];

		for (const server of scanResults) {
			if (ignore.includes(server)) {
				continue;
			}
			if (server === target) {
				serverList.push(server);
				return [serverList, true];
			}
			serverList.push(server);
			[serverList, isFound] = findPath(target, server);
			if (isFound) {
				return [serverList, isFound];
			}
			serverList.pop();
		}
		return [serverList, false];
	}
}
