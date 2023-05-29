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

import { SelectItem } from '@backstage/core-components';
import { TextField } from '@material-ui/core';
import React, { Fragment, useRef, useState, useEffect } from 'react';
import { KubernetesKeyValueObject } from '../../../../../../../types/KubernetesResource';
import { Repository } from '../../../../../../../types/Repository';
import { Select } from '../../../../../../Controls';
import { EditorAccordion } from '../../../Controls';
import { AccordionState } from '../../../Controls/EditorAccordion';

type OnUpdatedKeyValueObject = (
  keyValueObject: KubernetesKeyValueObject,
) => void;

type UpstreamPackageObjectEditorProps = {
  id: string;
  title: string;
  state: AccordionState;
  keyValueObject: KubernetesKeyValueObject;
  onUpdatedKeyValueObject: OnUpdatedKeyValueObject;
};

type InternalKeyValue = {
  repo: string;
  package: string;
  revision?: string;
};

type RepositorySelectItem = SelectItem & {
  repository?: Repository;
};

export const UpstreamPackageEditorAccordion = ({
  id,
  title,
  state,
  keyValueObject,
  onUpdatedKeyValueObject,
}: UpstreamPackageObjectEditorProps) => {
  const [repository, setRepository] = useState<string>(
    keyValueObject.repo || 'none',
  );
  const [upstreamPackage, setUpstreamPackage] = useState<string>(
    keyValueObject.package || 'none',
  );
  const [repositorySelectItems, setRepositorySelectItems] = useState<string[]>(
    [],
  );

  const [packageSelectItems, setPackageSelectItems] = useState<string[]>([]);

  const refViewModel = useRef<InternalKeyValue>(keyValueObject);
  const viewModel = refViewModel.current;

  const keyValueObjectUpdated = (): void => {
    onUpdatedKeyValueObject(viewModel);
  };

  const description = `${viewModel.repo ? `${viewModel.repo}/` : ''}${
    viewModel.package ? `${viewModel.package}` : ''
  }${viewModel.package ? `@${viewModel.package}` : ''}`;
  useEffect(() => {
    const allRepoList = [];
    allRepoList.push({
      label: `${viewModel.repo}`,
      value: viewModel.repo,
    });
    setRepositorySelectItems(allRepoList);
    const allPackageList = [];
    allPackageList.push({
      label: `${viewModel.package}`,
      value: viewModel.package,
    });
    setPackageSelectItems(allPackageList);
  }, [keyValueObject]);

  return (
    <EditorAccordion
      id={id}
      state={state}
      title={title}
      description={description}
    >
      <Fragment>
        <Select
          label="Upstream Repository"
          onChange={value => setRepository(value)}
          selected={repository}
          items={repositorySelectItems}
        />

        <Select
          label="Upstream Package"
          onChange={value => setUpstreamPackage(value)}
          selected={upstreamPackage}
          items={packageSelectItems}
        />
        <TextField
          key="revision"
          label="Revision"
          variant="outlined"
          value={viewModel.revision}
          onChange={e => {
            viewModel.revision = e.target.value;
            keyValueObjectUpdated();
          }}
          fullWidth
        />
      </Fragment>
    </EditorAccordion>
  );
};
