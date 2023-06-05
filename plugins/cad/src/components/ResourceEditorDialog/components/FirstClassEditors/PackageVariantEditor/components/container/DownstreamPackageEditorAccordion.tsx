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

import { Progress, SelectItem } from '@backstage/core-components';
import { Alert } from '@material-ui/lab';
import { TextField } from '@material-ui/core';
import { useApi } from '@backstage/core-plugin-api';
import React, { Fragment, useRef, useState, useEffect } from 'react';
import useAsync from 'react-use/lib/useAsync';
import { Repository } from '../../../../../../../types/Repository';
import { emptyIfUndefined } from '../../../../../../../utils/string';
import { Select } from '../../../../../../Controls';
import { EditorAccordion } from '../../../Controls';
import { AccordionState } from '../../../Controls/EditorAccordion';
import { configAsDataApiRef } from '../../../../../../../apis';
import { PackageVariantDownstream } from '../../../../../../../types/PackageVariant';

type DownstreamPackageObjectEditorProps = {
  id: string;
  title: string;
  state: AccordionState;
  keyValueObject: PackageVariantDownstream;
  onUpdatedKeyValueObject: (arg0: PackageVariantDownstream) => void;
};

type InternalKeyValue = {
  repo: string;
  package: string;
};

type RepositorySelectItem = SelectItem & {
  repository?: Repository;
};

const mapRepositoryToSelectItem = (
  repository: Repository,
): RepositorySelectItem => ({
  label: repository.metadata.name,
  value: repository.metadata.name,
  repository: repository,
});

export const getRepositoryData = (allRepo: any[], name: string): Repository => {
  const repository = allRepo.find(thisRepo => thisRepo.metadata.name === name);
  return repository;
};

export const DownstreamPackageEditorAccordion = ({
  id,
  title,
  state,
  keyValueObject,
  onUpdatedKeyValueObject,
}: DownstreamPackageObjectEditorProps) => {
  const api = useApi(configAsDataApiRef);
  const refViewModel = useRef<InternalKeyValue>(keyValueObject);
  const viewModel = refViewModel.current;
  const repositoryName = viewModel.repo;

  const [repository, setRepository] = useState<Repository>();
  const [repositorySelectItems, setRepositorySelectItems] = useState<
    RepositorySelectItem[]
  >([]);

  const keyValueObjectUpdated = (): void => {
    onUpdatedKeyValueObject(viewModel);
  };

  const { loading, error } = useAsync(async (): Promise<void> => {
    const [{ items: thisAllRepositories }] = await Promise.all([
      api.listRepositories(),
    ]);

    const thisRepository = repositoryName
      ? getRepositoryData(thisAllRepositories, repositoryName)
      : undefined;

    const targetRepositoryItems = thisAllRepositories.map(
      mapRepositoryToSelectItem,
    );
    setRepository(thisRepository);
    setRepositorySelectItems(targetRepositoryItems);
  }, [api]);

  useEffect(() => {
    viewModel.repo = repository ? repository?.metadata.name : '';
    onUpdatedKeyValueObject(viewModel);
  }, [repository, onUpdatedKeyValueObject, viewModel]);

  if (loading) {
    return <Progress />;
  } else if (error) {
    return <Alert severity="error">{error.message}</Alert>;
  }

  const description = `${viewModel.repo ? `${viewModel.repo}/` : ''}${
    viewModel.package ? `${viewModel.package}` : ''
  }`;

  return (
    <EditorAccordion
      id={id}
      state={state}
      title={title}
      description={description}
    >
      <Fragment>
        <Select
          label="Downstream Repository"
          onChange={selectedRepositoryName =>
            setRepository(
              repositorySelectItems.find(
                r => r.value === selectedRepositoryName,
              )?.repository,
            )
          }
          selected={emptyIfUndefined(repository?.metadata.name)}
          items={repositorySelectItems}
        />

        <TextField
          key="package"
          label="Package"
          variant="outlined"
          value={viewModel.package}
          onChange={e => {
            viewModel.package = e.target.value;
            keyValueObjectUpdated();
          }}
          fullWidth
        />
      </Fragment>
    </EditorAccordion>
  );
};
