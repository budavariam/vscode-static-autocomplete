# DEV notes

## Install locally

```bash
vsce package
code --install-extension "vscode-static-autocomplete-$(jq -r '.version' package.json).vsix"
```