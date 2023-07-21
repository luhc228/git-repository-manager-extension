import * as vscode from 'vscode';
import { createTreeView as createRepoExplorerTreeView } from './repoExplorerTreeView';

export default function createTreeViews(context: vscode.ExtensionContext) {
  createRepoExplorerTreeView(context);
}
