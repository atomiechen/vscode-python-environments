import { CommandConstructorOptions, UninstallCommand, type UninstallExecuteArgs } from '../../base/commands/index';
import { runCondaExecutable } from '../condaUtils';

/**
 * Conda uninstall command execute arguments (includes the target environment path).
 */
export interface CondaUninstallExecuteArgs extends UninstallExecuteArgs {
    environmentPath: string;
}

/**
 * Conda uninstall command.
 * Parsed command: `conda remove -y -p <environment_path> <package>`
 * Official documentation: https://conda.io/projects/conda/en/latest/commands/remove.html
 */
export class CondaUninstallCommand extends UninstallCommand {
    constructor(options: CommandConstructorOptions) {
        super(options);
    }

    protected buildCommand(executeArgs: UninstallExecuteArgs): string[] {
        const args = ['remove', '-y'];

        const { environmentPath } = executeArgs as CondaUninstallExecuteArgs;
        if (environmentPath) {
            args.push('-p', environmentPath);
        }

        args.push(...executeArgs.packages.map((pkg) => pkg.packageName));
        return args;
    }

    async execute(executeArgs: UninstallExecuteArgs): Promise<void> {
        const args = this.buildCommand(executeArgs);

        await runCondaExecutable(args, this.log, executeArgs.cancellationToken);
    }
}
