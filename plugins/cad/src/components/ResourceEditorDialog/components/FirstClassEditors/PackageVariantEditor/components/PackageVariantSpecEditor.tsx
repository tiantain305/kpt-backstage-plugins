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

import { TextField } from '@material-ui/core';
import React, { useRef, useState } from 'react';
import { PackageVariantSpec } from '../../../../../../types/PackageVariant';
import { isMutatorFunction } from '../../../../../../utils/function';
import { PackageResource } from '../../../../../../utils/packageRevisionResources';
import { emptyIfUndefined } from '../../../../../../utils/string';
import {
  AccordionState,
  EditorAccordion,
} from '../../Controls/EditorAccordion';
import { KeyValueEditorAccordion } from '../../Controls/KeyValueEditorAccordion';
import { PackageContextEditorAccordion } from './container/PackageContextEditorAccordion';
import { PipelineEditorAccordion } from './container/PipelineEditorAccordion';
import { ValueEditorAccordion } from './container/ValueEditorAccordion';

type OnUpdate = (value: PackageVariantSpec) => void;

type PackageVariantSpecEditorProps = {
  id: string;
  state: AccordionState;
  value: PackageVariantSpec;
  onUpdate: OnUpdate;
  packageResources: PackageResource[];
};

export const PackageVariantSpecEditor = ({
  id,
  state,
  value,
  onUpdate,
  packageResources,
}: PackageVariantSpecEditorProps) => {
  const refViewModel = useRef<PackageVariantSpec>(value);
  const viewModel = refViewModel.current;
  const [specExpanded, setSpecExpanded] = useState<string>();

  const valueUpdated = (): void => {
    onUpdate(viewModel);
  };
  return (
    <EditorAccordion id="spec" title="Spec Data" state={state}>
      <KeyValueEditorAccordion
        id="labels"
        state={[specExpanded, setSpecExpanded]}
        title="Labels"
        keyValueObject={viewModel.labels || {}}
        onUpdatedKeyValueObject={labels => {
          viewModel.labels =
            Object.keys(labels).length > 0 ? labels : undefined;
          valueUpdated();
        }}
      />
      <KeyValueEditorAccordion
        id="annotations"
        state={[specExpanded, setSpecExpanded]}
        title="Annotations"
        keyValueObject={viewModel.annotations || {}}
        onUpdatedKeyValueObject={annotations => {
          viewModel.annotations =
            Object.keys(annotations).length > 0 ? annotations : undefined;
          valueUpdated();
        }}
      />
      <ValueEditorAccordion
        id="upstream"
        state={[specExpanded, setSpecExpanded]}
        title="Upstream"
        keyValueObject={viewModel.upstream || {}}
        onUpdatedKeyValueObject={upstream => {
          viewModel.upstream =
            Object.keys(upstream).length > 0 ? upstream : undefined;
          valueUpdated();
        }}
      />
      <ValueEditorAccordion
        id="downstream"
        state={[specExpanded, setSpecExpanded]}
        title="Downstream"
        keyValueObject={viewModel.downstream || {}}
        onUpdatedKeyValueObject={downstream => {
          viewModel.downstream =
            Object.keys(downstream).length > 0 ? downstream : undefined;
          valueUpdated();
        }}
      />
      <PackageContextEditorAccordion
        id="package-Context"
        state={[specExpanded, setSpecExpanded]}
        value={viewModel.packageContext}
        onUpdate={packageContext => {
          viewModel.packageContext =
            Object.keys(packageContext).length > 0 ? packageContext : undefined;
          valueUpdated();
        }}
      />
      <TextField
        label="Adoption Policy"
        variant="outlined"
        value={emptyIfUndefined(viewModel.adoptionPolicy)}
        onChange={e => {
          viewModel.adoptionPolicy = e.target.value;
          valueUpdated();
        }}
        fullWidth
      />
      <TextField
        label="Deletion Policy"
        variant="outlined"
        value={emptyIfUndefined(viewModel.deletionPolicy)}
        onChange={e => {
          viewModel.deletionPolicy = e.target.value;
          valueUpdated();
        }}
        fullWidth
      />
      <PipelineEditorAccordion
        id="pipeline"
        pipeLinestate={[specExpanded, setSpecExpanded]}
        keyValueObject={viewModel.pipeline || {}}
        onUpdatedYaml={pipeline => {
          viewModel.pipeline =
            Object.keys(pipeline).length > 0 ? pipeline : undefined;
          valueUpdated();
        }}
        pipelineFunction={isMutatorFunction}
        packageResources={packageResources}
      />
      <ValueEditorAccordion
        id="injectors"
        state={[specExpanded, setSpecExpanded]}
        title="Injectors"
        keyValueObject={viewModel.injectors || {}}
        onUpdatedKeyValueObject={injectors => {
          viewModel.injectors =
            Object.keys(injectors).length > 0 ? injectors : undefined;
          valueUpdated();
        }}
      />
    </EditorAccordion>
  );
};
