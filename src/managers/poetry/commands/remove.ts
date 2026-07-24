import { CommandConstructorOptions, UninstallCommand, type UninstallExecuteArgs } from '../../base/commands/index';
import { runPoetry } from '../poetryUtils';

/**
 * Poetry remove command.
 * Parsed command: `poetry remove <package> [<package> ...]`
 * Official documentation: https://python-poetry.org/docs/cli/#remove
 */
export class PoetryRemoveCommand extends UninstallCommand {
    constructor(options: CommandConstructorOptions) {
        super(options);
    }

    protected buildCommand(executeArgs: UninstallExecuteArgs): string[] {
        return ['remove', ...executeArgs.packages.map((pkg) => pkg.packageName)];
    }

    async execute(executeArgs: UninstallExecuteArgs): Promise<void> {
        const args = this.buildCommand(executeArgs);
        await runPoetry(args, undefined, this.log, executeArgs.cancellationToken);
    }
}
