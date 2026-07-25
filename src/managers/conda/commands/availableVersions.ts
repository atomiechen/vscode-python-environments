import {
    AvailableVersionsCommand,
    CommandConstructorOptions,
    type AvailableVersionsExecuteArgs,
} from '../../base/commands/index';
import { runCondaExecutable } from '../condaUtils';

/**
 * Conda available versions command.
 * Parsed command: `conda search <package> --json`
 * Official documentation: https://docs.conda.io/projects/conda/en/latest/commands/search.html
 */
export class CondaAvailableVersionsCommand extends AvailableVersionsCommand {
    constructor(options: CommandConstructorOptions) {
        super(options);
    }

    protected buildCommand(executeArgs: AvailableVersionsExecuteArgs): string[] {
        return ['search', executeArgs.packageName, '--json'];
    }

    async execute(executeArgs: AvailableVersionsExecuteArgs): Promise<string[]> {
        const output = await runCondaExecutable(
            this.buildCommand(executeArgs),
            this.log,
            executeArgs.cancellationToken,
        );

        try {
            const parsed = JSON.parse(output);
            if (parsed && typeof parsed === 'object' && Array.isArray(parsed[executeArgs.packageName])) {
                const uniqueVersions = new Map<string, string>();
                (parsed[executeArgs.packageName] as Array<{ version?: string }>)
                    .filter((entry) => !!entry.version?.trim())
                    .forEach((entry) => {
                        const version = entry.version!.trim();
                        if (!uniqueVersions.has(version)) {
                            uniqueVersions.set(version, version);
                        }
                    });

                return Array.from(uniqueVersions.values());
            }
            return [];
        } catch {
            return [];
        }
    }
}
