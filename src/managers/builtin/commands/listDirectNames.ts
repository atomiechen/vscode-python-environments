import { CommandConstructorOptions, ListDirectNamesCommand, type BaseExecuteArgs } from '../../base/commands/index';
import { runPython, runUV } from '../helpers';

/**
 * Pip list direct names command.
 * Parsed command: `python -m pip list --format=json --not-required`
 * Official documentation: https://pip.pypa.io/en/stable/cli/pip_list/
 */
export class PipListDirectNamesCommand extends ListDirectNamesCommand {
    constructor(options: CommandConstructorOptions) {
        super(options);
    }
    protected buildCommand(): string[] {
        return ['-m', 'pip', 'list', '--format=json', '--not-required'];
    }

    async execute(executeArgs?: BaseExecuteArgs): Promise<string[]> {
        let directNames: string[] = [];

        const parser = (output: string): void => {
            let packages: unknown;
            try {
                packages = JSON.parse(output);
            } catch (e) {
                this.log?.error(`Failed to parse pip list output: ${e}`);
                return;
            }
            if (!Array.isArray(packages)) {
                this.log?.error('Invalid output from pip list command');
                return;
            }
            directNames = packages.filter(({ name }) => name).map(({ name }) => name);
        };

        const args = this.buildCommand();

        const output = await runPython(
            this.pythonExecutable,
            args,
            undefined,
            this.log,
            executeArgs?.cancellationToken,
            this.timeout,
        );

        parser(output);
        return directNames;
    }
}

/**
 * UV list direct names command.
 * Parsed command: `uv pip list --format=json --not-required --python <path>`
 * Official documentation: https://docs.astral.sh/uv/pip/
 */
export class UvListDirectNamesCommand extends ListDirectNamesCommand {
    constructor(options: CommandConstructorOptions) {
        super(options);
    }

    protected buildCommand(): string[] {
        return ['pip', 'list', '--format=json', '--not-required', '--python', this.pythonExecutable];
    }

    async execute(executeArgs?: BaseExecuteArgs): Promise<string[]> {
        let directNames: string[] = [];

        const parser = (output: string): void => {
            let packages: unknown;
            try {
                packages = JSON.parse(output);
            } catch (e) {
                this.log?.error(`Failed to parse uv pip list output: ${e}`);
                return;
            }
            if (!Array.isArray(packages)) {
                this.log?.error('Invalid output from uv pip list command');
                return;
            }
            directNames = packages.filter(({ name }) => name).map(({ name }) => name);
        };

        const args = this.buildCommand();

        const output = await runUV(args, undefined, this.log, executeArgs?.cancellationToken, this.timeout);

        parser(output);
        return directNames;
    }
}
