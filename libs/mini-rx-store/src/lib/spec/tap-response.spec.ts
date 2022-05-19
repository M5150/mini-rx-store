// Credits go to NgRx
// Copied from with small modifications: https://github.com/ngrx/platform/blob/13.2.0/modules/component-store/spec/tap-response.spec.ts

// The MIT License (MIT)
//
// Copyright (c) 2017 Brandon Roberts, Mike Ryan, Victor Savkin, Rob Wormald
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

import { EMPTY, noop, Observable, of, throwError } from 'rxjs';
import { concatMap, finalize } from 'rxjs/operators';
import { tapResponse } from '../tap-response';

describe('tapResponse', () => {
    it('should invoke next callback on next', () => {
        const nextCallback = jest.fn<void, [number]>();

        of(1, 2, 3).pipe(tapResponse(nextCallback, noop)).subscribe();

        expect(nextCallback.mock.calls).toEqual([[1], [2], [3]]);
    });

    it('should invoke error callback on error', () => {
        const errorCallback = jest.fn<void, [{ message: string }]>();
        const error = { message: 'error' };

        throwError(() => error)
            .pipe(tapResponse(noop, errorCallback))
            .subscribe();

        expect(errorCallback).toHaveBeenCalledWith(error);
    });

    it('should invoke complete callback on complete', () => {
        const completeCallback = jest.fn<void, []>();

        EMPTY.pipe(tapResponse(noop, noop, completeCallback)).subscribe();

        expect(completeCallback).toHaveBeenCalledWith();
    });

    it('should not unsubscribe from outer observable on inner observable error', () => {
        const innerCompleteCallback = jest.fn<void, []>();
        const outerCompleteCallback = jest.fn<void, []>();

        new Observable((subscriber) => subscriber.next(1))
            .pipe(
                concatMap(() =>
                    throwError(() => 'error').pipe(
                        tapResponse(noop, noop),
                        finalize(innerCompleteCallback)
                    )
                ),
                finalize(outerCompleteCallback)
            )
            .subscribe();

        expect(innerCompleteCallback).toHaveBeenCalled();
        expect(outerCompleteCallback).not.toHaveBeenCalled();
    });
});
