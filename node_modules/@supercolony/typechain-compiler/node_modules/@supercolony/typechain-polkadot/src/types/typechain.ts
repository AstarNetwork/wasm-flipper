import {TypechainPlugin} from "./interfaces";
import {assureDirExists, generateProjectStructure} from "../utils/directories";
import FsAPI from "fs";
import PathAPI from "path";
import {preprocessABI} from "../utils/abi";
import TypesArgumentsPlugin from "../generators/types-arguments";
import TypesReturnsPlugin from "../generators/types-returns";
import QueryPlugin from "../generators/query";
import BuildExtrinsicPlugin from "../generators/build-extrinsic";
import TxSignAndSendPlugin from "../generators/tx-sign-and-send";
import MixedMethodsPlugin from "../generators/mixed-methods";
import DataPlugin from "../generators/data";
import ContractPlugin from "../generators/contract";
import ConstructorsPlugin from "../generators/constructors";
import EventTypesPlugin from "../generators/events-types";
import EventsPlugin from "../generators/events";
import EventDataPlugin from "../generators/event-data";

export default class TypechainPolkadot {
	plugins: TypechainPlugin[] = [];

	constructor(...plugins: TypechainPlugin[]) {
		this.plugins = plugins;
	}

	loadDefaultPlugins() {
		this.plugins.push(...defaultPlugins);
	}

	async run(
		absPathToABIs: string,
		absPathToOutput: string
	) {
		generateProjectStructure(absPathToOutput);

		for (const plugin of this.plugins) {
			if (plugin.beforeRun) {
				await plugin.beforeRun(
					absPathToABIs,
					absPathToOutput
				);
			}

			assureDirExists(
				absPathToOutput,
				plugin.outputDir
			);
		}

		const fullFileNames = FsAPI.readdirSync(absPathToABIs);

		for(const fullFileName of fullFileNames) {
			if( !fullFileName.endsWith('.json') ) continue;

			const fileName = fullFileName.slice(0, -5);
			const _abiStr = FsAPI.readFileSync( PathAPI.resolve(absPathToABIs, fullFileName), 'utf8' );
			const abi = preprocessABI(_abiStr);

			for (const plugin of this.plugins) {
				await plugin.generate(
					abi,
					fileName,
					absPathToABIs,
					absPathToOutput,
				);
			}
		}
	}

	async loadPluginsFromFiles(fileNames: string[]) {
		const plugins: TypechainPlugin[] = [];
		for (const fileName of fileNames) {
			const plugin = await import(fileName);
			plugins.push(plugin.default);
		}

		console.log('Succesfully loaded plugins: ', plugins.map(p => p.name).join(', '));

		return plugins;
	}

	async loadPluginsRaw(...plugins: TypechainPlugin[]) {
		this.plugins.push(...plugins);
	}
}

export const defaultPlugins: TypechainPlugin[] = [
	new TypesArgumentsPlugin(),
	new TypesReturnsPlugin(),
	new QueryPlugin(),
	new BuildExtrinsicPlugin(),
	new TxSignAndSendPlugin(),
	new MixedMethodsPlugin(),
	new DataPlugin(),
	new ContractPlugin(),
	new ConstructorsPlugin(),
	new EventTypesPlugin(),
	new EventsPlugin(),
	new EventDataPlugin(),
];