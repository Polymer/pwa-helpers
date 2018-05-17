/**
@license
Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

import * as r from 'redux';
export const TOGGLE = 'TOGGLE';
export const FORCE_TOGGLE = 'FORCE_TOGGLE';

export interface LazyActionToggle extends r.Action<'TOGGLE'> { };
export interface LazyActionForceToggle extends r.Action<'FORCE_TOGGLE'> {
  value: boolean,
};
export type LazyAction = LazyActionToggle | LazyActionForceToggle;

export const toggle = () => {
  const action: LazyActionToggle = {
    type: TOGGLE,
  };

  return action
};

export const forceToggle = (value: boolean) => {
  const action: LazyActionForceToggle = {
    type: FORCE_TOGGLE,
    value
  };

  return action
};
