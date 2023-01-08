# bitburner

to get Startet it is only nessessary to:

```
run scripts/main.js
```

- Imformations about factions are to find in `gameinfos/factions.md`
- Informations about unique Augemntations are in `gameinfos/uniqueAugmentations.md` listed

# .vscode/settings.json

```json
{
	// Linter Settings
	"typescript.validate.enable": true,
	"javascript.validate.enable": false,
	"eslint.validate": ["typescript", "typescriptreact"],
	"eslint.workingDirectories": ["./src"],

	// Bitburner Extension Settings
	"bitburner.authToken": "YourToken",
	"bitburner.scriptRoot": "./dist/",
	"javascript.preferences.importModuleSpecifier": "non-relative",
	"typescript.preferences.importModuleSpecifier": "non-relative",
	"files.exclude": {
		"NetscriptDefinitions.d.ts": true
	}
}
```
