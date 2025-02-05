---
id: effects
title: Effects
slug: /effects
---

Effects trigger side effects like API calls and handle the result:

- An Effect listens for a specific action
- That action triggers the actual side effect
- The Effect needs to return a new action as soon as the side effect completed

```ts
import { actions$, ofType } from 'mini-rx-store';
import {
  LoadTodos,
  LoadTodosSuccess,
  LoadTodosFail,
  TodoActionTypes
} from './todo-actions';
import { mergeMap, map, catchError } from 'rxjs/operators';
import { ajax } from 'rxjs/ajax';
import { of } from 'rxjs';

export const loadEffect = actions$.pipe(
  ofType(TodoActionTypes.LoadTodos),
  mergeMap(() =>
    ajax('https://jsonplaceholder.typicode.com/todos').pipe(
      map(res => new LoadTodosSuccess(res.response)),
      catchError(err => of(new LoadTodosFail(err)))
    )
  )
);

// Register the effect
store.effect(loadEffect);

// Trigger the effect
store.dispatch(new LoadTodos())
```

The code above creates an effect. As soon as the `LoadTodos` action has been dispatched the API call will be executed.
Depending on the result of the API call a new action will be dispatched:
`LoadTodosSuccess` or `LoadTodosFail`.

The effect needs to be registered using `store.effect`.

:::warning
It is important to handle possible API errors with `catchError` to make sure that the effect source does not complete.
A completed effect source will stop listening to actions, and the effect does not work anymore.
:::warning
