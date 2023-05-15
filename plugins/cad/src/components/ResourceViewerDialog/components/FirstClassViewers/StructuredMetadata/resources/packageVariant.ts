/*
Copyright 2023 The Nephio Authors.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0


Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

import { PackageVariant } from '../../../../../../types/PackageVariant';
import { Metadata } from '../StructuredMetadata';

const getValue = (fieldValue: any): string => {
  if (typeof fieldValue === 'boolean') {
    return fieldValue ? 'true' : 'false';
  }

  return fieldValue;
};

const setSpecdata = (
  metadata: Metadata,
  resourceField: any,
  fieldName: string,
): void => {
  if (Array.isArray(resourceField)) {
    const isArrayFieldObject = typeof resourceField[0] === 'object';

    if (isArrayFieldObject) {
      const manyInstances = resourceField.length > 1;

      for (const [idx, oneValue] of resourceField.entries()) {
        const arrayFieldName = `${fieldName}${manyInstances ? idx + 1 : ''}`;
        setSpecdata(metadata, oneValue, arrayFieldName);
      }
    } else {
      metadata[fieldName] = resourceField.map(getValue).join(', ');
    }
  } else if (typeof resourceField === 'object') {
    const objFields = Object.keys(resourceField);

    for (const field of objFields) {
      const newFieldName = `${fieldName}.${field}`;
      setSpecdata(metadata, resourceField[field], newFieldName);
    }
  } else {
    metadata[fieldName] = getValue(resourceField);
  }
};

export const getPackageVariantStructuredMetadata = (
  packageVariant: PackageVariant,
): Metadata => {
  const newMetadata: Metadata = {};
  const customMetadata: Metadata = {};
  const objFields = Object.keys(packageVariant.spec);
  for (const field of objFields) {
    setSpecdata(newMetadata, packageVariant.spec[field], field);
  }

  for (const thisKey of Object.keys(newMetadata)) {
    const isPrefix = thisKey.includes('.');
    const thisKeyName = isPrefix
      ? thisKey.slice(0, thisKey.indexOf('.'))
      : thisKey;

    if (!customMetadata[thisKeyName]) {
      customMetadata[thisKeyName] = [];
    }

    const fieldKey = thisKey.slice(thisKeyName.length + 1);
    customMetadata[thisKeyName].push(
      isPrefix
        ? `${fieldKey}: ${newMetadata[thisKey]}`
        : newMetadata[thisKey],
    );
  }
  return customMetadata;
};
