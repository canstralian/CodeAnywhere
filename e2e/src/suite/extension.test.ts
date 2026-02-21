import * as assert from "assert"
import * as vscode from "vscode"

suite("CodeFlux AI Kit Extension", () => {
	test("OPENROUTER_API_KEY environment variable is set", () => {
		if (!process.env.OPENROUTER_API_KEY) {
			assert.fail("OPENROUTER_API_KEY environment variable is not set")
		}
	})

	test("Commands should be registered", async () => {
		const expectedCommands = [
			"codeflux.plusButtonClicked",
			"codeflux.mcpButtonClicked",
			"codeflux.historyButtonClicked",
			"codeflux.popoutButtonClicked",
			"codeflux.settingsButtonClicked",
			"codeflux.openInNewTab",
			"codeflux.explainCode",
			"codeflux.fixCode",
			"codeflux.improveCode",
		]

		const commands = await vscode.commands.getCommands(true)

		for (const cmd of expectedCommands) {
			assert.ok(commands.includes(cmd), `Command ${cmd} should be registered`)
		}
	})
})
