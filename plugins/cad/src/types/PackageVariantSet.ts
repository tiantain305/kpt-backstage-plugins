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

import { KubernetesKeyValueObject } from './KubernetesResource';
import { PackageVariantStream } from './PackageVariant';

 export type PackageVariantSet = {
   kind: string;
   apiVersion: string;
   metadata: PackageVariantSetMetadata;
   spec: PackageVariantSetSpec;
 };
 
 export type PackageVariantSetMetadata = {
   name: string;
   namespace?: string;
   labels?: KubernetesKeyValueObject;
   annotations?: KubernetesKeyValueObject;
 };
 
 export type PackageVariantSetSpec = {
  upstream: PackageVariantStream;
  targets: PackageVariantSetTargets[];
 };

  export type PackageVariantSetTargets = {
    repositories: PackageVariantSetRepositories[];
    repositorySelector: PackageVariantSetRepositorySelector;
    objectSelector: string;
  };

  export type PackageVariantSetRepositories = {
    name: string;
    packageNames?: string[];
  }

  export type PackageVariantSetRepositorySelector = {
    matchLabels: KubernetesKeyValueObject;
  }