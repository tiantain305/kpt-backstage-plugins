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

import React, { useEffect, useState } from 'react';
import {
  PackageVariant,
  PackageVariantMetadata,
  PackageVariantSpec,
} from '../../../../../types/PackageVariant';
import { PackageResource } from '../../../../../utils/packageRevisionResources';
import { dumpYaml, loadYaml } from '../../../../../utils/yaml';
import { ResourceMetadataAccordion } from '../Controls';
import { useEditorStyles } from '../styles';
import { PackageVariantSpecEditor } from './components/PackageVariantSpecEditor';

type OnUpdatedYamlFn = (yaml: string) => void;

type ResourceEditorProps = {
  yaml: string;
  onUpdatedYaml: OnUpdatedYamlFn;
  packageResources: PackageResource[];
};

type State = {
  metadata: PackageVariantMetadata;
  spec: PackageVariantSpec;
};

const getResourceState = (deployment: PackageVariant): State => {
  deployment.spec = deployment.spec || {};

  const deploymentSpec = deployment.spec;
  deploymentSpec.upstream = deploymentSpec.upstream || {
    repo: '',
    package: '',
    revision: '',
  };
  deploymentSpec.downstream = deploymentSpec.downstream || {
    repo: '',
    package: '',
  };
  deploymentSpec.labels = deploymentSpec.labels || {};
  deploymentSpec.annotations = deploymentSpec.annotations || {};
  deploymentSpec.adoptionPolicy = deploymentSpec.adoptionPolicy || '';
  deploymentSpec.deletionPolicy = deploymentSpec.deletionPolicy || '';
  deploymentSpec.injectors = deploymentSpec.injectors || {
    group: '',
    version: '',
    kind: '',
    name: '',
  };
  deploymentSpec.packageContext = deploymentSpec.packageContext || { data: {} };

  deploymentSpec.pipeline = deploymentSpec.pipeline || {
    mutators: [],
    validators: [],
  };
  return {
    metadata: deployment.metadata,
    spec: deploymentSpec,
  };
};
export const PackageVariantEditor = ({
  yaml,
  onUpdatedYaml,
  packageResources,
}: ResourceEditorProps) => {
  const resourceYaml = loadYaml(yaml) as PackageVariant;

  const classes = useEditorStyles();

  const [state, setState] = useState<State>(getResourceState(resourceYaml));
  const [expanded, setExpanded] = useState<string>();
  useEffect(() => {
    resourceYaml.metadata = state.metadata;
    resourceYaml.spec = state.spec;

    onUpdatedYaml(dumpYaml(resourceYaml));
  }, [state, resourceYaml, onUpdatedYaml]);

  return (
    <div className={classes.root}>
      <ResourceMetadataAccordion
        id="metadata"
        state={[expanded, setExpanded]}
        value={state.metadata}
        onUpdate={metadata => setState(s => ({ ...s, metadata }))}
      />
      <PackageVariantSpecEditor
        id="spec"
        state={[expanded, setExpanded]}
        value={state.spec}
        packageResources={packageResources}
        onUpdate={spec => setState(s => ({ ...s, spec }))}
      />
    </div>
  );
};
