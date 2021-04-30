import { SchematicContext, Tree } from '@angular-devkit/schematics';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';
import { addImportToModule } from '@schematics/angular/utility/ast-utils';
import { getAppModulePath } from '@schematics/angular/utility/ng-ast-utils';
import { JsonValue } from '@angular-devkit/core';
import { applyToUpdateRecorder } from '@schematics/angular/utility/change';
import {
  ProjectDefinition,
  WorkspaceDefinition,
} from '@angular-devkit/core/src/workspace';
import { getWorkspace } from '@schematics/angular/utility/workspace';
import { SchematicsException } from '@angular-devkit/schematics';
import { Schema } from './schema';
import * as ts from 'typescript';

export function getProjectFromWorkspace(
  workspace: WorkspaceDefinition,
  projectName = workspace.extensions.defaultProject as string
): ProjectDefinition {
  const project = workspace.projects.get(projectName);

  if (!project) {
    throw new SchematicsException(
      `Could not find project in workspace: ${projectName}`
    );
  }

  return project;
}

/** Resolves the architect options for the build target of the given project. */
export function getProjectTargetOptions(
  project: ProjectDefinition,
  buildTarget: string
): Record<string, JsonValue | undefined> {
  const options = project.targets?.get(buildTarget)?.options;

  if (!options) {
    throw new Error(
      `Cannot determine project target configuration for: ${buildTarget}.`
    );
  }

  return options;
}

export function ngAdd(options: Schema) {
  return async (host: Tree, context: SchematicContext) => {
    console.log('📦', 'Adding the package to your dependencies...')
    context.addTask(new NodePackageInstallTask());

    // Add the `TFJSModule` to `AppModule`.
    console.log('🤖', 'Adding TensorFlow.js bindings to your app...')
    const workspace = await getWorkspace(host);
    const project = getProjectFromWorkspace(workspace, options.project);
    const buildOptions = getProjectTargetOptions(project, 'build');

    if (!buildOptions.main) {
      throw new Error(
        `Could not find the project main file inside of the ` +
          `workspace config (${project.sourceRoot})`
      );
    }

    const appModulePath = getAppModulePath(
      host,
      buildOptions.main as string
    );

    const appModule = host.read(appModulePath);
    if (!appModule) {
      console.log('⚠️', 'Make sure you add TFJSModule from ngx-tfjs to your AppModule.')
      return host;
    }

    const changes = addImportToModule(
      ts.createSourceFile(
        appModulePath,
        appModule.toString(),
        ts.ScriptTarget.Latest,
        true,
        ts.ScriptKind.TS
      ),
      appModulePath,
      'TFJSModule',
      'ngx-tfjs'
    );

    const recorder = host.beginUpdate(appModulePath);
    applyToUpdateRecorder(recorder, changes);
    host.commitUpdate(recorder);
    console.log('✨', 'You are all set to make your apps smarter!')

    return host;
  };
}
