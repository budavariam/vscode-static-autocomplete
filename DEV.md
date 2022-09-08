# DEV notes

## Install locally

```bash
npm version patch --git-tag-version false 
vsce package
code --install-extension "vscode-static-autocomplete-$(jq -r '.version' package.json).vsix"
```
