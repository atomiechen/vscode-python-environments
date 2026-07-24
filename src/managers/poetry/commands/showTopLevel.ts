import { CommandConstructorOptions, ListDirectNamesCommand, type BaseExecuteArgs } from '../../base/commands/index';
import { runPoetry } from '../poetryUtils';

export interface PoetryShowTopLevelExecuteArgs extends BaseExecuteArgs {
    cwd?: string;
}

/**
 * Poetry show --top-level command.
 * Parsed command: `poetry show --no-ansi --top-level`
 * Official documentation: https://python-poetry.org/docs/cli/#show
 */
export class PoetryShowTopLevelCommand extends ListDirectNamesCommand {
    constructor(options: CommandConstructorOptions) {
        super(options);
    }

    protected buildCommand(): string[] {
        return ['show', '--no-ansi', '--top-level'];
    }

    async execute(executeArgs?: PoetryShowTopLevelExecuteArgs): Promise<string[]> {
        const args = this.buildCommand();
        const output = await runPoetry(args, executeArgs?.cwd, this.log, executeArgs?.cancellationToken);

        try {
            const names = output
                .split('\n')
                .map((line) => line.trim())
                .map((line) => line.match(/^([a-zA-Z0-9._-]+)/)?.[1] ?? '')
                .filter((name) => !!name);
            return names;
        } catch {
            return [];
        }
    }
}
