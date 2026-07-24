import {
    AvailableVersionsCommand,
    CommandConstructorOptions,
    type AvailableVersionsExecuteArgs,
} from '../../base/commands/index';
import { runPython, runUV } from '../helpers';

/**
 * Pip available versions command.
 * Parsed command: `python -m pip index versions <package> --json --python-version <version>`
 * Official documentation: https://pip.pypa.io/en/stable/cli/pip_index/
 */
export class PipAvailableVersionsCommand extends AvailableVersionsCommand {
    constructor(options: CommandConstructorOptions) {
        super(options);
    }
    protected buildCommand(executeArgs: AvailableVersionsExecuteArgs): string[] {
        const baseVersion = executeArgs.pythonVersion.split('.').slice(0, 2).join('.');
        return ['-m', 'pip', 'index', 'versions', executeArgs.packageName, '--json', '--python-version', baseVersion];
    }

    async execute(executeArgs: AvailableVersionsExecuteArgs): Promise<string[]> {
        const args = this.buildCommand(executeArgs);

        const output = await runPython(
            this.pythonExecutable,
            args,
            undefined,
            this.log,
            executeArgs.cancellationToken,
            this.timeout,
        );

        const match = output.match(/{[\s\S]*}/);
        if (!match) {
            return [];
        }

        try {
            const parsed = JSON.parse(match[0]) as { versions?: string[] };
            let versions = Array.isArray(parsed.versions) ? parsed.versions.filter((v) => !!v.trim()) : [];
            if (!executeArgs.includePrerelease) {
                versions = versions.filter((version) => !/[ab]|rc|dev/i.test(version));
            }
            return versions;
        } catch {
            return [];
        }
    }
}

/**
 * UV available versions command.
 * Parsed command: `uv pip index versions <package> --json --python-version <version>`
 * Official documentation: https://docs.astral.sh/uv/pip/
 */
export class UvAvailableVersionsCommand extends AvailableVersionsCommand {
    constructor(options: CommandConstructorOptions) {
        super(options);
    }

    protected buildCommand(executeArgs: AvailableVersionsExecuteArgs): string[] {
        const baseVersion = executeArgs.pythonVersion.split('.').slice(0, 2).join('.');
        return ['pip', 'index', 'versions', executeArgs.packageName, '--json', '--python-version', baseVersion];
    }

    async execute(executeArgs: AvailableVersionsExecuteArgs): Promise<string[]> {
        const args = this.buildCommand(executeArgs);

        const output = await runUV(args, undefined, this.log, executeArgs.cancellationToken, this.timeout);

        const match = output.match(/{[\s\S]*}/);
        if (!match) {
            return [];
        }

        try {
            const parsed = JSON.parse(match[0]) as { versions?: string[] };
            let versions = Array.isArray(parsed.versions) ? parsed.versions.filter((v) => !!v.trim()) : [];
            if (!executeArgs.includePrerelease) {
                versions = versions.filter((version) => !/[ab]|rc|dev/i.test(version));
            }
            return versions;
        } catch {
            return [];
        }
    }
}
