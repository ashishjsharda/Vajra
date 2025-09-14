import * as vscode from 'vscode';

export class Utils {
  static getSelectedText(): string | undefined {
    const editor = vscode.window.activeTextEditor;
    if (!editor) return undefined;

    const selection = editor.selection;
    return editor.document.getText(selection);
  }

  static getCurrentFileContent(): string | undefined {
    const editor = vscode.window.activeTextEditor;
    return editor?.document.getText();
  }

  static getLanguage(): string | undefined {
    return vscode.window.activeTextEditor?.document.languageId;
  }

  static showError(message: string) {
    vscode.window.showErrorMessage(`Vajra: ${message}`);
  }

  static showInfo(message: string) {
    vscode.window.showInformationMessage(`Vajra: ${message}`);
  }

  static async showQuickPick(items: vscode.QuickPickItem[]): Promise<vscode.QuickPickItem | undefined> {
    return vscode.window.showQuickPick(items, {
      placeHolder: 'Select an option'
    });
  }
}