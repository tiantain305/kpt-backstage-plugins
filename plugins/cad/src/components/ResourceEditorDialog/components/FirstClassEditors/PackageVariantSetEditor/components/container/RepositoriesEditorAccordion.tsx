/**
 * Copyright 2023 The Nephio Authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React, { useRef, useState } from 'react';
import { clone } from 'lodash';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import { TextField, Button } from '@material-ui/core';
import {
  AccordionState,
  EditorAccordion,
} from '../../../Controls/EditorAccordion';
import { useEditorStyles } from '../../../styles';
import {
  PackageVariantSetRepositories,
  PackageVariantSetTempleate,
} from '../../../../../../../types/PackageVariantSet';
import { PackageResource } from '../../../../../../../utils/packageRevisionResources';
import { TemplateEditorAccordion } from './templates/TemplateEditorAccordion';

type RepositoriesState = {
  repositories?: PackageVariantSetRepositories[];
  template?: PackageVariantSetTempleate;
};
type OnUpdate = (newValue?: RepositoriesState) => void;

type repositoriesEditorProps = {
  id: number;
  title: string;
  targetState: AccordionState;
  target: RepositoriesState;
  packageResources: PackageResource[];
  onUpdate: OnUpdate;
};

export const RepositoriesEditorAccordion = ({
  id,
  title,
  targetState: accordionState,
  target,
  packageResources,
  onUpdate,
}: repositoriesEditorProps) => {
  const classes = useEditorStyles();
  const refViewModel = useRef<RepositoriesState>(clone(target));
  const viewModel = refViewModel.current;

  const [expanded, setExpanded] = useState<string>();
  const [state, setState] = useState<RepositoriesState>(viewModel);
  const valueUpdated = (): void => {
    onUpdate(viewModel);
  };

  return (
    <EditorAccordion
      id={'Repositories-' + id}
      title={title}
      description={'Repositories-' + id}
      state={accordionState}
    >
      {state.repositories &&
        state.repositories.map(
          (target: PackageVariantSetRepositories, index: number) => (
            <EditorAccordion
              id={`Repositories-${index}`}
              title={'Repositories-' + index}
              description={target.name}
              state={[expanded, setExpanded]}
            >
              <div className={classes.multiControlRow}>
                <TextField
                  label="Name"
                  variant="outlined"
                  value={target.name}
                  onChange={e => {
                    target.name = e.target.value;
                    valueUpdated();
                  }}
                  fullWidth
                />
                <TextField
                  label="Package Names"
                  variant="outlined"
                  value={(target.packageNames ?? []).join(', ')}
                  onChange={e => {
                    const value = e.target.value;
                    target.packageNames = value
                      ? value.split(',').map(v => v.trim())
                      : undefined;
                    valueUpdated();
                  }}
                  fullWidth
                />
              </div>
              <div className={classes.multiControlRow}>
                <Button
                  variant="outlined"
                  startIcon={<DeleteIcon />}
                  onClick={() => {
                    state.repositories = state!.repositories!.filter(
                      repositories => repositories !== target,
                    );
                    valueUpdated();
                  }}
                >
                  Delete Repository
                </Button>
              </div>
            </EditorAccordion>
          ),
        )}
      <TemplateEditorAccordion
        id="template"
        title="Template Data"
        state={[expanded, setExpanded]}
        value={state.template || {}}
        packageResources={packageResources}
        onUpdate={updatedRepositories => {
          setState(s => ({
            ...s,
            template: updatedRepositories,
          }));
          valueUpdated();
        }}
      />
      <div className={classes.multiControlRow}>
        <Button
          variant="outlined"
          startIcon={<DeleteIcon />}
          onClick={() => onUpdate(undefined)}
        >
          Delete Repositories
        </Button>
        <Button
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={() => {
            state!.repositories!.push({ name: '' });
            valueUpdated();
            setExpanded(`Repositories-${state!.repositories!.length - 1}`);
          }}
        >
          Add Repository
        </Button>
      </div>
    </EditorAccordion>
  );
};
