import YARGS from "yargs";
import * as PathAPI from "path";
import * as FsAPI from "fs";
import {parseConfig} from "./src/types";
import {sync as globbySync} from "globby";
import {execSync} from 'child_process';
import {__assureDirExists, __writeFileSync, getContractNameFromToml} from "./src/utils";
import chalk from "chalk";
import logger from "./src/logger";
import dotenv from 'dotenv';

function Typechain(
	input: string,
	output: string
) {
	execSync(`npx typechain-polkadot --in ${input} --out ${output}`);
}

function main() {
	const _argv = YARGS(process.argv)
		.option("config", {
			alias: ["c"],
			demandOption: "Please, specify, where to take config file",
			description: "Config file path",
			type: "string",
			default: "./config.json",
		})
		.option("release", {
			alias: ["r"],
			demandOption: "Please, specify, if you want to compile with release",
			description: "Compile with release",
			type: "boolean",
			default: false,
		})
		.option("noCompile", {
			alias: ["nc"],
			demandOption: "Please, specify, if you want to compile",
			description: "Compile",
			type: "boolean",
			default: false,
		})
		.option("noTypechain", {
			alias: ["nt"],
			demandOption: "Please, specify, if you want to compile typechain code",
			description: "Compile typechain code",
			type: "boolean",
			default: false,
		})
		.option("toolchain", {
			alias: ["toolchain"],
			demandOption: "Please, specify, what toolchain you want to use (nightly, stable)",
			description: "Compile typechain code",
			type: "string",
			default: "nightly",
		})
		.help().alias("h", "help")
		.argv;

	const argv = _argv as Awaited<typeof _argv>;

	const cwdPath = process.cwd();
	const absPathToConfig = PathAPI.resolve( cwdPath, `./${argv.config}` );
	const isRelease = argv.release;
	const isNoCompile = argv.noCompile;
	const isNoTypechain = argv.noTypechain;
	const toolchain = argv.toolchain;

	const configStr = FsAPI.readFileSync(absPathToConfig, "utf8");
	const config = parseConfig(configStr);

	if (!isNoCompile) {
		const files = globbySync(config.projectFiles, {onlyFiles: true});
		const tomlFiles = files.filter((file: string) => file.endsWith("Cargo.toml"));

		logger.log(chalk.magenta('======== Found contracts ========'));
		logger.log('\t' + chalk.greenBright(tomlFiles.map(e => getContractNameFromToml(e)).join(',\n\t')));

		const cargoTargetDir = process.env.CARGO_TARGET_DIR;
		const artifactsPath = PathAPI.resolve(cwdPath, config.artifactsPath);

		for (const tomlFile of tomlFiles) {
			const contractName = getContractNameFromToml(tomlFile);

			logger.log(chalk.magenta(`======== Compiling ${contractName} ========`));

			const cmd = `cargo +${toolchain} contract ${isRelease ? "build --release" : "build"} --manifest-path ${tomlFile} ${config.skipLinting ? '--skip-linting' : ''}`;

			execSync(cmd);

			let targetInfo = {
				path: PathAPI.resolve(PathAPI.dirname(tomlFile), 'target', 'ink'),
				name: getContractNameFromToml(tomlFile),
			}

			if (config.isWorkspace) {
				targetInfo = {
					path: PathAPI.resolve(cwdPath, config.workspacePath!, 'target', 'ink', targetInfo.name),
					name: targetInfo.name,
				};
			}

			if (cargoTargetDir) {
				targetInfo = {
					path: PathAPI.resolve(cargoTargetDir, 'ink'),
					name: targetInfo.name,
				};
			}

			__assureDirExists(cwdPath, config.artifactsPath);

			__writeFileSync(
				artifactsPath,
				`${targetInfo.name}.json`,
				FsAPI.readFileSync(PathAPI.resolve(targetInfo.path, 'metadata.json'), "utf8")
			);

			__writeFileSync(
				artifactsPath,
				`${targetInfo.name}.contract`,
				FsAPI.readFileSync(PathAPI.resolve(targetInfo.path, `${targetInfo.name}.contract`), "utf8")
			);

			logger.log(chalk.magenta(`======== Compiled ${contractName} ========`));
		}

		logger.log(chalk.greenBright(`======== Compiled all contracts ========`));
	}

	// path to artifacts
	if (!isNoTypechain) {
		logger.log(chalk.magenta(`======== Compiling Typechain' code ========`));

		Typechain(
			config.artifactsPath,
			config.typechainGeneratedPath
		);

		logger.log(chalk.greenBright(`======== Compiled Typechain' code ========`));
	}

}

main();