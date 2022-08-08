import { ChildProcessWithoutNullStreams, spawn } from "child_process";
import { CommandExecutor } from "../../core/executor/command.executor.js";
import { ICommandExec } from "../../core/executor/command.types.js";
import { IStreamLogger } from "../../core/handlers/stream-logger.interface.js";
import { StreamHandler } from "../../core/handlers/stream.handler.js";
import { PromptService } from "../../core/prompt/prompt.service.js";
import { DirBuilder } from "./dir.builder.js";
import { DirInput } from "./dir.types.js";

export class DirExecuter extends CommandExecutor<DirInput> {
	private promptService: PromptService = new PromptService()
	constructor(
		logger: IStreamLogger,
	) {
		super(logger);
	}

	protected async prompt(): Promise<DirInput> {
		let path = await this.promptService.input<string>('Путь', 'input');
		return { path };
	}

	protected build({ path }: DirInput): ICommandExec {
		const args = (new DirBuilder())
			.detailedOutput()
			.output();
		return { command: 'ls', args: args.concat(path) };
	}

	protected spawn({ command, args }: ICommandExec): ChildProcessWithoutNullStreams {
		return spawn(command, args);
	}
    
	protected processStream(stream: ChildProcessWithoutNullStreams, output: IStreamLogger): void {
		const handler = new StreamHandler(output);
		handler.proccessOutput(stream);
	}
}