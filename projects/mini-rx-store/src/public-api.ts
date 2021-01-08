/*
 * Public API Surface of mini-rx-store
 */

export { actions$, store, Store } from './lib/store';
export { Feature } from './lib/feature';
export { createFeatureSelector, createSelector } from './lib/selector';
export { Action, Reducer, Actions, ReducerDictionary } from './lib/models';
export { ofType } from './lib/utils';
export {
    ReduxDevtoolsExtension,
    ReduxDevtoolsOptions,
} from './lib/extensions/redux-devtools.extension';
export { LoggerExtension } from './lib/extensions/logger.extension';
export { ImmutableStateExtension } from './lib/extensions/immutable-state.extension';
export { UndoExtension, undo } from './lib/undo.extension';
