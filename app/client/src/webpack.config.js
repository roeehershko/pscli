const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ProgressPlugin = require('webpack/lib/ProgressPlugin');
const CircularDependencyPlugin = require('circular-dependency-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const autoprefixer = require('autoprefixer');
const postcssUrl = require('postcss-url');
const cssnano = require('cssnano');
const customProperties = require('postcss-custom-properties');

const { NoEmitOnErrorsPlugin, SourceMapDevToolPlugin, NamedModulesPlugin } = require('webpack');
const { NamedLazyChunksWebpackPlugin, BaseHrefWebpackPlugin } = require('@angular/cli/plugins/webpack');
const { CommonsChunkPlugin } = require('webpack').optimize;
const { AngularCompilerPlugin } = require('@ngtools/webpack');

const nodeModules = path.join(process.cwd(), 'node_modules');
const realNodeModules = fs.realpathSync(nodeModules);
const genDirNodeModules = path.join(process.cwd(), 'src', '$$_gendir', 'node_modules');
const entryPoints = ["inline","polyfills","sw-register","styles","vendor","main"];
const minimizeCss = false;
const baseHref = "";
const deployUrl = "";
const postcssPlugins = function () {
  // safe settings based on: https://github.com/ben-eb/cssnano/issues/358#issuecomment-283696193
  const importantCommentRe = /@preserve|@license|[@#]\s*source(?:Mapping)?URL|^!/i;
  const minimizeOptions = {
    autoprefixer: false,
    safe: true,
    mergeLonghand: false,
    discardComments: { remove: (comment) => !importantCommentRe.test(comment) }
  };
  return [
    postcssUrl({
      url: (URL) => {
        // Only convert root relative URLs, which CSS-Loader won't process into require().
        if (!URL.startsWith('/') || URL.startsWith('//')) {
          return URL;
        }
        if (deployUrl.match(/:\/\//)) {
          // If deployUrl contains a scheme, ignore baseHref use deployUrl as is.
          return `${deployUrl.replace(/\/$/, '')}${URL}`;
        }
        else if (baseHref.match(/:\/\//)) {
          // If baseHref contains a scheme, include it as is.
          return baseHref.replace(/\/$/, '') +
            `/${deployUrl}/${URL}`.replace(/\/\/+/g, '/');
        }
        else {
          // Join together base-href, deploy-url and the original URL.
          // Also dedupe multiple slashes into single ones.
          return `/${baseHref}/${deployUrl}/${URL}`.replace(/\/\/+/g, '/');
        }
      }
    }),
    autoprefixer(),
    customProperties({ preserve: true })
  ].concat(minimizeCss ? [cssnano(minimizeOptions)] : []);
};



module.exports = {
  "resolve": {
    "extensions": [
      ".ts",
      ".js"
    ],
    "modules": [
      "./node_modules",
      "./node_modules"
    ],
    "symlinks": true,
    "alias": {
      "models": "/app/api/server/models",
      "collections": "/app/api/server/collections",
      "rxjs/util/tryCatch": "/app/node_modules/rxjs/_esm5/util/tryCatch.js",
      "rxjs/util/toSubscriber": "/app/node_modules/rxjs/_esm5/util/toSubscriber.js",
      "rxjs/util/subscribeToResult": "/app/node_modules/rxjs/_esm5/util/subscribeToResult.js",
      "rxjs/util/root": "/app/node_modules/rxjs/_esm5/util/root.js",
      "rxjs/util/pipe": "/app/node_modules/rxjs/_esm5/util/pipe.js",
      "rxjs/util/not": "/app/node_modules/rxjs/_esm5/util/not.js",
      "rxjs/util/noop": "/app/node_modules/rxjs/_esm5/util/noop.js",
      "rxjs/util/isScheduler": "/app/node_modules/rxjs/_esm5/util/isScheduler.js",
      "rxjs/util/isPromise": "/app/node_modules/rxjs/_esm5/util/isPromise.js",
      "rxjs/util/isObject": "/app/node_modules/rxjs/_esm5/util/isObject.js",
      "rxjs/util/isNumeric": "/app/node_modules/rxjs/_esm5/util/isNumeric.js",
      "rxjs/util/isFunction": "/app/node_modules/rxjs/_esm5/util/isFunction.js",
      "rxjs/util/isDate": "/app/node_modules/rxjs/_esm5/util/isDate.js",
      "rxjs/util/isArrayLike": "/app/node_modules/rxjs/_esm5/util/isArrayLike.js",
      "rxjs/util/isArray": "/app/node_modules/rxjs/_esm5/util/isArray.js",
      "rxjs/util/identity": "/app/node_modules/rxjs/_esm5/util/identity.js",
      "rxjs/util/errorObject": "/app/node_modules/rxjs/_esm5/util/errorObject.js",
      "rxjs/util/assign": "/app/node_modules/rxjs/_esm5/util/assign.js",
      "rxjs/util/applyMixins": "/app/node_modules/rxjs/_esm5/util/applyMixins.js",
      "rxjs/util/UnsubscriptionError": "/app/node_modules/rxjs/_esm5/util/UnsubscriptionError.js",
      "rxjs/util/TimeoutError": "/app/node_modules/rxjs/_esm5/util/TimeoutError.js",
      "rxjs/util/Set": "/app/node_modules/rxjs/_esm5/util/Set.js",
      "rxjs/util/ObjectUnsubscribedError": "/app/node_modules/rxjs/_esm5/util/ObjectUnsubscribedError.js",
      "rxjs/util/MapPolyfill": "/app/node_modules/rxjs/_esm5/util/MapPolyfill.js",
      "rxjs/util/Map": "/app/node_modules/rxjs/_esm5/util/Map.js",
      "rxjs/util/Immediate": "/app/node_modules/rxjs/_esm5/util/Immediate.js",
      "rxjs/util/FastMap": "/app/node_modules/rxjs/_esm5/util/FastMap.js",
      "rxjs/util/EmptyError": "/app/node_modules/rxjs/_esm5/util/EmptyError.js",
      "rxjs/util/ArgumentOutOfRangeError": "/app/node_modules/rxjs/_esm5/util/ArgumentOutOfRangeError.js",
      "rxjs/util/AnimationFrame": "/app/node_modules/rxjs/_esm5/util/AnimationFrame.js",
      "rxjs/testing/TestScheduler": "/app/node_modules/rxjs/_esm5/testing/TestScheduler.js",
      "rxjs/testing/TestMessage": "/app/node_modules/rxjs/_esm5/testing/TestMessage.js",
      "rxjs/testing/SubscriptionLoggable": "/app/node_modules/rxjs/_esm5/testing/SubscriptionLoggable.js",
      "rxjs/testing/SubscriptionLog": "/app/node_modules/rxjs/_esm5/testing/SubscriptionLog.js",
      "rxjs/testing/HotObservable": "/app/node_modules/rxjs/_esm5/testing/HotObservable.js",
      "rxjs/testing/ColdObservable": "/app/node_modules/rxjs/_esm5/testing/ColdObservable.js",
      "rxjs/symbol/rxSubscriber": "/app/node_modules/rxjs/_esm5/symbol/rxSubscriber.js",
      "rxjs/symbol/observable": "/app/node_modules/rxjs/_esm5/symbol/observable.js",
      "rxjs/symbol/iterator": "/app/node_modules/rxjs/_esm5/symbol/iterator.js",
      "rxjs/scheduler/queue": "/app/node_modules/rxjs/_esm5/scheduler/queue.js",
      "rxjs/scheduler/async": "/app/node_modules/rxjs/_esm5/scheduler/async.js",
      "rxjs/scheduler/asap": "/app/node_modules/rxjs/_esm5/scheduler/asap.js",
      "rxjs/scheduler/animationFrame": "/app/node_modules/rxjs/_esm5/scheduler/animationFrame.js",
      "rxjs/scheduler/VirtualTimeScheduler": "/app/node_modules/rxjs/_esm5/scheduler/VirtualTimeScheduler.js",
      "rxjs/scheduler/QueueScheduler": "/app/node_modules/rxjs/_esm5/scheduler/QueueScheduler.js",
      "rxjs/scheduler/QueueAction": "/app/node_modules/rxjs/_esm5/scheduler/QueueAction.js",
      "rxjs/scheduler/AsyncScheduler": "/app/node_modules/rxjs/_esm5/scheduler/AsyncScheduler.js",
      "rxjs/scheduler/AsyncAction": "/app/node_modules/rxjs/_esm5/scheduler/AsyncAction.js",
      "rxjs/scheduler/AsapScheduler": "/app/node_modules/rxjs/_esm5/scheduler/AsapScheduler.js",
      "rxjs/scheduler/AsapAction": "/app/node_modules/rxjs/_esm5/scheduler/AsapAction.js",
      "rxjs/scheduler/AnimationFrameScheduler": "/app/node_modules/rxjs/_esm5/scheduler/AnimationFrameScheduler.js",
      "rxjs/scheduler/AnimationFrameAction": "/app/node_modules/rxjs/_esm5/scheduler/AnimationFrameAction.js",
      "rxjs/scheduler/Action": "/app/node_modules/rxjs/_esm5/scheduler/Action.js",
      "rxjs/operators/zipAll": "/app/node_modules/rxjs/_esm5/operators/zipAll.js",
      "rxjs/operators/zip": "/app/node_modules/rxjs/_esm5/operators/zip.js",
      "rxjs/operators/withLatestFrom": "/app/node_modules/rxjs/_esm5/operators/withLatestFrom.js",
      "rxjs/operators/windowWhen": "/app/node_modules/rxjs/_esm5/operators/windowWhen.js",
      "rxjs/operators/windowToggle": "/app/node_modules/rxjs/_esm5/operators/windowToggle.js",
      "rxjs/operators/windowTime": "/app/node_modules/rxjs/_esm5/operators/windowTime.js",
      "rxjs/operators/windowCount": "/app/node_modules/rxjs/_esm5/operators/windowCount.js",
      "rxjs/operators/window": "/app/node_modules/rxjs/_esm5/operators/window.js",
      "rxjs/operators/toArray": "/app/node_modules/rxjs/_esm5/operators/toArray.js",
      "rxjs/operators/timestamp": "/app/node_modules/rxjs/_esm5/operators/timestamp.js",
      "rxjs/operators/timeoutWith": "/app/node_modules/rxjs/_esm5/operators/timeoutWith.js",
      "rxjs/operators/timeout": "/app/node_modules/rxjs/_esm5/operators/timeout.js",
      "rxjs/operators/timeInterval": "/app/node_modules/rxjs/_esm5/operators/timeInterval.js",
      "rxjs/operators/throttleTime": "/app/node_modules/rxjs/_esm5/operators/throttleTime.js",
      "rxjs/operators/throttle": "/app/node_modules/rxjs/_esm5/operators/throttle.js",
      "rxjs/operators/tap": "/app/node_modules/rxjs/_esm5/operators/tap.js",
      "rxjs/operators/takeWhile": "/app/node_modules/rxjs/_esm5/operators/takeWhile.js",
      "rxjs/operators/takeUntil": "/app/node_modules/rxjs/_esm5/operators/takeUntil.js",
      "rxjs/operators/takeLast": "/app/node_modules/rxjs/_esm5/operators/takeLast.js",
      "rxjs/operators/take": "/app/node_modules/rxjs/_esm5/operators/take.js",
      "rxjs/operators/switchMapTo": "/app/node_modules/rxjs/_esm5/operators/switchMapTo.js",
      "rxjs/operators/switchMap": "/app/node_modules/rxjs/_esm5/operators/switchMap.js",
      "rxjs/operators/switchAll": "/app/node_modules/rxjs/_esm5/operators/switchAll.js",
      "rxjs/operators/subscribeOn": "/app/node_modules/rxjs/_esm5/operators/subscribeOn.js",
      "rxjs/operators/startWith": "/app/node_modules/rxjs/_esm5/operators/startWith.js",
      "rxjs/operators/skipWhile": "/app/node_modules/rxjs/_esm5/operators/skipWhile.js",
      "rxjs/operators/skipUntil": "/app/node_modules/rxjs/_esm5/operators/skipUntil.js",
      "rxjs/operators/skipLast": "/app/node_modules/rxjs/_esm5/operators/skipLast.js",
      "rxjs/operators/skip": "/app/node_modules/rxjs/_esm5/operators/skip.js",
      "rxjs/operators/single": "/app/node_modules/rxjs/_esm5/operators/single.js",
      "rxjs/operators/shareReplay": "/app/node_modules/rxjs/_esm5/operators/shareReplay.js",
      "rxjs/operators/share": "/app/node_modules/rxjs/_esm5/operators/share.js",
      "rxjs/operators/sequenceEqual": "/app/node_modules/rxjs/_esm5/operators/sequenceEqual.js",
      "rxjs/operators/scan": "/app/node_modules/rxjs/_esm5/operators/scan.js",
      "rxjs/operators/sampleTime": "/app/node_modules/rxjs/_esm5/operators/sampleTime.js",
      "rxjs/operators/sample": "/app/node_modules/rxjs/_esm5/operators/sample.js",
      "rxjs/operators/retryWhen": "/app/node_modules/rxjs/_esm5/operators/retryWhen.js",
      "rxjs/operators/retry": "/app/node_modules/rxjs/_esm5/operators/retry.js",
      "rxjs/operators/repeatWhen": "/app/node_modules/rxjs/_esm5/operators/repeatWhen.js",
      "rxjs/operators/repeat": "/app/node_modules/rxjs/_esm5/operators/repeat.js",
      "rxjs/operators/refCount": "/app/node_modules/rxjs/_esm5/operators/refCount.js",
      "rxjs/operators/reduce": "/app/node_modules/rxjs/_esm5/operators/reduce.js",
      "rxjs/operators/race": "/app/node_modules/rxjs/_esm5/operators/race.js",
      "rxjs/operators/publishReplay": "/app/node_modules/rxjs/_esm5/operators/publishReplay.js",
      "rxjs/operators/publishLast": "/app/node_modules/rxjs/_esm5/operators/publishLast.js",
      "rxjs/operators/publishBehavior": "/app/node_modules/rxjs/_esm5/operators/publishBehavior.js",
      "rxjs/operators/publish": "/app/node_modules/rxjs/_esm5/operators/publish.js",
      "rxjs/operators/pluck": "/app/node_modules/rxjs/_esm5/operators/pluck.js",
      "rxjs/operators/partition": "/app/node_modules/rxjs/_esm5/operators/partition.js",
      "rxjs/operators/pairwise": "/app/node_modules/rxjs/_esm5/operators/pairwise.js",
      "rxjs/operators/onErrorResumeNext": "/app/node_modules/rxjs/_esm5/operators/onErrorResumeNext.js",
      "rxjs/operators/observeOn": "/app/node_modules/rxjs/_esm5/operators/observeOn.js",
      "rxjs/operators/multicast": "/app/node_modules/rxjs/_esm5/operators/multicast.js",
      "rxjs/operators/min": "/app/node_modules/rxjs/_esm5/operators/min.js",
      "rxjs/operators/mergeScan": "/app/node_modules/rxjs/_esm5/operators/mergeScan.js",
      "rxjs/operators/mergeMapTo": "/app/node_modules/rxjs/_esm5/operators/mergeMapTo.js",
      "rxjs/operators/mergeMap": "/app/node_modules/rxjs/_esm5/operators/mergeMap.js",
      "rxjs/operators/mergeAll": "/app/node_modules/rxjs/_esm5/operators/mergeAll.js",
      "rxjs/operators/merge": "/app/node_modules/rxjs/_esm5/operators/merge.js",
      "rxjs/operators/max": "/app/node_modules/rxjs/_esm5/operators/max.js",
      "rxjs/operators/materialize": "/app/node_modules/rxjs/_esm5/operators/materialize.js",
      "rxjs/operators/mapTo": "/app/node_modules/rxjs/_esm5/operators/mapTo.js",
      "rxjs/operators/map": "/app/node_modules/rxjs/_esm5/operators/map.js",
      "rxjs/operators/last": "/app/node_modules/rxjs/_esm5/operators/last.js",
      "rxjs/operators/isEmpty": "/app/node_modules/rxjs/_esm5/operators/isEmpty.js",
      "rxjs/operators/ignoreElements": "/app/node_modules/rxjs/_esm5/operators/ignoreElements.js",
      "rxjs/operators/groupBy": "/app/node_modules/rxjs/_esm5/operators/groupBy.js",
      "rxjs/operators/first": "/app/node_modules/rxjs/_esm5/operators/first.js",
      "rxjs/operators/findIndex": "/app/node_modules/rxjs/_esm5/operators/findIndex.js",
      "rxjs/operators/find": "/app/node_modules/rxjs/_esm5/operators/find.js",
      "rxjs/operators/finalize": "/app/node_modules/rxjs/_esm5/operators/finalize.js",
      "rxjs/operators/filter": "/app/node_modules/rxjs/_esm5/operators/filter.js",
      "rxjs/operators/expand": "/app/node_modules/rxjs/_esm5/operators/expand.js",
      "rxjs/operators/exhaustMap": "/app/node_modules/rxjs/_esm5/operators/exhaustMap.js",
      "rxjs/operators/exhaust": "/app/node_modules/rxjs/_esm5/operators/exhaust.js",
      "rxjs/operators/every": "/app/node_modules/rxjs/_esm5/operators/every.js",
      "rxjs/operators/elementAt": "/app/node_modules/rxjs/_esm5/operators/elementAt.js",
      "rxjs/operators/distinctUntilKeyChanged": "/app/node_modules/rxjs/_esm5/operators/distinctUntilKeyChanged.js",
      "rxjs/operators/distinctUntilChanged": "/app/node_modules/rxjs/_esm5/operators/distinctUntilChanged.js",
      "rxjs/operators/distinct": "/app/node_modules/rxjs/_esm5/operators/distinct.js",
      "rxjs/operators/dematerialize": "/app/node_modules/rxjs/_esm5/operators/dematerialize.js",
      "rxjs/operators/delayWhen": "/app/node_modules/rxjs/_esm5/operators/delayWhen.js",
      "rxjs/operators/delay": "/app/node_modules/rxjs/_esm5/operators/delay.js",
      "rxjs/operators/defaultIfEmpty": "/app/node_modules/rxjs/_esm5/operators/defaultIfEmpty.js",
      "rxjs/operators/debounceTime": "/app/node_modules/rxjs/_esm5/operators/debounceTime.js",
      "rxjs/operators/debounce": "/app/node_modules/rxjs/_esm5/operators/debounce.js",
      "rxjs/operators/count": "/app/node_modules/rxjs/_esm5/operators/count.js",
      "rxjs/operators/concatMapTo": "/app/node_modules/rxjs/_esm5/operators/concatMapTo.js",
      "rxjs/operators/concatMap": "/app/node_modules/rxjs/_esm5/operators/concatMap.js",
      "rxjs/operators/concatAll": "/app/node_modules/rxjs/_esm5/operators/concatAll.js",
      "rxjs/operators/concat": "/app/node_modules/rxjs/_esm5/operators/concat.js",
      "rxjs/operators/combineLatest": "/app/node_modules/rxjs/_esm5/operators/combineLatest.js",
      "rxjs/operators/combineAll": "/app/node_modules/rxjs/_esm5/operators/combineAll.js",
      "rxjs/operators/catchError": "/app/node_modules/rxjs/_esm5/operators/catchError.js",
      "rxjs/operators/bufferWhen": "/app/node_modules/rxjs/_esm5/operators/bufferWhen.js",
      "rxjs/operators/bufferToggle": "/app/node_modules/rxjs/_esm5/operators/bufferToggle.js",
      "rxjs/operators/bufferTime": "/app/node_modules/rxjs/_esm5/operators/bufferTime.js",
      "rxjs/operators/bufferCount": "/app/node_modules/rxjs/_esm5/operators/bufferCount.js",
      "rxjs/operators/buffer": "/app/node_modules/rxjs/_esm5/operators/buffer.js",
      "rxjs/operators/auditTime": "/app/node_modules/rxjs/_esm5/operators/auditTime.js",
      "rxjs/operators/audit": "/app/node_modules/rxjs/_esm5/operators/audit.js",
      "rxjs/operators": "/app/node_modules/rxjs/_esm5/operators.js",
      "rxjs/operator/zipAll": "/app/node_modules/rxjs/_esm5/operator/zipAll.js",
      "rxjs/operator/zip": "/app/node_modules/rxjs/_esm5/operator/zip.js",
      "rxjs/operator/withLatestFrom": "/app/node_modules/rxjs/_esm5/operator/withLatestFrom.js",
      "rxjs/operator/windowWhen": "/app/node_modules/rxjs/_esm5/operator/windowWhen.js",
      "rxjs/operator/windowToggle": "/app/node_modules/rxjs/_esm5/operator/windowToggle.js",
      "rxjs/operator/windowTime": "/app/node_modules/rxjs/_esm5/operator/windowTime.js",
      "rxjs/operator/windowCount": "/app/node_modules/rxjs/_esm5/operator/windowCount.js",
      "rxjs/operator/window": "/app/node_modules/rxjs/_esm5/operator/window.js",
      "rxjs/operator/toPromise": "/app/node_modules/rxjs/_esm5/operator/toPromise.js",
      "rxjs/operator/toArray": "/app/node_modules/rxjs/_esm5/operator/toArray.js",
      "rxjs/operator/timestamp": "/app/node_modules/rxjs/_esm5/operator/timestamp.js",
      "rxjs/operator/timeoutWith": "/app/node_modules/rxjs/_esm5/operator/timeoutWith.js",
      "rxjs/operator/timeout": "/app/node_modules/rxjs/_esm5/operator/timeout.js",
      "rxjs/operator/timeInterval": "/app/node_modules/rxjs/_esm5/operator/timeInterval.js",
      "rxjs/operator/throttleTime": "/app/node_modules/rxjs/_esm5/operator/throttleTime.js",
      "rxjs/operator/throttle": "/app/node_modules/rxjs/_esm5/operator/throttle.js",
      "rxjs/operator/takeWhile": "/app/node_modules/rxjs/_esm5/operator/takeWhile.js",
      "rxjs/operator/takeUntil": "/app/node_modules/rxjs/_esm5/operator/takeUntil.js",
      "rxjs/operator/takeLast": "/app/node_modules/rxjs/_esm5/operator/takeLast.js",
      "rxjs/operator/take": "/app/node_modules/rxjs/_esm5/operator/take.js",
      "rxjs/operator/switchMapTo": "/app/node_modules/rxjs/_esm5/operator/switchMapTo.js",
      "rxjs/operator/switchMap": "/app/node_modules/rxjs/_esm5/operator/switchMap.js",
      "rxjs/operator/switch": "/app/node_modules/rxjs/_esm5/operator/switch.js",
      "rxjs/operator/subscribeOn": "/app/node_modules/rxjs/_esm5/operator/subscribeOn.js",
      "rxjs/operator/startWith": "/app/node_modules/rxjs/_esm5/operator/startWith.js",
      "rxjs/operator/skipWhile": "/app/node_modules/rxjs/_esm5/operator/skipWhile.js",
      "rxjs/operator/skipUntil": "/app/node_modules/rxjs/_esm5/operator/skipUntil.js",
      "rxjs/operator/skipLast": "/app/node_modules/rxjs/_esm5/operator/skipLast.js",
      "rxjs/operator/skip": "/app/node_modules/rxjs/_esm5/operator/skip.js",
      "rxjs/operator/single": "/app/node_modules/rxjs/_esm5/operator/single.js",
      "rxjs/operator/shareReplay": "/app/node_modules/rxjs/_esm5/operator/shareReplay.js",
      "rxjs/operator/share": "/app/node_modules/rxjs/_esm5/operator/share.js",
      "rxjs/operator/sequenceEqual": "/app/node_modules/rxjs/_esm5/operator/sequenceEqual.js",
      "rxjs/operator/scan": "/app/node_modules/rxjs/_esm5/operator/scan.js",
      "rxjs/operator/sampleTime": "/app/node_modules/rxjs/_esm5/operator/sampleTime.js",
      "rxjs/operator/sample": "/app/node_modules/rxjs/_esm5/operator/sample.js",
      "rxjs/operator/retryWhen": "/app/node_modules/rxjs/_esm5/operator/retryWhen.js",
      "rxjs/operator/retry": "/app/node_modules/rxjs/_esm5/operator/retry.js",
      "rxjs/operator/repeatWhen": "/app/node_modules/rxjs/_esm5/operator/repeatWhen.js",
      "rxjs/operator/repeat": "/app/node_modules/rxjs/_esm5/operator/repeat.js",
      "rxjs/operator/reduce": "/app/node_modules/rxjs/_esm5/operator/reduce.js",
      "rxjs/operator/race": "/app/node_modules/rxjs/_esm5/operator/race.js",
      "rxjs/operator/publishReplay": "/app/node_modules/rxjs/_esm5/operator/publishReplay.js",
      "rxjs/operator/publishLast": "/app/node_modules/rxjs/_esm5/operator/publishLast.js",
      "rxjs/operator/publishBehavior": "/app/node_modules/rxjs/_esm5/operator/publishBehavior.js",
      "rxjs/operator/publish": "/app/node_modules/rxjs/_esm5/operator/publish.js",
      "rxjs/operator/pluck": "/app/node_modules/rxjs/_esm5/operator/pluck.js",
      "rxjs/operator/partition": "/app/node_modules/rxjs/_esm5/operator/partition.js",
      "rxjs/operator/pairwise": "/app/node_modules/rxjs/_esm5/operator/pairwise.js",
      "rxjs/operator/onErrorResumeNext": "/app/node_modules/rxjs/_esm5/operator/onErrorResumeNext.js",
      "rxjs/operator/observeOn": "/app/node_modules/rxjs/_esm5/operator/observeOn.js",
      "rxjs/operator/multicast": "/app/node_modules/rxjs/_esm5/operator/multicast.js",
      "rxjs/operator/min": "/app/node_modules/rxjs/_esm5/operator/min.js",
      "rxjs/operator/mergeScan": "/app/node_modules/rxjs/_esm5/operator/mergeScan.js",
      "rxjs/operator/mergeMapTo": "/app/node_modules/rxjs/_esm5/operator/mergeMapTo.js",
      "rxjs/operator/mergeMap": "/app/node_modules/rxjs/_esm5/operator/mergeMap.js",
      "rxjs/operator/mergeAll": "/app/node_modules/rxjs/_esm5/operator/mergeAll.js",
      "rxjs/operator/merge": "/app/node_modules/rxjs/_esm5/operator/merge.js",
      "rxjs/operator/max": "/app/node_modules/rxjs/_esm5/operator/max.js",
      "rxjs/operator/materialize": "/app/node_modules/rxjs/_esm5/operator/materialize.js",
      "rxjs/operator/mapTo": "/app/node_modules/rxjs/_esm5/operator/mapTo.js",
      "rxjs/operator/map": "/app/node_modules/rxjs/_esm5/operator/map.js",
      "rxjs/operator/let": "/app/node_modules/rxjs/_esm5/operator/let.js",
      "rxjs/operator/last": "/app/node_modules/rxjs/_esm5/operator/last.js",
      "rxjs/operator/isEmpty": "/app/node_modules/rxjs/_esm5/operator/isEmpty.js",
      "rxjs/operator/ignoreElements": "/app/node_modules/rxjs/_esm5/operator/ignoreElements.js",
      "rxjs/operator/groupBy": "/app/node_modules/rxjs/_esm5/operator/groupBy.js",
      "rxjs/operator/first": "/app/node_modules/rxjs/_esm5/operator/first.js",
      "rxjs/operator/findIndex": "/app/node_modules/rxjs/_esm5/operator/findIndex.js",
      "rxjs/operator/find": "/app/node_modules/rxjs/_esm5/operator/find.js",
      "rxjs/operator/finally": "/app/node_modules/rxjs/_esm5/operator/finally.js",
      "rxjs/operator/filter": "/app/node_modules/rxjs/_esm5/operator/filter.js",
      "rxjs/operator/expand": "/app/node_modules/rxjs/_esm5/operator/expand.js",
      "rxjs/operator/exhaustMap": "/app/node_modules/rxjs/_esm5/operator/exhaustMap.js",
      "rxjs/operator/exhaust": "/app/node_modules/rxjs/_esm5/operator/exhaust.js",
      "rxjs/operator/every": "/app/node_modules/rxjs/_esm5/operator/every.js",
      "rxjs/operator/elementAt": "/app/node_modules/rxjs/_esm5/operator/elementAt.js",
      "rxjs/operator/do": "/app/node_modules/rxjs/_esm5/operator/do.js",
      "rxjs/operator/distinctUntilKeyChanged": "/app/node_modules/rxjs/_esm5/operator/distinctUntilKeyChanged.js",
      "rxjs/operator/distinctUntilChanged": "/app/node_modules/rxjs/_esm5/operator/distinctUntilChanged.js",
      "rxjs/operator/distinct": "/app/node_modules/rxjs/_esm5/operator/distinct.js",
      "rxjs/operator/dematerialize": "/app/node_modules/rxjs/_esm5/operator/dematerialize.js",
      "rxjs/operator/delayWhen": "/app/node_modules/rxjs/_esm5/operator/delayWhen.js",
      "rxjs/operator/delay": "/app/node_modules/rxjs/_esm5/operator/delay.js",
      "rxjs/operator/defaultIfEmpty": "/app/node_modules/rxjs/_esm5/operator/defaultIfEmpty.js",
      "rxjs/operator/debounceTime": "/app/node_modules/rxjs/_esm5/operator/debounceTime.js",
      "rxjs/operator/debounce": "/app/node_modules/rxjs/_esm5/operator/debounce.js",
      "rxjs/operator/count": "/app/node_modules/rxjs/_esm5/operator/count.js",
      "rxjs/operator/concatMapTo": "/app/node_modules/rxjs/_esm5/operator/concatMapTo.js",
      "rxjs/operator/concatMap": "/app/node_modules/rxjs/_esm5/operator/concatMap.js",
      "rxjs/operator/concatAll": "/app/node_modules/rxjs/_esm5/operator/concatAll.js",
      "rxjs/operator/concat": "/app/node_modules/rxjs/_esm5/operator/concat.js",
      "rxjs/operator/combineLatest": "/app/node_modules/rxjs/_esm5/operator/combineLatest.js",
      "rxjs/operator/combineAll": "/app/node_modules/rxjs/_esm5/operator/combineAll.js",
      "rxjs/operator/catch": "/app/node_modules/rxjs/_esm5/operator/catch.js",
      "rxjs/operator/bufferWhen": "/app/node_modules/rxjs/_esm5/operator/bufferWhen.js",
      "rxjs/operator/bufferToggle": "/app/node_modules/rxjs/_esm5/operator/bufferToggle.js",
      "rxjs/operator/bufferTime": "/app/node_modules/rxjs/_esm5/operator/bufferTime.js",
      "rxjs/operator/bufferCount": "/app/node_modules/rxjs/_esm5/operator/bufferCount.js",
      "rxjs/operator/buffer": "/app/node_modules/rxjs/_esm5/operator/buffer.js",
      "rxjs/operator/auditTime": "/app/node_modules/rxjs/_esm5/operator/auditTime.js",
      "rxjs/operator/audit": "/app/node_modules/rxjs/_esm5/operator/audit.js",
      "rxjs/observable/zip": "/app/node_modules/rxjs/_esm5/observable/zip.js",
      "rxjs/observable/using": "/app/node_modules/rxjs/_esm5/observable/using.js",
      "rxjs/observable/timer": "/app/node_modules/rxjs/_esm5/observable/timer.js",
      "rxjs/observable/throw": "/app/node_modules/rxjs/_esm5/observable/throw.js",
      "rxjs/observable/range": "/app/node_modules/rxjs/_esm5/observable/range.js",
      "rxjs/observable/race": "/app/node_modules/rxjs/_esm5/observable/race.js",
      "rxjs/observable/pairs": "/app/node_modules/rxjs/_esm5/observable/pairs.js",
      "rxjs/observable/onErrorResumeNext": "/app/node_modules/rxjs/_esm5/observable/onErrorResumeNext.js",
      "rxjs/observable/of": "/app/node_modules/rxjs/_esm5/observable/of.js",
      "rxjs/observable/never": "/app/node_modules/rxjs/_esm5/observable/never.js",
      "rxjs/observable/merge": "/app/node_modules/rxjs/_esm5/observable/merge.js",
      "rxjs/observable/interval": "/app/node_modules/rxjs/_esm5/observable/interval.js",
      "rxjs/observable/if": "/app/node_modules/rxjs/_esm5/observable/if.js",
      "rxjs/observable/generate": "/app/node_modules/rxjs/_esm5/observable/generate.js",
      "rxjs/observable/fromPromise": "/app/node_modules/rxjs/_esm5/observable/fromPromise.js",
      "rxjs/observable/fromEventPattern": "/app/node_modules/rxjs/_esm5/observable/fromEventPattern.js",
      "rxjs/observable/fromEvent": "/app/node_modules/rxjs/_esm5/observable/fromEvent.js",
      "rxjs/observable/from": "/app/node_modules/rxjs/_esm5/observable/from.js",
      "rxjs/observable/forkJoin": "/app/node_modules/rxjs/_esm5/observable/forkJoin.js",
      "rxjs/observable/empty": "/app/node_modules/rxjs/_esm5/observable/empty.js",
      "rxjs/observable/dom/webSocket": "/app/node_modules/rxjs/_esm5/observable/dom/webSocket.js",
      "rxjs/observable/dom/ajax": "/app/node_modules/rxjs/_esm5/observable/dom/ajax.js",
      "rxjs/observable/dom/WebSocketSubject": "/app/node_modules/rxjs/_esm5/observable/dom/WebSocketSubject.js",
      "rxjs/observable/dom/AjaxObservable": "/app/node_modules/rxjs/_esm5/observable/dom/AjaxObservable.js",
      "rxjs/observable/defer": "/app/node_modules/rxjs/_esm5/observable/defer.js",
      "rxjs/observable/concat": "/app/node_modules/rxjs/_esm5/observable/concat.js",
      "rxjs/observable/combineLatest": "/app/node_modules/rxjs/_esm5/observable/combineLatest.js",
      "rxjs/observable/bindNodeCallback": "/app/node_modules/rxjs/_esm5/observable/bindNodeCallback.js",
      "rxjs/observable/bindCallback": "/app/node_modules/rxjs/_esm5/observable/bindCallback.js",
      "rxjs/observable/UsingObservable": "/app/node_modules/rxjs/_esm5/observable/UsingObservable.js",
      "rxjs/observable/TimerObservable": "/app/node_modules/rxjs/_esm5/observable/TimerObservable.js",
      "rxjs/observable/SubscribeOnObservable": "/app/node_modules/rxjs/_esm5/observable/SubscribeOnObservable.js",
      "rxjs/observable/ScalarObservable": "/app/node_modules/rxjs/_esm5/observable/ScalarObservable.js",
      "rxjs/observable/RangeObservable": "/app/node_modules/rxjs/_esm5/observable/RangeObservable.js",
      "rxjs/observable/PromiseObservable": "/app/node_modules/rxjs/_esm5/observable/PromiseObservable.js",
      "rxjs/observable/PairsObservable": "/app/node_modules/rxjs/_esm5/observable/PairsObservable.js",
      "rxjs/observable/NeverObservable": "/app/node_modules/rxjs/_esm5/observable/NeverObservable.js",
      "rxjs/observable/IteratorObservable": "/app/node_modules/rxjs/_esm5/observable/IteratorObservable.js",
      "rxjs/observable/IntervalObservable": "/app/node_modules/rxjs/_esm5/observable/IntervalObservable.js",
      "rxjs/observable/IfObservable": "/app/node_modules/rxjs/_esm5/observable/IfObservable.js",
      "rxjs/observable/GenerateObservable": "/app/node_modules/rxjs/_esm5/observable/GenerateObservable.js",
      "rxjs/observable/FromObservable": "/app/node_modules/rxjs/_esm5/observable/FromObservable.js",
      "rxjs/observable/FromEventPatternObservable": "/app/node_modules/rxjs/_esm5/observable/FromEventPatternObservable.js",
      "rxjs/observable/FromEventObservable": "/app/node_modules/rxjs/_esm5/observable/FromEventObservable.js",
      "rxjs/observable/ForkJoinObservable": "/app/node_modules/rxjs/_esm5/observable/ForkJoinObservable.js",
      "rxjs/observable/ErrorObservable": "/app/node_modules/rxjs/_esm5/observable/ErrorObservable.js",
      "rxjs/observable/EmptyObservable": "/app/node_modules/rxjs/_esm5/observable/EmptyObservable.js",
      "rxjs/observable/DeferObservable": "/app/node_modules/rxjs/_esm5/observable/DeferObservable.js",
      "rxjs/observable/ConnectableObservable": "/app/node_modules/rxjs/_esm5/observable/ConnectableObservable.js",
      "rxjs/observable/BoundNodeCallbackObservable": "/app/node_modules/rxjs/_esm5/observable/BoundNodeCallbackObservable.js",
      "rxjs/observable/BoundCallbackObservable": "/app/node_modules/rxjs/_esm5/observable/BoundCallbackObservable.js",
      "rxjs/observable/ArrayObservable": "/app/node_modules/rxjs/_esm5/observable/ArrayObservable.js",
      "rxjs/observable/ArrayLikeObservable": "/app/node_modules/rxjs/_esm5/observable/ArrayLikeObservable.js",
      "rxjs/interfaces": "/app/node_modules/rxjs/_esm5/interfaces.js",
      "rxjs/add/operator/zipAll": "/app/node_modules/rxjs/_esm5/add/operator/zipAll.js",
      "rxjs/add/operator/zip": "/app/node_modules/rxjs/_esm5/add/operator/zip.js",
      "rxjs/add/operator/withLatestFrom": "/app/node_modules/rxjs/_esm5/add/operator/withLatestFrom.js",
      "rxjs/add/operator/windowWhen": "/app/node_modules/rxjs/_esm5/add/operator/windowWhen.js",
      "rxjs/add/operator/windowToggle": "/app/node_modules/rxjs/_esm5/add/operator/windowToggle.js",
      "rxjs/add/operator/windowTime": "/app/node_modules/rxjs/_esm5/add/operator/windowTime.js",
      "rxjs/add/operator/windowCount": "/app/node_modules/rxjs/_esm5/add/operator/windowCount.js",
      "rxjs/add/operator/window": "/app/node_modules/rxjs/_esm5/add/operator/window.js",
      "rxjs/add/operator/toPromise": "/app/node_modules/rxjs/_esm5/add/operator/toPromise.js",
      "rxjs/add/operator/toArray": "/app/node_modules/rxjs/_esm5/add/operator/toArray.js",
      "rxjs/add/operator/timestamp": "/app/node_modules/rxjs/_esm5/add/operator/timestamp.js",
      "rxjs/add/operator/timeoutWith": "/app/node_modules/rxjs/_esm5/add/operator/timeoutWith.js",
      "rxjs/add/operator/timeout": "/app/node_modules/rxjs/_esm5/add/operator/timeout.js",
      "rxjs/add/operator/timeInterval": "/app/node_modules/rxjs/_esm5/add/operator/timeInterval.js",
      "rxjs/add/operator/throttleTime": "/app/node_modules/rxjs/_esm5/add/operator/throttleTime.js",
      "rxjs/add/operator/throttle": "/app/node_modules/rxjs/_esm5/add/operator/throttle.js",
      "rxjs/add/operator/takeWhile": "/app/node_modules/rxjs/_esm5/add/operator/takeWhile.js",
      "rxjs/add/operator/takeUntil": "/app/node_modules/rxjs/_esm5/add/operator/takeUntil.js",
      "rxjs/add/operator/takeLast": "/app/node_modules/rxjs/_esm5/add/operator/takeLast.js",
      "rxjs/add/operator/take": "/app/node_modules/rxjs/_esm5/add/operator/take.js",
      "rxjs/add/operator/switchMapTo": "/app/node_modules/rxjs/_esm5/add/operator/switchMapTo.js",
      "rxjs/add/operator/switchMap": "/app/node_modules/rxjs/_esm5/add/operator/switchMap.js",
      "rxjs/add/operator/switch": "/app/node_modules/rxjs/_esm5/add/operator/switch.js",
      "rxjs/add/operator/subscribeOn": "/app/node_modules/rxjs/_esm5/add/operator/subscribeOn.js",
      "rxjs/add/operator/startWith": "/app/node_modules/rxjs/_esm5/add/operator/startWith.js",
      "rxjs/add/operator/skipWhile": "/app/node_modules/rxjs/_esm5/add/operator/skipWhile.js",
      "rxjs/add/operator/skipUntil": "/app/node_modules/rxjs/_esm5/add/operator/skipUntil.js",
      "rxjs/add/operator/skipLast": "/app/node_modules/rxjs/_esm5/add/operator/skipLast.js",
      "rxjs/add/operator/skip": "/app/node_modules/rxjs/_esm5/add/operator/skip.js",
      "rxjs/add/operator/single": "/app/node_modules/rxjs/_esm5/add/operator/single.js",
      "rxjs/add/operator/shareReplay": "/app/node_modules/rxjs/_esm5/add/operator/shareReplay.js",
      "rxjs/add/operator/share": "/app/node_modules/rxjs/_esm5/add/operator/share.js",
      "rxjs/add/operator/sequenceEqual": "/app/node_modules/rxjs/_esm5/add/operator/sequenceEqual.js",
      "rxjs/add/operator/scan": "/app/node_modules/rxjs/_esm5/add/operator/scan.js",
      "rxjs/add/operator/sampleTime": "/app/node_modules/rxjs/_esm5/add/operator/sampleTime.js",
      "rxjs/add/operator/sample": "/app/node_modules/rxjs/_esm5/add/operator/sample.js",
      "rxjs/add/operator/retryWhen": "/app/node_modules/rxjs/_esm5/add/operator/retryWhen.js",
      "rxjs/add/operator/retry": "/app/node_modules/rxjs/_esm5/add/operator/retry.js",
      "rxjs/add/operator/repeatWhen": "/app/node_modules/rxjs/_esm5/add/operator/repeatWhen.js",
      "rxjs/add/operator/repeat": "/app/node_modules/rxjs/_esm5/add/operator/repeat.js",
      "rxjs/add/operator/reduce": "/app/node_modules/rxjs/_esm5/add/operator/reduce.js",
      "rxjs/add/operator/race": "/app/node_modules/rxjs/_esm5/add/operator/race.js",
      "rxjs/add/operator/publishReplay": "/app/node_modules/rxjs/_esm5/add/operator/publishReplay.js",
      "rxjs/add/operator/publishLast": "/app/node_modules/rxjs/_esm5/add/operator/publishLast.js",
      "rxjs/add/operator/publishBehavior": "/app/node_modules/rxjs/_esm5/add/operator/publishBehavior.js",
      "rxjs/add/operator/publish": "/app/node_modules/rxjs/_esm5/add/operator/publish.js",
      "rxjs/add/operator/pluck": "/app/node_modules/rxjs/_esm5/add/operator/pluck.js",
      "rxjs/add/operator/partition": "/app/node_modules/rxjs/_esm5/add/operator/partition.js",
      "rxjs/add/operator/pairwise": "/app/node_modules/rxjs/_esm5/add/operator/pairwise.js",
      "rxjs/add/operator/onErrorResumeNext": "/app/node_modules/rxjs/_esm5/add/operator/onErrorResumeNext.js",
      "rxjs/add/operator/observeOn": "/app/node_modules/rxjs/_esm5/add/operator/observeOn.js",
      "rxjs/add/operator/multicast": "/app/node_modules/rxjs/_esm5/add/operator/multicast.js",
      "rxjs/add/operator/min": "/app/node_modules/rxjs/_esm5/add/operator/min.js",
      "rxjs/add/operator/mergeScan": "/app/node_modules/rxjs/_esm5/add/operator/mergeScan.js",
      "rxjs/add/operator/mergeMapTo": "/app/node_modules/rxjs/_esm5/add/operator/mergeMapTo.js",
      "rxjs/add/operator/mergeMap": "/app/node_modules/rxjs/_esm5/add/operator/mergeMap.js",
      "rxjs/add/operator/mergeAll": "/app/node_modules/rxjs/_esm5/add/operator/mergeAll.js",
      "rxjs/add/operator/merge": "/app/node_modules/rxjs/_esm5/add/operator/merge.js",
      "rxjs/add/operator/max": "/app/node_modules/rxjs/_esm5/add/operator/max.js",
      "rxjs/add/operator/materialize": "/app/node_modules/rxjs/_esm5/add/operator/materialize.js",
      "rxjs/add/operator/mapTo": "/app/node_modules/rxjs/_esm5/add/operator/mapTo.js",
      "rxjs/add/operator/map": "/app/node_modules/rxjs/_esm5/add/operator/map.js",
      "rxjs/add/operator/let": "/app/node_modules/rxjs/_esm5/add/operator/let.js",
      "rxjs/add/operator/last": "/app/node_modules/rxjs/_esm5/add/operator/last.js",
      "rxjs/add/operator/isEmpty": "/app/node_modules/rxjs/_esm5/add/operator/isEmpty.js",
      "rxjs/add/operator/ignoreElements": "/app/node_modules/rxjs/_esm5/add/operator/ignoreElements.js",
      "rxjs/add/operator/groupBy": "/app/node_modules/rxjs/_esm5/add/operator/groupBy.js",
      "rxjs/add/operator/first": "/app/node_modules/rxjs/_esm5/add/operator/first.js",
      "rxjs/add/operator/findIndex": "/app/node_modules/rxjs/_esm5/add/operator/findIndex.js",
      "rxjs/add/operator/find": "/app/node_modules/rxjs/_esm5/add/operator/find.js",
      "rxjs/add/operator/finally": "/app/node_modules/rxjs/_esm5/add/operator/finally.js",
      "rxjs/add/operator/filter": "/app/node_modules/rxjs/_esm5/add/operator/filter.js",
      "rxjs/add/operator/expand": "/app/node_modules/rxjs/_esm5/add/operator/expand.js",
      "rxjs/add/operator/exhaustMap": "/app/node_modules/rxjs/_esm5/add/operator/exhaustMap.js",
      "rxjs/add/operator/exhaust": "/app/node_modules/rxjs/_esm5/add/operator/exhaust.js",
      "rxjs/add/operator/every": "/app/node_modules/rxjs/_esm5/add/operator/every.js",
      "rxjs/add/operator/elementAt": "/app/node_modules/rxjs/_esm5/add/operator/elementAt.js",
      "rxjs/add/operator/do": "/app/node_modules/rxjs/_esm5/add/operator/do.js",
      "rxjs/add/operator/distinctUntilKeyChanged": "/app/node_modules/rxjs/_esm5/add/operator/distinctUntilKeyChanged.js",
      "rxjs/add/operator/distinctUntilChanged": "/app/node_modules/rxjs/_esm5/add/operator/distinctUntilChanged.js",
      "rxjs/add/operator/distinct": "/app/node_modules/rxjs/_esm5/add/operator/distinct.js",
      "rxjs/add/operator/dematerialize": "/app/node_modules/rxjs/_esm5/add/operator/dematerialize.js",
      "rxjs/add/operator/delayWhen": "/app/node_modules/rxjs/_esm5/add/operator/delayWhen.js",
      "rxjs/add/operator/delay": "/app/node_modules/rxjs/_esm5/add/operator/delay.js",
      "rxjs/add/operator/defaultIfEmpty": "/app/node_modules/rxjs/_esm5/add/operator/defaultIfEmpty.js",
      "rxjs/add/operator/debounceTime": "/app/node_modules/rxjs/_esm5/add/operator/debounceTime.js",
      "rxjs/add/operator/debounce": "/app/node_modules/rxjs/_esm5/add/operator/debounce.js",
      "rxjs/add/operator/count": "/app/node_modules/rxjs/_esm5/add/operator/count.js",
      "rxjs/add/operator/concatMapTo": "/app/node_modules/rxjs/_esm5/add/operator/concatMapTo.js",
      "rxjs/add/operator/concatMap": "/app/node_modules/rxjs/_esm5/add/operator/concatMap.js",
      "rxjs/add/operator/concatAll": "/app/node_modules/rxjs/_esm5/add/operator/concatAll.js",
      "rxjs/add/operator/concat": "/app/node_modules/rxjs/_esm5/add/operator/concat.js",
      "rxjs/add/operator/combineLatest": "/app/node_modules/rxjs/_esm5/add/operator/combineLatest.js",
      "rxjs/add/operator/combineAll": "/app/node_modules/rxjs/_esm5/add/operator/combineAll.js",
      "rxjs/add/operator/catch": "/app/node_modules/rxjs/_esm5/add/operator/catch.js",
      "rxjs/add/operator/bufferWhen": "/app/node_modules/rxjs/_esm5/add/operator/bufferWhen.js",
      "rxjs/add/operator/bufferToggle": "/app/node_modules/rxjs/_esm5/add/operator/bufferToggle.js",
      "rxjs/add/operator/bufferTime": "/app/node_modules/rxjs/_esm5/add/operator/bufferTime.js",
      "rxjs/add/operator/bufferCount": "/app/node_modules/rxjs/_esm5/add/operator/bufferCount.js",
      "rxjs/add/operator/buffer": "/app/node_modules/rxjs/_esm5/add/operator/buffer.js",
      "rxjs/add/operator/auditTime": "/app/node_modules/rxjs/_esm5/add/operator/auditTime.js",
      "rxjs/add/operator/audit": "/app/node_modules/rxjs/_esm5/add/operator/audit.js",
      "rxjs/add/observable/zip": "/app/node_modules/rxjs/_esm5/add/observable/zip.js",
      "rxjs/add/observable/using": "/app/node_modules/rxjs/_esm5/add/observable/using.js",
      "rxjs/add/observable/timer": "/app/node_modules/rxjs/_esm5/add/observable/timer.js",
      "rxjs/add/observable/throw": "/app/node_modules/rxjs/_esm5/add/observable/throw.js",
      "rxjs/add/observable/range": "/app/node_modules/rxjs/_esm5/add/observable/range.js",
      "rxjs/add/observable/race": "/app/node_modules/rxjs/_esm5/add/observable/race.js",
      "rxjs/add/observable/pairs": "/app/node_modules/rxjs/_esm5/add/observable/pairs.js",
      "rxjs/add/observable/onErrorResumeNext": "/app/node_modules/rxjs/_esm5/add/observable/onErrorResumeNext.js",
      "rxjs/add/observable/of": "/app/node_modules/rxjs/_esm5/add/observable/of.js",
      "rxjs/add/observable/never": "/app/node_modules/rxjs/_esm5/add/observable/never.js",
      "rxjs/add/observable/merge": "/app/node_modules/rxjs/_esm5/add/observable/merge.js",
      "rxjs/add/observable/interval": "/app/node_modules/rxjs/_esm5/add/observable/interval.js",
      "rxjs/add/observable/if": "/app/node_modules/rxjs/_esm5/add/observable/if.js",
      "rxjs/add/observable/generate": "/app/node_modules/rxjs/_esm5/add/observable/generate.js",
      "rxjs/add/observable/fromPromise": "/app/node_modules/rxjs/_esm5/add/observable/fromPromise.js",
      "rxjs/add/observable/fromEventPattern": "/app/node_modules/rxjs/_esm5/add/observable/fromEventPattern.js",
      "rxjs/add/observable/fromEvent": "/app/node_modules/rxjs/_esm5/add/observable/fromEvent.js",
      "rxjs/add/observable/from": "/app/node_modules/rxjs/_esm5/add/observable/from.js",
      "rxjs/add/observable/forkJoin": "/app/node_modules/rxjs/_esm5/add/observable/forkJoin.js",
      "rxjs/add/observable/empty": "/app/node_modules/rxjs/_esm5/add/observable/empty.js",
      "rxjs/add/observable/dom/webSocket": "/app/node_modules/rxjs/_esm5/add/observable/dom/webSocket.js",
      "rxjs/add/observable/dom/ajax": "/app/node_modules/rxjs/_esm5/add/observable/dom/ajax.js",
      "rxjs/add/observable/defer": "/app/node_modules/rxjs/_esm5/add/observable/defer.js",
      "rxjs/add/observable/concat": "/app/node_modules/rxjs/_esm5/add/observable/concat.js",
      "rxjs/add/observable/combineLatest": "/app/node_modules/rxjs/_esm5/add/observable/combineLatest.js",
      "rxjs/add/observable/bindNodeCallback": "/app/node_modules/rxjs/_esm5/add/observable/bindNodeCallback.js",
      "rxjs/add/observable/bindCallback": "/app/node_modules/rxjs/_esm5/add/observable/bindCallback.js",
      "rxjs/Subscription": "/app/node_modules/rxjs/_esm5/Subscription.js",
      "rxjs/Subscriber": "/app/node_modules/rxjs/_esm5/Subscriber.js",
      "rxjs/SubjectSubscription": "/app/node_modules/rxjs/_esm5/SubjectSubscription.js",
      "rxjs/Subject": "/app/node_modules/rxjs/_esm5/Subject.js",
      "rxjs/Scheduler": "/app/node_modules/rxjs/_esm5/Scheduler.js",
      "rxjs/Rx": "/app/node_modules/rxjs/_esm5/Rx.js",
      "rxjs/ReplaySubject": "/app/node_modules/rxjs/_esm5/ReplaySubject.js",
      "rxjs/OuterSubscriber": "/app/node_modules/rxjs/_esm5/OuterSubscriber.js",
      "rxjs/Operator": "/app/node_modules/rxjs/_esm5/Operator.js",
      "rxjs/Observer": "/app/node_modules/rxjs/_esm5/Observer.js",
      "rxjs/Observable": "/app/node_modules/rxjs/_esm5/Observable.js",
      "rxjs/Notification": "/app/node_modules/rxjs/_esm5/Notification.js",
      "rxjs/InnerSubscriber": "/app/node_modules/rxjs/_esm5/InnerSubscriber.js",
      "rxjs/BehaviorSubject": "/app/node_modules/rxjs/_esm5/BehaviorSubject.js",
      "rxjs/AsyncSubject": "/app/node_modules/rxjs/_esm5/AsyncSubject.js"
    },
    "mainFields": [
      "browser",
      "module",
      "main"
    ]
  },
  "externals": [
    resolveExternals
  ],
  "resolveLoader": {
    "modules": [
      "./node_modules",
      "./node_modules"
    ]
  },
  "entry": {
    "main": [
      "./src/main.ts"
    ],
    "polyfills": [
      "./src/polyfills.ts"
    ],
    "styles": [
      "./src/styles.scss"
    ]
  },
  "output": {
    "path": path.join(process.cwd(), "dist"),
    "filename": "[name].bundle.js",
    "chunkFilename": "[id].chunk.js",
    "crossOriginLoading": false
  },
  "module": {
    "rules": [
      {
        "test": /\.html$/,
        "loader": "raw-loader"
      },
      {
        "test": /\.(eot|svg|cur)$/,
        "loader": "file-loader",
        "options": {
          "name": "[name].[hash:20].[ext]",
          "limit": 10000
        }
      },
      {
        "test": /\.(jpg|png|webp|gif|otf|ttf|woff|woff2|ani)$/,
        "loader": "url-loader",
        "options": {
          "name": "[name].[hash:20].[ext]",
          "limit": 10000
        }
      },
      {
        "exclude": [
          path.join(process.cwd(), "src/styles.scss")
        ],
        "test": /\.css$/,
        "use": [
          "exports-loader?module.exports.toString()",
          {
            "loader": "css-loader",
            "options": {
              "sourceMap": false,
              "importLoaders": 1
            }
          },
          {
            "loader": "postcss-loader",
            "options": {
              "ident": "postcss",
              "plugins": postcssPlugins
            }
          }
        ]
      },
      {
        "exclude": [
          path.join(process.cwd(), "src/styles.scss")
        ],
        "test": /\.scss$|\.sass$/,
        "use": [
          "exports-loader?module.exports.toString()",
          {
            "loader": "css-loader",
            "options": {
              "sourceMap": false,
              "importLoaders": 1
            }
          },
          {
            "loader": "postcss-loader",
            "options": {
              "ident": "postcss",
              "plugins": postcssPlugins
            }
          },
          {
            "loader": "sass-loader",
            "options": {
              "sourceMap": false,
              "precision": 8,
              "includePaths": []
            }
          }
        ]
      },
      {
        "exclude": [
          path.join(process.cwd(), "src/styles.scss")
        ],
        "test": /\.less$/,
        "use": [
          "exports-loader?module.exports.toString()",
          {
            "loader": "css-loader",
            "options": {
              "sourceMap": false,
              "importLoaders": 1
            }
          },
          {
            "loader": "postcss-loader",
            "options": {
              "ident": "postcss",
              "plugins": postcssPlugins
            }
          },
          {
            "loader": "less-loader",
            "options": {
              "sourceMap": false
            }
          }
        ]
      },
      {
        "exclude": [
          path.join(process.cwd(), "src/styles.scss")
        ],
        "test": /\.styl$/,
        "use": [
          "exports-loader?module.exports.toString()",
          {
            "loader": "css-loader",
            "options": {
              "sourceMap": false,
              "importLoaders": 1
            }
          },
          {
            "loader": "postcss-loader",
            "options": {
              "ident": "postcss",
              "plugins": postcssPlugins
            }
          },
          {
            "loader": "stylus-loader",
            "options": {
              "sourceMap": false,
              "paths": []
            }
          }
        ]
      },
      {
        "include": [
          path.join(process.cwd(), "src/styles.scss")
        ],
        "test": /\.css$/,
        "use": [
          "style-loader",
          {
            "loader": "css-loader",
            "options": {
              "sourceMap": false,
              "importLoaders": 1
            }
          },
          {
            "loader": "postcss-loader",
            "options": {
              "ident": "postcss",
              "plugins": postcssPlugins
            }
          }
        ]
      },
      {
        "include": [
          path.join(process.cwd(), "src/styles.scss")
        ],
        "test": /\.scss$|\.sass$/,
        "use": [
          "style-loader",
          {
            "loader": "css-loader",
            "options": {
              "sourceMap": false,
              "importLoaders": 1
            }
          },
          {
            "loader": "postcss-loader",
            "options": {
              "ident": "postcss",
              "plugins": postcssPlugins
            }
          },
          {
            "loader": "sass-loader",
            "options": {
              "sourceMap": false,
              "precision": 8,
              "includePaths": []
            }
          }
        ]
      },
      {
        "include": [
          path.join(process.cwd(), "src/styles.scss")
        ],
        "test": /\.less$/,
        "use": [
          "style-loader",
          {
            "loader": "css-loader",
            "options": {
              "sourceMap": false,
              "importLoaders": 1
            }
          },
          {
            "loader": "postcss-loader",
            "options": {
              "ident": "postcss",
              "plugins": postcssPlugins
            }
          },
          {
            "loader": "less-loader",
            "options": {
              "sourceMap": false
            }
          }
        ]
      },
      {
        "include": [
          path.join(process.cwd(), "src/styles.scss")
        ],
        "test": /\.styl$/,
        "use": [
          "style-loader",
          {
            "loader": "css-loader",
            "options": {
              "sourceMap": false,
              "importLoaders": 1
            }
          },
          {
            "loader": "postcss-loader",
            "options": {
              "ident": "postcss",
              "plugins": postcssPlugins
            }
          },
          {
            "loader": "stylus-loader",
            "options": {
              "sourceMap": false,
              "paths": []
            }
          }
        ]
      },
      {
        "test": /(?:\.ngfactory\.js|\.ngstyle\.js|\.ts)$/,
        "use": [
          "@ngtools/webpack"
        ]
      }
    ]
  },
  "plugins": [
    new NoEmitOnErrorsPlugin(),
    new CopyWebpackPlugin([
      {
        "context": "src",
        "to": "",
        "from": {
          "glob": "assets/**/*",
          "dot": true
        }
      },
      {
        "context": "src",
        "to": "",
        "from": {
          "glob": "favicon.ico",
          "dot": true
        }
      }
    ], {
      "ignore": [
        ".gitkeep"
      ],
      "debug": "warning"
    }),
    new ProgressPlugin(),
    new CircularDependencyPlugin({
      "exclude": /(\\|\/)node_modules(\\|\/)/,
      "failOnError": false
    }),
    new NamedLazyChunksWebpackPlugin(),
    new HtmlWebpackPlugin({
      "template": "./src/index.html",
      "filename": "./index.html",
      "hash": false,
      "inject": true,
      "compile": true,
      "favicon": false,
      "minify": false,
      "cache": true,
      "showErrors": true,
      "chunks": "all",
      "excludeChunks": [],
      "title": "Webpack App",
      "xhtml": true,
      "chunksSortMode": function sort(left, right) {
        let leftIndex = entryPoints.indexOf(left.names[0]);
        let rightindex = entryPoints.indexOf(right.names[0]);
        if (leftIndex > rightindex) {
          return 1;
        }
        else if (leftIndex < rightindex) {
          return -1;
        }
        else {
          return 0;
        }
      }
    }),
    new BaseHrefWebpackPlugin({}),
    new CommonsChunkPlugin({
      "name": [
        "inline"
      ],
      "minChunks": null
    }),
    new CommonsChunkPlugin({
      "name": [
        "vendor"
      ],
      "minChunks": (module) => {
        return module.resource
          && (module.resource.startsWith(nodeModules)
            || module.resource.startsWith(genDirNodeModules)
            || module.resource.startsWith(realNodeModules));
      },
      "chunks": [
        "main"
      ]
    }),
    new SourceMapDevToolPlugin({
      "filename": "[file].map[query]",
      "moduleFilenameTemplate": "[resource-path]",
      "fallbackModuleFilenameTemplate": "[resource-path]?[hash]",
      "sourceRoot": "webpack:///"
    }),
    new CommonsChunkPlugin({
      "name": [
        "main"
      ],
      "minChunks": 2,
      "async": "common"
    }),
    new NamedModulesPlugin({}),
    new AngularCompilerPlugin({
      "mainPath": "main.ts",
      "platform": 0,
      "hostReplacementPaths": {
        "environments/environment.ts": "environments/environment.ts"
      },
      "sourceMap": true,
      "tsConfigPath": "src/tsconfig.app.json",
      "skipCodeGeneration": true,
      "compilerOptions": {}
    }),
    new webpack.ProvidePlugin({
      __extends: 'typescript-extends'
    })
  ],
  "node": {
    "fs": "empty",
    "global": true,
    "crypto": "empty",
    "tls": "empty",
    "net": "empty",
    "process": true,
    "module": false,
    "clearImmediate": false,
    "setImmediate": false,
    "__dirname": true
  },
  "devServer": {
    "historyApiFallback": true
  }
};

function resolveExternals(context, request, callback) {
  return resolveMeteor(request, callback) ||
    callback();
}

function resolveMeteor(request, callback) {
  var match = request.match(/^meteor\/(.+)$/);
  var pack = match && match[1];


  if (pack) {
    callback(null, 'Package["' + pack + '"]');
    return true;
  }
}
