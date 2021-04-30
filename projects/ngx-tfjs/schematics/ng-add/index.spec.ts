import {Schema as WorkspaceOptions} from '@schematics/angular/workspace/schema';
import {Schema as ApplicationOptions} from '@schematics/angular/application/schema';

import { Tree } from '@angular-devkit/schematics';
import { UnitTestTree } from '@angular-devkit/schematics/testing';
import { SchematicTestRunner } from '@angular-devkit/schematics/testing';
import * as path from 'path';

const collectionPath = path.join(__dirname, '../collection.json');

describe('simple-schematic', () => {
  let runner: SchematicTestRunner;
  let appTree: UnitTestTree;

  beforeEach(async () => {
    runner = new SchematicTestRunner('schematics', collectionPath);
    appTree = await runner.runExternalSchematicAsync(
        '@schematics/angular', 'workspace', workspaceOptions).toPromise();
    appTree = await runner.runExternalSchematicAsync(
        '@schematics/angular', 'application', appOptions, appTree).toPromise();
  });

  it('should not fail with an empty tree', async () => {
    const runner = new SchematicTestRunner('schematics', collectionPath);
    await expectAsync(runner.runSchematicAsync('ng-add', {}, Tree.empty()).toPromise())
    .toBeRejected();
  });

  it('should not fail with an empty tree', async () => {
    const tree = (await runner.runSchematicAsync('ng-add', {}, appTree).toPromise());
    expect(tree).not.toBeNull();
    const file = tree.get('/projects/bar/src/app/app.module.ts');

    expect(file?.content.indexOf('TFJSModule')).toBeGreaterThan(-1);
  });
});

const workspaceOptions: WorkspaceOptions = {
  name: 'workspace',
  newProjectRoot: 'projects',
  version: '11.0.0',
};

const appOptions: ApplicationOptions = {
  name: 'bar',
  inlineStyle: false,
  inlineTemplate: false,
  routing: false,
  skipTests: false,
  skipPackageJson: false,
};
