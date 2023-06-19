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
import { PackageVariantSetSpec } from '../../../../../../types/PackageVariantSet';
import { PackageResource } from '../../../../../../utils/packageRevisionResources';
import {
  AccordionState,
  EditorAccordion,
} from '../../Controls/EditorAccordion';
import { UpstreamPackageEditorAccordion } from '../../PackageVariantEditor/components/container/UpstreamPackageEditorAccordion';
import { TargetEditorAccordion } from './container/TargetEditorAccordion';

type OnUpdate = (value: PackageVariantSetSpec) => void;

type PackageVariantSetSpecEditorProps = {
  state: AccordionState;
  value: PackageVariantSetSpec;
  onUpdate: OnUpdate;
  packageResources: PackageResource[];
};

export const PackageVariantSetSpecEditor = ({
  state,
  value,
  onUpdate,
  packageResources,
}: PackageVariantSetSpecEditorProps) => {
  const refViewModel = useRef<PackageVariantSetSpec>(value);
  const viewModel = refViewModel.current;
  const [specExpanded, setSpecExpanded] = useState<string>();
  const valueUpdated = (): void => {
    onUpdate(viewModel);
  };

  return (
    <EditorAccordion id="spec" title="Spec" state={state}>
      <UpstreamPackageEditorAccordion
        id="upstream"
        state={[specExpanded, setSpecExpanded]}
        title="Upstream"
        keyValueObject={viewModel.upstream || {}}
        onUpdatedKeyValueObject={upstream => {
          viewModel.upstream = upstream;
          valueUpdated();
        }}
      />
      <TargetEditorAccordion
        id="Target"
        title="Target"
        packageResources={packageResources}
        targetState={[specExpanded, setSpecExpanded]}
        keyValueObject={viewModel.targets || []}
        onUpdate={targetData => {
          viewModel.targets = targetData;
          valueUpdated();
        }}
      />
    </EditorAccordion>
  );
};
