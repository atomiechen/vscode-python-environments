import { InstallCommand, type InstallExecuteArgs } from '../../base/commands/index';
import { runCondaExecutable } from '../condaUtils';
import { CondaCommandConstructorOptions } from './condaCommandOptions';

/**
 * Conda install command.
 * Parsed command: `conda install -y -p <environment_path> <package>`
 * Parsed command (upgrade): `conda update -y -p <environment_path> <package>`
 * Official documentation: https://docs.conda.io/projects/conda/en/latest/commands/install.html
 */
export class CondaInstallCommand extends InstallCommand {
    private readonly condaEnvironmentPath: string;

    constructor(options: CondaCommandConstructorOptions) {
        super(options);
        this.condaEnvironmentPath = options.condaEnvironmentPath;
    }

    protected buildCommand(executeArgs: InstallExecuteArgs): string[] {
        const args = [executeArgs.upgrade ? 'update' : 'install', '-y', '-p', this.condaEnvironmentPath];

        args.push(
            ...executeArgs.packages.map((pkg) => {
                if (pkg.version) {
                    return `${pkg.packageName}=${pkg.version}`;
                }
                return pkg.packageName;
            }),
        );

        return args;
    }

    async execute(executeArgs: InstallExecuteArgs): Promise<void> {
        await runCondaExecutable(this.buildCommand(executeArgs), this.log, executeArgs.cancellationToken);
    }
}
