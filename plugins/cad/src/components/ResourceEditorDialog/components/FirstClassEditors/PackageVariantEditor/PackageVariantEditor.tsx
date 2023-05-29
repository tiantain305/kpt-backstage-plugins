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
import { cloneDeep } from 'lodash';
import { KptfilePipeline } from '../../../../../types/Kptfile';
import { KubernetesKeyValueObject } from '../../../../../types/KubernetesResource';
import {
  PackageVariant,
  PackageVariantMetadata,
  PackageVariantSpec,
  PackageVariantUpstream,
  PackageVariantDownstream,
  PackageVariantInjectors,
  PackageVariantPackageContext,
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
  spec: PackageVariantSpec;
};

const getResourceState = (deployment: PackageVariant): State => {
  const deploymentSpec = deployment.spec || {
    upstream: {},
    downstream: {},
    pipeline: {},
    packageContext: {},
  };
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
  const specData = {
    upstream: deploymentSpec.upstream,
    downstream: deploymentSpec.downstream,
    labels: deploymentSpec.labels,
    annotations: deploymentSpec.annotations,
    adoptionPolicy: deploymentSpec.adoptionPolicy,
    deletionPolicy: deploymentSpec.deletionPolicy,
    injectors: deploymentSpec.injectors,
    packageContext: deploymentSpec.packageContext,
    pipeline: deploymentSpec.pipeline,
  };
  return {
    spec: specData,
  };
};
export const PackageVariantEditor = ({
  yaml,
  onUpdatedYaml,
  packageResources,
}: ResourceEditorProps) => {
  const resourceYaml = loadYaml(yaml) as PackageVariant;

  const classes = useEditorStyles();

  const [state, setState] = useState<PackageVariant>(resourceYaml);
  const [specState, setSpecState] = useState<State>(
    getResourceState(resourceYaml),
  );
  const [expanded, setExpanded] = useState<string>();

  useEffect(() => {
    resourceYaml.metadata = state.metadata;

    const spec = {
      ...(Object.keys(specState.spec.upstream).length && {
        upstream: cloneDeep(specState.spec.upstream),
      }),
      ...(Object.keys(specState.spec.downstream).length && {
        downstream: cloneDeep(specState.spec.downstream),
      }),
      ...(Object.keys(specState.spec.labels).length && {
        labels: specState.spec.labels,
      }),
      ...(Object.keys(specState.spec.annotations).length && {
        annotations: specState.spec.annotations,
      }),
      ...(specState.spec.adoptionPolicy && {
        adoptionPolicy: specState.spec.adoptionPolicy,
      }),
      ...(specState.spec.deletionPolicy && {
        deletionPolicy: specState.spec.deletionPolicy,
      }),
      ...(specState.spec.injectors.name && {
        injectors: cloneDeep(specState.spec.injectors),
      }),
      ...(Object.keys(specState.spec.packageContext).length && {
        packageContext: cloneDeep(specState.spec.packageContext),
      }),
      ...(Object.keys(specState.spec.pipeline).length && {
        pipeline: cloneDeep(specState.spec.pipeline),
      }),
    };

    resourceYaml.spec = spec;
    onUpdatedYaml(dumpYaml(resourceYaml));
  }, [state, specState, resourceYaml, onUpdatedYaml]);

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
        value={specState.spec}
        packageResources={packageResources}
        onUpdate={spec => setSpecState(s => ({ ...s, spec }))}
      />
    </div>
  );
};
