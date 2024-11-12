const _global =
    "undefined" != typeof globalThis
        ? globalThis
        : "undefined" != typeof self
            ? self
            : "undefined" != typeof window
                ? window
                : global,
    keys = Object.keys,
    isArray = Array.isArray;
function extend(e, t) {
    return (
        "object" != typeof t ||
        keys(t).forEach(function (n) {
            e[n] = t[n];
        }),
        e
    );
}
"undefined" == typeof Promise || _global.Promise || (_global.Promise = Promise);
const getProto = Object.getPrototypeOf,
    _hasOwn = {}.hasOwnProperty;
function hasOwn(e, t) {
    return _hasOwn.call(e, t);
}
function props(e, t) {
    "function" == typeof t && (t = t(getProto(e))),
        ("undefined" == typeof Reflect ? keys : Reflect.ownKeys)(t).forEach((n) => {
            setProp(e, n, t[n]);
        });
}
const defineProperty = Object.defineProperty;
function setProp(e, t, n, r) {
    defineProperty(
        e,
        t,
        extend(
            n && hasOwn(n, "get") && "function" == typeof n.get
                ? { get: n.get, set: n.set, configurable: !0 }
                : { value: n, configurable: !0, writable: !0 },
            r
        )
    );
}
function derive(e) {
    return {
        from: function (t) {
            return (
                (e.prototype = Object.create(t.prototype)),
                setProp(e.prototype, "constructor", e),
                { extend: props.bind(null, e.prototype) }
            );
        },
    };
}
const getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
function getPropertyDescriptor(e, t) {
    let n;
    return (
        getOwnPropertyDescriptor(e, t) ||
        ((n = getProto(e)) && getPropertyDescriptor(n, t))
    );
}
const _slice = [].slice;
function slice(e, t, n) {
    return _slice.call(e, t, n);
}
function override(e, t) {
    return t(e);
}
function assert(e) {
    if (!e) throw new Error("Assertion Failed");
}
function asap$1(e) {
    _global.setImmediate ? setImmediate(e) : setTimeout(e, 0);
}
function arrayToObject(e, t) {
    return e.reduce((e, n, r) => {
        var i = t(n, r);
        return i && (e[i[0]] = i[1]), e;
    }, {});
}
function tryCatch(e, t, n) {
    try {
        e.apply(null, n);
    } catch (e) {
        t && t(e);
    }
}
function getByKeyPath(e, t) {
    if ("string" == typeof t && hasOwn(e, t)) return e[t];
    if (!t) return e;
    if ("string" != typeof t) {
        for (var n = [], r = 0, i = t.length; r < i; ++r) {
            var a = getByKeyPath(e, t[r]);
            n.push(a);
        }
        return n;
    }
    var o = t.indexOf(".");
    if (-1 !== o) {
        var s = e[t.substr(0, o)];
        return void 0 === s ? void 0 : getByKeyPath(s, t.substr(o + 1));
    }
}
function setByKeyPath(e, t, n) {
    if (e && void 0 !== t && (!("isFrozen" in Object) || !Object.isFrozen(e)))
        if ("string" != typeof t && "length" in t) {
            assert("string" != typeof n && "length" in n);
            for (var r = 0, i = t.length; r < i; ++r) setByKeyPath(e, t[r], n[r]);
        } else {
            var a = t.indexOf(".");
            if (-1 !== a) {
                var o = t.substr(0, a),
                    s = t.substr(a + 1);
                if ("" === s)
                    void 0 === n
                        ? isArray(e) && !isNaN(parseInt(o))
                            ? e.splice(o, 1)
                            : delete e[o]
                        : (e[o] = n);
                else {
                    var l = e[o];
                    (l && hasOwn(e, o)) || (l = e[o] = {}), setByKeyPath(l, s, n);
                }
            } else
                void 0 === n
                    ? isArray(e) && !isNaN(parseInt(t))
                        ? e.splice(t, 1)
                        : delete e[t]
                    : (e[t] = n);
        }
}
function delByKeyPath(e, t) {
    "string" == typeof t
        ? setByKeyPath(e, t, void 0)
        : "length" in t &&
        [].map.call(t, function (t) {
            setByKeyPath(e, t, void 0);
        });
}
function shallowClone(e) {
    var t = {};
    for (var n in e) hasOwn(e, n) && (t[n] = e[n]);
    return t;
}
const concat = [].concat;
function flatten(e) {
    return concat.apply([], e);
}
const intrinsicTypeNames =
    "BigUint64Array,BigInt64Array,Array,Boolean,String,Date,RegExp,Blob,File,FileList,FileSystemFileHandle,FileSystemDirectoryHandle,ArrayBuffer,DataView,Uint8ClampedArray,ImageBitmap,ImageData,Map,Set,CryptoKey"
        .split(",")
        .concat(
            flatten(
                [8, 16, 32, 64].map((e) =>
                    ["Int", "Uint", "Float"].map((t) => t + e + "Array")
                )
            )
        )
        .filter((e) => _global[e]),
    intrinsicTypes = intrinsicTypeNames.map((e) => _global[e]);
arrayToObject(intrinsicTypeNames, (e) => [e, !0]);
let circularRefs = null;
function deepClone(e) {
    circularRefs = "undefined" != typeof WeakMap && new WeakMap();
    const t = innerDeepClone(e);
    return (circularRefs = null), t;
}
function innerDeepClone(e) {
    if (!e || "object" != typeof e) return e;
    let t = circularRefs && circularRefs.get(e);
    if (t) return t;
    if (isArray(e)) {
        (t = []), circularRefs && circularRefs.set(e, t);
        for (var n = 0, r = e.length; n < r; ++n) t.push(innerDeepClone(e[n]));
    } else if (intrinsicTypes.indexOf(e.constructor) >= 0) t = e;
    else {
        const n = getProto(e);
        for (var i in ((t = n === Object.prototype ? {} : Object.create(n)),
            circularRefs && circularRefs.set(e, t),
            e))
            hasOwn(e, i) && (t[i] = innerDeepClone(e[i]));
    }
    return t;
}
const { toString: toString } = {};
function toStringTag(e) {
    return toString.call(e).slice(8, -1);
}
const iteratorSymbol =
    "undefined" != typeof Symbol ? Symbol.iterator : "@@iterator",
    getIteratorOf =
        "symbol" == typeof iteratorSymbol
            ? function (e) {
                var t;
                return null != e && (t = e[iteratorSymbol]) && t.apply(e);
            }
            : function () {
                return null;
            },
    NO_CHAR_ARRAY = {};
function getArrayOf(e) {
    var t, n, r, i;
    if (1 === arguments.length) {
        if (isArray(e)) return e.slice();
        if (this === NO_CHAR_ARRAY && "string" == typeof e) return [e];
        if ((i = getIteratorOf(e))) {
            for (n = []; !(r = i.next()).done;) n.push(r.value);
            return n;
        }
        if (null == e) return [e];
        if ("number" == typeof (t = e.length)) {
            for (n = new Array(t); t--;) n[t] = e[t];
            return n;
        }
        return [e];
    }
    for (t = arguments.length, n = new Array(t); t--;) n[t] = arguments[t];
    return n;
}
const isAsyncFunction =
    "undefined" != typeof Symbol
        ? (e) => "AsyncFunction" === e[Symbol.toStringTag]
        : () => !1;
var debug =
    "undefined" != typeof location &&
    /^(http|https):\/\/(localhost|127\.0\.0\.1)/.test(location.href);
function setDebug(e, t) {
    (debug = e), (libraryFilter = t);
}
var libraryFilter = () => !0;
const NEEDS_THROW_FOR_STACK = !new Error("").stack;
function getErrorWithStack() {
    if (NEEDS_THROW_FOR_STACK)
        try {
            throw (getErrorWithStack.arguments, new Error());
        } catch (e) {
            return e;
        }
    return new Error();
}
function prettyStack(e, t) {
    var n = e.stack;
    return n
        ? ((t = t || 0),
            0 === n.indexOf(e.name) && (t += (e.name + e.message).split("\n").length),
            n
                .split("\n")
                .slice(t)
                .filter(libraryFilter)
                .map((e) => "\n" + e)
                .join(""))
        : "";
}
var dexieErrorNames = [
    "Modify",
    "Bulk",
    "OpenFailed",
    "VersionChange",
    "Schema",
    "Upgrade",
    "InvalidTable",
    "MissingAPI",
    "NoSuchDatabase",
    "InvalidArgument",
    "SubTransaction",
    "Unsupported",
    "Internal",
    "DatabaseClosed",
    "PrematureCommit",
    "ForeignAwait",
],
    idbDomErrorNames = [
        "Unknown",
        "Constraint",
        "Data",
        "TransactionInactive",
        "ReadOnly",
        "Version",
        "NotFound",
        "InvalidState",
        "InvalidAccess",
        "Abort",
        "Timeout",
        "QuotaExceeded",
        "Syntax",
        "DataClone",
    ],
    errorList = dexieErrorNames.concat(idbDomErrorNames),
    defaultTexts = {
        VersionChanged: "Database version changed by other database connection",
        DatabaseClosed: "Database has been closed",
        Abort: "Transaction aborted",
        TransactionInactive: "Transaction has already completed or failed",
        MissingAPI:
            "IndexedDB API missing. Please visit https://tinyurl.com/y2uuvskb",
    };
function DexieError(e, t) {
    (this._e = getErrorWithStack()), (this.name = e), (this.message = t);
}
function getMultiErrorMessage(e, t) {
    return (
        e +
        ". Errors: " +
        Object.keys(t)
            .map((e) => t[e].toString())
            .filter((e, t, n) => n.indexOf(e) === t)
            .join("\n")
    );
}
function ModifyError(e, t, n, r) {
    (this._e = getErrorWithStack()),
        (this.failures = t),
        (this.failedKeys = r),
        (this.successCount = n),
        (this.message = getMultiErrorMessage(e, t));
}
function BulkError(e, t) {
    (this._e = getErrorWithStack()),
        (this.name = "BulkError"),
        (this.failures = Object.keys(t).map((e) => t[e])),
        (this.failuresByPos = t),
        (this.message = getMultiErrorMessage(e, t));
}
derive(DexieError)
    .from(Error)
    .extend({
        stack: {
            get: function () {
                return (
                    this._stack ||
                    (this._stack =
                        this.name + ": " + this.message + prettyStack(this._e, 2))
                );
            },
        },
        toString: function () {
            return this.name + ": " + this.message;
        },
    }),
    derive(ModifyError).from(DexieError),
    derive(BulkError).from(DexieError);
var errnames = errorList.reduce((e, t) => ((e[t] = t + "Error"), e), {});
const BaseException = DexieError;
var exceptions = errorList.reduce((e, t) => {
    var n = t + "Error";
    function r(e, r) {
        (this._e = getErrorWithStack()),
            (this.name = n),
            e
                ? "string" == typeof e
                    ? ((this.message = `${e}${r ? "\n " + r : ""}`),
                        (this.inner = r || null))
                    : "object" == typeof e &&
                    ((this.message = `${e.name} ${e.message}`), (this.inner = e))
                : ((this.message = defaultTexts[t] || n), (this.inner = null));
    }
    return derive(r).from(BaseException), (e[t] = r), e;
}, {});
(exceptions.Syntax = SyntaxError),
    (exceptions.Type = TypeError),
    (exceptions.Range = RangeError);
var exceptionMap = idbDomErrorNames.reduce(
    (e, t) => ((e[t + "Error"] = exceptions[t]), e),
    {}
);
function mapError(e, t) {
    if (
        !e ||
        e instanceof DexieError ||
        e instanceof TypeError ||
        e instanceof SyntaxError ||
        !e.name ||
        !exceptionMap[e.name]
    )
        return e;
    var n = new exceptionMap[e.name](t || e.message, e);
    return (
        "stack" in e &&
        setProp(n, "stack", {
            get: function () {
                return this.inner.stack;
            },
        }),
        n
    );
}
var fullNameExceptions = errorList.reduce(
    (e, t) => (
        -1 === ["Syntax", "Type", "Range"].indexOf(t) &&
        (e[t + "Error"] = exceptions[t]),
        e
    ),
    {}
);
function nop() { }
function mirror(e) {
    return e;
}
function pureFunctionChain(e, t) {
    return null == e || e === mirror
        ? t
        : function (n) {
            return t(e(n));
        };
}
function callBoth(e, t) {
    return function () {
        e.apply(this, arguments), t.apply(this, arguments);
    };
}
function hookCreatingChain(e, t) {
    return e === nop
        ? t
        : function () {
            var n = e.apply(this, arguments);
            void 0 !== n && (arguments[0] = n);
            var r = this.onsuccess,
                i = this.onerror;
            (this.onsuccess = null), (this.onerror = null);
            var a = t.apply(this, arguments);
            return (
                r &&
                (this.onsuccess = this.onsuccess ? callBoth(r, this.onsuccess) : r),
                i && (this.onerror = this.onerror ? callBoth(i, this.onerror) : i),
                void 0 !== a ? a : n
            );
        };
}
function hookDeletingChain(e, t) {
    return e === nop
        ? t
        : function () {
            e.apply(this, arguments);
            var n = this.onsuccess,
                r = this.onerror;
            (this.onsuccess = this.onerror = null),
                t.apply(this, arguments),
                n &&
                (this.onsuccess = this.onsuccess ? callBoth(n, this.onsuccess) : n),
                r && (this.onerror = this.onerror ? callBoth(r, this.onerror) : r);
        };
}
function hookUpdatingChain(e, t) {
    return e === nop
        ? t
        : function (n) {
            var r = e.apply(this, arguments);
            extend(n, r);
            var i = this.onsuccess,
                a = this.onerror;
            (this.onsuccess = null), (this.onerror = null);
            var o = t.apply(this, arguments);
            return (
                i &&
                (this.onsuccess = this.onsuccess ? callBoth(i, this.onsuccess) : i),
                a && (this.onerror = this.onerror ? callBoth(a, this.onerror) : a),
                void 0 === r ? (void 0 === o ? void 0 : o) : extend(r, o)
            );
        };
}
function reverseStoppableEventChain(e, t) {
    return e === nop
        ? t
        : function () {
            return !1 !== t.apply(this, arguments) && e.apply(this, arguments);
        };
}
function promisableChain(e, t) {
    return e === nop
        ? t
        : function () {
            var n = e.apply(this, arguments);
            if (n && "function" == typeof n.then) {
                for (var r = this, i = arguments.length, a = new Array(i); i--;)
                    a[i] = arguments[i];
                return n.then(function () {
                    return t.apply(r, a);
                });
            }
            return t.apply(this, arguments);
        };
}
(fullNameExceptions.ModifyError = ModifyError),
    (fullNameExceptions.DexieError = DexieError),
    (fullNameExceptions.BulkError = BulkError);
var INTERNAL = {};
const LONG_STACKS_CLIP_LIMIT = 100,
    MAX_LONG_STACKS = 20,
    ZONE_ECHO_LIMIT = 100,
    [resolvedNativePromise, nativePromiseProto, resolvedGlobalPromise] =
        "undefined" == typeof Promise
            ? []
            : (() => {
                let e = Promise.resolve();
                if ("undefined" == typeof crypto || !crypto.subtle)
                    return [e, getProto(e), e];
                const t = crypto.subtle.digest("SHA-512", new Uint8Array([0]));
                return [t, getProto(t), e];
            })(),
    nativePromiseThen = nativePromiseProto && nativePromiseProto.then,
    NativePromise = resolvedNativePromise && resolvedNativePromise.constructor,
    patchGlobalPromise = !!resolvedGlobalPromise;
var stack_being_generated = !1,
    schedulePhysicalTick = resolvedGlobalPromise
        ? () => {
            resolvedGlobalPromise.then(physicalTick);
        }
        : _global.setImmediate
            ? setImmediate.bind(null, physicalTick)
            : _global.MutationObserver
                ? () => {
                    var e = document.createElement("div");
                    new MutationObserver(() => {
                        physicalTick(), (e = null);
                    }).observe(e, { attributes: !0 }),
                        e.setAttribute("i", "1");
                }
                : () => {
                    setTimeout(physicalTick, 0);
                },
    asap = function (e, t) {
        microtickQueue.push([e, t]),
            needsNewPhysicalTick &&
            (schedulePhysicalTick(), (needsNewPhysicalTick = !1));
    },
    isOutsideMicroTick = !0,
    needsNewPhysicalTick = !0,
    unhandledErrors = [],
    rejectingErrors = [],
    currentFulfiller = null,
    rejectionMapper = mirror,
    globalPSD = {
        id: "global",
        global: !0,
        ref: 0,
        unhandleds: [],
        onunhandled: globalError,
        pgp: !1,
        env: {},
        finalize: function () {
            this.unhandleds.forEach((e) => {
                try {
                    globalError(e[0], e[1]);
                } catch (e) { }
            });
        },
    },
    PSD = globalPSD,
    microtickQueue = [],
    numScheduledCalls = 0,
    tickFinalizers = [];
function DexiePromise(e) {
    if ("object" != typeof this)
        throw new TypeError("Promises must be constructed via new");
    (this._listeners = []), (this.onuncatched = nop), (this._lib = !1);
    var t = (this._PSD = PSD);
    if (
        (debug &&
            ((this._stackHolder = getErrorWithStack()),
                (this._prev = null),
                (this._numPrev = 0)),
            "function" != typeof e)
    ) {
        if (e !== INTERNAL) throw new TypeError("Not a function");
        return (
            (this._state = arguments[1]),
            (this._value = arguments[2]),
            void (!1 === this._state && handleRejection(this, this._value))
        );
    }
    (this._state = null),
        (this._value = null),
        ++t.ref,
        executePromiseTask(this, e);
}
const thenProp = {
    get: function () {
        var e = PSD,
            t = totalEchoes;
        function n(n, r) {
            var i = !e.global && (e !== PSD || t !== totalEchoes);
            const a = i && !decrementExpectedAwaits();
            var o = new DexiePromise((t, o) => {
                propagateToListener(
                    this,
                    new Listener(
                        nativeAwaitCompatibleWrap(n, e, i, a),
                        nativeAwaitCompatibleWrap(r, e, i, a),
                        t,
                        o,
                        e
                    )
                );
            });
            return debug && linkToPreviousPromise(o, this), o;
        }
        return (n.prototype = INTERNAL), n;
    },
    set: function (e) {
        setProp(
            this,
            "then",
            e && e.prototype === INTERNAL
                ? thenProp
                : {
                    get: function () {
                        return e;
                    },
                    set: thenProp.set,
                }
        );
    },
};
function Listener(e, t, n, r, i) {
    (this.onFulfilled = "function" == typeof e ? e : null),
        (this.onRejected = "function" == typeof t ? t : null),
        (this.resolve = n),
        (this.reject = r),
        (this.psd = i);
}
function executePromiseTask(e, t) {
    try {
        t((t) => {
            if (null === e._state) {
                if (t === e)
                    throw new TypeError("A promise cannot be resolved with itself.");
                var n = e._lib && beginMicroTickScope();
                t && "function" == typeof t.then
                    ? executePromiseTask(e, (e, n) => {
                        t instanceof DexiePromise ? t._then(e, n) : t.then(e, n);
                    })
                    : ((e._state = !0), (e._value = t), propagateAllListeners(e)),
                    n && endMicroTickScope();
            }
        }, handleRejection.bind(null, e));
    } catch (t) {
        handleRejection(e, t);
    }
}
function handleRejection(e, t) {
    if ((rejectingErrors.push(t), null === e._state)) {
        var n = e._lib && beginMicroTickScope();
        (t = rejectionMapper(t)),
            (e._state = !1),
            (e._value = t),
            debug &&
            null !== t &&
            "object" == typeof t &&
            !t._promise &&
            tryCatch(() => {
                var n = getPropertyDescriptor(t, "stack");
                (t._promise = e),
                    setProp(t, "stack", {
                        get: () =>
                            stack_being_generated
                                ? n && (n.get ? n.get.apply(t) : n.value)
                                : e.stack,
                    });
            }),
            addPossiblyUnhandledError(e),
            propagateAllListeners(e),
            n && endMicroTickScope();
    }
}
function propagateAllListeners(e) {
    var t = e._listeners;
    e._listeners = [];
    for (var n = 0, r = t.length; n < r; ++n) propagateToListener(e, t[n]);
    var i = e._PSD;
    --i.ref || i.finalize(),
        0 === numScheduledCalls &&
        (++numScheduledCalls,
            asap(() => {
                0 == --numScheduledCalls && finalizePhysicalTick();
            }, []));
}
function propagateToListener(e, t) {
    if (null !== e._state) {
        var n = e._state ? t.onFulfilled : t.onRejected;
        if (null === n) return (e._state ? t.resolve : t.reject)(e._value);
        ++t.psd.ref, ++numScheduledCalls, asap(callListener, [n, e, t]);
    } else e._listeners.push(t);
}
function callListener(e, t, n) {
    try {
        currentFulfiller = t;
        var r,
            i = t._value;
        t._state
            ? (r = e(i))
            : (rejectingErrors.length && (rejectingErrors = []),
                (r = e(i)),
                -1 === rejectingErrors.indexOf(i) && markErrorAsHandled(t)),
            n.resolve(r);
    } catch (e) {
        n.reject(e);
    } finally {
        (currentFulfiller = null),
            0 == --numScheduledCalls && finalizePhysicalTick(),
            --n.psd.ref || n.psd.finalize();
    }
}
function getStack(e, t, n) {
    if (t.length === n) return t;
    var r = "";
    if (!1 === e._state) {
        var i,
            a,
            o = e._value;
        null != o
            ? ((i = o.name || "Error"), (a = o.message || o), (r = prettyStack(o, 0)))
            : ((i = o), (a = "")),
            t.push(i + (a ? ": " + a : "") + r);
    }
    return (
        debug &&
        ((r = prettyStack(e._stackHolder, 2)) && -1 === t.indexOf(r) && t.push(r),
            e._prev && getStack(e._prev, t, n)),
        t
    );
}
function linkToPreviousPromise(e, t) {
    var n = t ? t._numPrev + 1 : 0;
    n < 100 && ((e._prev = t), (e._numPrev = n));
}
function physicalTick() {
    beginMicroTickScope() && endMicroTickScope();
}
function beginMicroTickScope() {
    var e = isOutsideMicroTick;
    return (isOutsideMicroTick = !1), (needsNewPhysicalTick = !1), e;
}
function endMicroTickScope() {
    var e, t, n;
    do {
        for (; microtickQueue.length > 0;)
            for (
                e = microtickQueue, microtickQueue = [], n = e.length, t = 0;
                t < n;
                ++t
            ) {
                var r = e[t];
                r[0].apply(null, r[1]);
            }
    } while (microtickQueue.length > 0);
    (isOutsideMicroTick = !0), (needsNewPhysicalTick = !0);
}
function finalizePhysicalTick() {
    var e = unhandledErrors;
    (unhandledErrors = []),
        e.forEach((e) => {
            e._PSD.onunhandled.call(null, e._value, e);
        });
    for (var t = tickFinalizers.slice(0), n = t.length; n;) t[--n]();
}
function run_at_end_of_this_or_next_physical_tick(e) {
    tickFinalizers.push(function t() {
        e(), tickFinalizers.splice(tickFinalizers.indexOf(t), 1);
    }),
        ++numScheduledCalls,
        asap(() => {
            0 == --numScheduledCalls && finalizePhysicalTick();
        }, []);
}
function addPossiblyUnhandledError(e) {
    unhandledErrors.some((t) => t._value === e._value) || unhandledErrors.push(e);
}
function markErrorAsHandled(e) {
    for (var t = unhandledErrors.length; t;)
        if (unhandledErrors[--t]._value === e._value)
            return void unhandledErrors.splice(t, 1);
}
function PromiseReject(e) {
    return new DexiePromise(INTERNAL, !1, e);
}
function wrap(e, t) {
    var n = PSD;
    return function () {
        var r = beginMicroTickScope(),
            i = PSD;
        try {
            return switchToZone(n, !0), e.apply(this, arguments);
        } catch (e) {
            t && t(e);
        } finally {
            switchToZone(i, !1), r && endMicroTickScope();
        }
    };
}
props(DexiePromise.prototype, {
    then: thenProp,
    _then: function (e, t) {
        propagateToListener(this, new Listener(null, null, e, t, PSD));
    },
    catch: function (e) {
        if (1 === arguments.length) return this.then(null, e);
        var t = arguments[0],
            n = arguments[1];
        return "function" == typeof t
            ? this.then(null, (e) => (e instanceof t ? n(e) : PromiseReject(e)))
            : this.then(null, (e) => (e && e.name === t ? n(e) : PromiseReject(e)));
    },
    finally: function (e) {
        return this.then(
            (t) => (e(), t),
            (t) => (e(), PromiseReject(t))
        );
    },
    stack: {
        get: function () {
            if (this._stack) return this._stack;
            try {
                stack_being_generated = !0;
                var e = getStack(this, [], 20).join("\nFrom previous: ");
                return null !== this._state && (this._stack = e), e;
            } finally {
                stack_being_generated = !1;
            }
        },
    },
    timeout: function (e, t) {
        return e < 1 / 0
            ? new DexiePromise((n, r) => {
                var i = setTimeout(() => r(new exceptions.Timeout(t)), e);
                this.then(n, r).finally(clearTimeout.bind(null, i));
            })
            : this;
    },
}),
    "undefined" != typeof Symbol &&
    Symbol.toStringTag &&
    setProp(DexiePromise.prototype, Symbol.toStringTag, "Dexie.Promise"),
    (globalPSD.env = snapShot()),
    props(DexiePromise, {
        all: function () {
            var e = getArrayOf.apply(null, arguments).map(onPossibleParallellAsync);
            return new DexiePromise(function (t, n) {
                0 === e.length && t([]);
                var r = e.length;
                e.forEach((i, a) =>
                    DexiePromise.resolve(i).then((n) => {
                        (e[a] = n), --r || t(e);
                    }, n)
                );
            });
        },
        resolve: (e) => {
            if (e instanceof DexiePromise) return e;
            if (e && "function" == typeof e.then)
                return new DexiePromise((t, n) => {
                    e.then(t, n);
                });
            var t = new DexiePromise(INTERNAL, !0, e);
            return linkToPreviousPromise(t, currentFulfiller), t;
        },
        reject: PromiseReject,
        race: function () {
            var e = getArrayOf.apply(null, arguments).map(onPossibleParallellAsync);
            return new DexiePromise((t, n) => {
                e.map((e) => DexiePromise.resolve(e).then(t, n));
            });
        },
        PSD: { get: () => PSD, set: (e) => (PSD = e) },
        totalEchoes: { get: () => totalEchoes },
        newPSD: newScope,
        usePSD: usePSD,
        scheduler: {
            get: () => asap,
            set: (e) => {
                asap = e;
            },
        },
        rejectionMapper: {
            get: () => rejectionMapper,
            set: (e) => {
                rejectionMapper = e;
            },
        },
        follow: (e, t) =>
            new DexiePromise((n, r) =>
                newScope(
                    (t, n) => {
                        var r = PSD;
                        (r.unhandleds = []),
                            (r.onunhandled = n),
                            (r.finalize = callBoth(function () {
                                run_at_end_of_this_or_next_physical_tick(() => {
                                    0 === this.unhandleds.length ? t() : n(this.unhandleds[0]);
                                });
                            }, r.finalize)),
                            e();
                    },
                    t,
                    n,
                    r
                )
            ),
    }),
    NativePromise &&
    (NativePromise.allSettled &&
        setProp(DexiePromise, "allSettled", function () {
            const e = getArrayOf
                .apply(null, arguments)
                .map(onPossibleParallellAsync);
            return new DexiePromise((t) => {
                0 === e.length && t([]);
                let n = e.length;
                const r = new Array(n);
                e.forEach((e, i) =>
                    DexiePromise.resolve(e)
                        .then(
                            (e) => (r[i] = { status: "fulfilled", value: e }),
                            (e) => (r[i] = { status: "rejected", reason: e })
                        )
                        .then(() => --n || t(r))
                );
            });
        }),
        NativePromise.any &&
        "undefined" != typeof AggregateError &&
        setProp(DexiePromise, "any", function () {
            const e = getArrayOf
                .apply(null, arguments)
                .map(onPossibleParallellAsync);
            return new DexiePromise((t, n) => {
                0 === e.length && n(new AggregateError([]));
                let r = e.length;
                const i = new Array(r);
                e.forEach((e, a) =>
                    DexiePromise.resolve(e).then(
                        (e) => t(e),
                        (e) => {
                            (i[a] = e), --r || n(new AggregateError(i));
                        }
                    )
                );
            });
        }));
const task = { awaits: 0, echoes: 0, id: 0 };
var taskCounter = 0,
    zoneStack = [],
    zoneEchoes = 0,
    totalEchoes = 0,
    zone_id_counter = 0;
function newScope(e, t, n, r) {
    var i = PSD,
        a = Object.create(i);
    (a.parent = i), (a.ref = 0), (a.global = !1), (a.id = ++zone_id_counter);
    var o = globalPSD.env;
    (a.env = patchGlobalPromise
        ? {
            Promise: DexiePromise,
            PromiseProp: { value: DexiePromise, configurable: !0, writable: !0 },
            all: DexiePromise.all,
            race: DexiePromise.race,
            allSettled: DexiePromise.allSettled,
            any: DexiePromise.any,
            resolve: DexiePromise.resolve,
            reject: DexiePromise.reject,
            nthen: getPatchedPromiseThen(o.nthen, a),
            gthen: getPatchedPromiseThen(o.gthen, a),
        }
        : {}),
        t && extend(a, t),
        ++i.ref,
        (a.finalize = function () {
            --this.parent.ref || this.parent.finalize();
        });
    var s = usePSD(a, e, n, r);
    return 0 === a.ref && a.finalize(), s;
}
function incrementExpectedAwaits() {
    return (
        task.id || (task.id = ++taskCounter),
        ++task.awaits,
        (task.echoes += ZONE_ECHO_LIMIT),
        task.id
    );
}
function decrementExpectedAwaits() {
    return (
        !!task.awaits &&
        (0 == --task.awaits && (task.id = 0),
            (task.echoes = task.awaits * ZONE_ECHO_LIMIT),
            !0)
    );
}
function onPossibleParallellAsync(e) {
    return task.echoes && e && e.constructor === NativePromise
        ? (incrementExpectedAwaits(),
            e.then(
                (e) => (decrementExpectedAwaits(), e),
                (e) => (decrementExpectedAwaits(), rejection(e))
            ))
        : e;
}
function zoneEnterEcho(e) {
    ++totalEchoes,
        (task.echoes && 0 != --task.echoes) || (task.echoes = task.id = 0),
        zoneStack.push(PSD),
        switchToZone(e, !0);
}
function zoneLeaveEcho() {
    var e = zoneStack[zoneStack.length - 1];
    zoneStack.pop(), switchToZone(e, !1);
}
function switchToZone(e, t) {
    var n = PSD;
    if (
        ((t
            ? !task.echoes || (zoneEchoes++ && e === PSD)
            : !zoneEchoes || (--zoneEchoes && e === PSD)) ||
            enqueueNativeMicroTask(t ? zoneEnterEcho.bind(null, e) : zoneLeaveEcho),
            e !== PSD &&
            ((PSD = e),
                n === globalPSD && (globalPSD.env = snapShot()),
                patchGlobalPromise))
    ) {
        var r = globalPSD.env.Promise,
            i = e.env;
        (nativePromiseProto.then = i.nthen),
            (r.prototype.then = i.gthen),
            (n.global || e.global) &&
            (Object.defineProperty(_global, "Promise", i.PromiseProp),
                (r.all = i.all),
                (r.race = i.race),
                (r.resolve = i.resolve),
                (r.reject = i.reject),
                i.allSettled && (r.allSettled = i.allSettled),
                i.any && (r.any = i.any));
    }
}
function snapShot() {
    var e = _global.Promise;
    return patchGlobalPromise
        ? {
            Promise: e,
            PromiseProp: Object.getOwnPropertyDescriptor(_global, "Promise"),
            all: e.all,
            race: e.race,
            allSettled: e.allSettled,
            any: e.any,
            resolve: e.resolve,
            reject: e.reject,
            nthen: nativePromiseProto.then,
            gthen: e.prototype.then,
        }
        : {};
}
function usePSD(e, t, n, r, i) {
    var a = PSD;
    try {
        return switchToZone(e, !0), t(n, r, i);
    } finally {
        switchToZone(a, !1);
    }
}
function enqueueNativeMicroTask(e) {
    nativePromiseThen.call(resolvedNativePromise, e);
}
function nativeAwaitCompatibleWrap(e, t, n, r) {
    return "function" != typeof e
        ? e
        : function () {
            var i = PSD;
            n && incrementExpectedAwaits(), switchToZone(t, !0);
            try {
                return e.apply(this, arguments);
            } finally {
                switchToZone(i, !1),
                    r && enqueueNativeMicroTask(decrementExpectedAwaits);
            }
        };
}
function getPatchedPromiseThen(e, t) {
    return function (n, r) {
        return e.call(
            this,
            nativeAwaitCompatibleWrap(n, t),
            nativeAwaitCompatibleWrap(r, t)
        );
    };
}
-1 === ("" + nativePromiseThen).indexOf("[native code]") &&
    (incrementExpectedAwaits = decrementExpectedAwaits = nop);
const UNHANDLEDREJECTION = "unhandledrejection";
function globalError(e, t) {
    var n;
    try {
        n = t.onuncatched(e);
    } catch (e) { }
    if (!1 !== n)
        try {
            var r,
                i = { promise: t, reason: e };
            if (
                (_global.document && document.createEvent
                    ? ((r = document.createEvent("Event")).initEvent(
                        UNHANDLEDREJECTION,
                        !0,
                        !0
                    ),
                        extend(r, i))
                    : _global.CustomEvent &&
                    extend((r = new CustomEvent(UNHANDLEDREJECTION, { detail: i })), i),
                    r &&
                    _global.dispatchEvent &&
                    (dispatchEvent(r),
                        !_global.PromiseRejectionEvent && _global.onunhandledrejection))
            )
                try {
                    _global.onunhandledrejection(r);
                } catch (e) { }
            debug &&
                r &&
                !r.defaultPrevented &&
                console.warn(`Unhandled rejection: ${e.stack || e}`);
        } catch (e) { }
}
var rejection = DexiePromise.reject;
function tempTransaction(e, t, n, r) {
    if (e.idbdb && (e._state.openComplete || PSD.letThrough || e._vip)) {
        var i = e._createTransaction(t, n, e._dbSchema);
        try {
            i.create(), (e._state.PR1398_maxLoop = 3);
        } catch (i) {
            return i.name === errnames.InvalidState &&
                e.isOpen() &&
                --e._state.PR1398_maxLoop > 0
                ? (console.warn("Dexie: Need to reopen db"),
                    e._close(),
                    e.open().then(() => tempTransaction(e, t, n, r)))
                : rejection(i);
        }
        return i
            ._promise(t, (e, t) => newScope(() => ((PSD.trans = i), r(e, t, i))))
            .then((e) => i._completion.then(() => e));
    }
    if (e._state.openComplete)
        return rejection(new exceptions.DatabaseClosed(e._state.dbOpenError));
    if (!e._state.isBeingOpened) {
        if (!e._options.autoOpen) return rejection(new exceptions.DatabaseClosed());
        e.open().catch(nop);
    }
    return e._state.dbReadyPromise.then(() => tempTransaction(e, t, n, r));
}
const DEXIE_VERSION = "3.2.5",
    maxString = String.fromCharCode(65535),
    minKey = -1 / 0,
    INVALID_KEY_ARGUMENT =
        "Invalid key provided. Keys must be of type string, number, Date or Array<string | number | Date>.",
    STRING_EXPECTED = "String expected.",
    connections = [],
    isIEOrEdge =
        "undefined" != typeof navigator &&
        /(MSIE|Trident|Edge)/.test(navigator.userAgent),
    hasIEDeleteObjectStoreBug = isIEOrEdge,
    hangsOnDeleteLargeKeyRange = isIEOrEdge,
    dexieStackFrameFilter = (e) => !/(dexie\.js|dexie\.min\.js)/.test(e),
    DBNAMES_DB = "__dbnames",
    READONLY = "readonly",
    READWRITE = "readwrite";
function combine(e, t) {
    return e
        ? t
            ? function () {
                return e.apply(this, arguments) && t.apply(this, arguments);
            }
            : e
        : t;
}
const AnyRange = {
    type: 3,
    lower: -1 / 0,
    lowerOpen: !1,
    upper: [[]],
    upperOpen: !1,
};
function workaroundForUndefinedPrimKey(e) {
    return "string" != typeof e || /\./.test(e)
        ? (e) => e
        : (t) => (void 0 === t[e] && e in t && delete (t = deepClone(t))[e], t);
}
class Table {
    _trans(e, t, n) {
        const r = this._tx || PSD.trans,
            i = this.name;
        function a(e, n, r) {
            if (!r.schema[i])
                throw new exceptions.NotFound(
                    "Table " + i + " not part of transaction"
                );
            return t(r.idbtrans, r);
        }
        const o = beginMicroTickScope();
        try {
            return r && r.db === this.db
                ? r === PSD.trans
                    ? r._promise(e, a, n)
                    : newScope(() => r._promise(e, a, n), {
                        trans: r,
                        transless: PSD.transless || PSD,
                    })
                : tempTransaction(this.db, e, [this.name], a);
        } finally {
            o && endMicroTickScope();
        }
    }
    get(e, t) {
        return e && e.constructor === Object
            ? this.where(e).first(t)
            : this._trans("readonly", (t) =>
                this.core
                    .get({ trans: t, key: e })
                    .then((e) => this.hook.reading.fire(e))
            ).then(t);
    }
    where(e) {
        if ("string" == typeof e) return new this.db.WhereClause(this, e);
        if (isArray(e)) return new this.db.WhereClause(this, `[${e.join("+")}]`);
        const t = keys(e);
        if (1 === t.length) return this.where(t[0]).equals(e[t[0]]);
        const n = this.schema.indexes
            .concat(this.schema.primKey)
            .filter((e) => {
                if (e.compound && t.every((t) => e.keyPath.indexOf(t) >= 0)) {
                    for (let n = 0; n < t.length; ++n)
                        if (-1 === t.indexOf(e.keyPath[n])) return !1;
                    return !0;
                }
                return !1;
            })
            .sort((e, t) => e.keyPath.length - t.keyPath.length)[0];
        if (n && this.db._maxKey !== maxString) {
            const r = n.keyPath.slice(0, t.length);
            return this.where(r).equals(r.map((t) => e[t]));
        }
        !n &&
            debug &&
            console.warn(
                `The query ${JSON.stringify(e)} on ${this.name
                } would benefit of a compound index [${t.join("+")}]`
            );
        const { idxByName: r } = this.schema,
            i = this.db._deps.indexedDB;
        function a(e, t) {
            try {
                return 0 === i.cmp(e, t);
            } catch (e) {
                return !1;
            }
        }
        const [o, s] = t.reduce(
            ([t, n], i) => {
                const o = r[i],
                    s = e[i];
                return [
                    t || o,
                    t || !o
                        ? combine(
                            n,
                            o && o.multi
                                ? (e) => {
                                    const t = getByKeyPath(e, i);
                                    return isArray(t) && t.some((e) => a(s, e));
                                }
                                : (e) => a(s, getByKeyPath(e, i))
                        )
                        : n,
                ];
            },
            [null, null]
        );
        return o
            ? this.where(o.name).equals(e[o.keyPath]).filter(s)
            : n
                ? this.filter(s)
                : this.where(t).equals("");
    }
    filter(e) {
        return this.toCollection().and(e);
    }
    count(e) {
        return this.toCollection().count(e);
    }
    offset(e) {
        return this.toCollection().offset(e);
    }
    limit(e) {
        return this.toCollection().limit(e);
    }
    each(e) {
        return this.toCollection().each(e);
    }
    toArray(e) {
        return this.toCollection().toArray(e);
    }
    toCollection() {
        return new this.db.Collection(new this.db.WhereClause(this));
    }
    orderBy(e) {
        return new this.db.Collection(
            new this.db.WhereClause(this, isArray(e) ? `[${e.join("+")}]` : e)
        );
    }
    reverse() {
        return this.toCollection().reverse();
    }
    mapToClass(e) {
        this.schema.mappedClass = e;
        const t = (t) => {
            if (!t) return t;
            const n = Object.create(e.prototype);
            for (var r in t)
                if (hasOwn(t, r))
                    try {
                        n[r] = t[r];
                    } catch (e) { }
            return n;
        };
        return (
            this.schema.readHook &&
            this.hook.reading.unsubscribe(this.schema.readHook),
            (this.schema.readHook = t),
            this.hook("reading", t),
            e
        );
    }
    defineClass() {
        return this.mapToClass(function (e) {
            extend(this, e);
        });
    }
    add(e, t) {
        const { auto: n, keyPath: r } = this.schema.primKey;
        let i = e;
        return (
            r && n && (i = workaroundForUndefinedPrimKey(r)(e)),
            this._trans("readwrite", (e) =>
                this.core.mutate({
                    trans: e,
                    type: "add",
                    keys: null != t ? [t] : null,
                    values: [i],
                })
            )
                .then((e) =>
                    e.numFailures ? DexiePromise.reject(e.failures[0]) : e.lastResult
                )
                .then((t) => {
                    if (r)
                        try {
                            setByKeyPath(e, r, t);
                        } catch (e) { }
                    return t;
                })
        );
    }
    update(e, t) {
        if ("object" != typeof e || isArray(e))
            return this.where(":id").equals(e).modify(t);
        {
            const n = getByKeyPath(e, this.schema.primKey.keyPath);
            if (void 0 === n)
                return rejection(
                    new exceptions.InvalidArgument(
                        "Given object does not contain its primary key"
                    )
                );
            try {
                "function" != typeof t
                    ? keys(t).forEach((n) => {
                        setByKeyPath(e, n, t[n]);
                    })
                    : t(e, { value: e, primKey: n });
            } catch (e) { }
            return this.where(":id").equals(n).modify(t);
        }
    }
    put(e, t) {
        const { auto: n, keyPath: r } = this.schema.primKey;
        let i = e;
        return (
            r && n && (i = workaroundForUndefinedPrimKey(r)(e)),
            this._trans("readwrite", (e) =>
                this.core.mutate({
                    trans: e,
                    type: "put",
                    values: [i],
                    keys: null != t ? [t] : null,
                })
            )
                .then((e) =>
                    e.numFailures ? DexiePromise.reject(e.failures[0]) : e.lastResult
                )
                .then((t) => {
                    if (r)
                        try {
                            setByKeyPath(e, r, t);
                        } catch (e) { }
                    return t;
                })
        );
    }
    delete(e) {
        return this._trans("readwrite", (t) =>
            this.core.mutate({ trans: t, type: "delete", keys: [e] })
        ).then((e) =>
            e.numFailures ? DexiePromise.reject(e.failures[0]) : void 0
        );
    }
    clear() {
        return this._trans("readwrite", (e) =>
            this.core.mutate({ trans: e, type: "deleteRange", range: AnyRange })
        ).then((e) =>
            e.numFailures ? DexiePromise.reject(e.failures[0]) : void 0
        );
    }
    bulkGet(e) {
        return this._trans("readonly", (t) =>
            this.core
                .getMany({ keys: e, trans: t })
                .then((e) => e.map((e) => this.hook.reading.fire(e)))
        );
    }
    bulkAdd(e, t, n) {
        const r = Array.isArray(t) ? t : void 0,
            i = (n = n || (r ? void 0 : t)) ? n.allKeys : void 0;
        return this._trans("readwrite", (t) => {
            const { auto: n, keyPath: a } = this.schema.primKey;
            if (a && r)
                throw new exceptions.InvalidArgument(
                    "bulkAdd(): keys argument invalid on tables with inbound keys"
                );
            if (r && r.length !== e.length)
                throw new exceptions.InvalidArgument(
                    "Arguments objects and keys must have the same length"
                );
            const o = e.length;
            let s = a && n ? e.map(workaroundForUndefinedPrimKey(a)) : e;
            return this.core
                .mutate({ trans: t, type: "add", keys: r, values: s, wantResults: i })
                .then(({ numFailures: e, results: t, lastResult: n, failures: r }) => {
                    if (0 === e) return i ? t : n;
                    throw new BulkError(
                        `${this.name}.bulkAdd(): ${e} of ${o} operations failed`,
                        r
                    );
                });
        });
    }
    bulkPut(e, t, n) {
        const r = Array.isArray(t) ? t : void 0,
            i = (n = n || (r ? void 0 : t)) ? n.allKeys : void 0;
        return this._trans("readwrite", (t) => {
            const { auto: n, keyPath: a } = this.schema.primKey;
            if (a && r)
                throw new exceptions.InvalidArgument(
                    "bulkPut(): keys argument invalid on tables with inbound keys"
                );
            if (r && r.length !== e.length)
                throw new exceptions.InvalidArgument(
                    "Arguments objects and keys must have the same length"
                );
            const o = e.length;
            let s = a && n ? e.map(workaroundForUndefinedPrimKey(a)) : e;
            return this.core
                .mutate({ trans: t, type: "put", keys: r, values: s, wantResults: i })
                .then(({ numFailures: e, results: t, lastResult: n, failures: r }) => {
                    if (0 === e) return i ? t : n;
                    throw new BulkError(
                        `${this.name}.bulkPut(): ${e} of ${o} operations failed`,
                        r
                    );
                });
        });
    }
    bulkDelete(e) {
        const t = e.length;
        return this._trans("readwrite", (t) =>
            this.core.mutate({ trans: t, type: "delete", keys: e })
        ).then(({ numFailures: e, lastResult: n, failures: r }) => {
            if (0 === e) return n;
            throw new BulkError(
                `${this.name}.bulkDelete(): ${e} of ${t} operations failed`,
                r
            );
        });
    }
}
function Events(e) {
    var t = {},
        n = function (n, r) {
            if (r) {
                for (var i = arguments.length, a = new Array(i - 1); --i;)
                    a[i - 1] = arguments[i];
                return t[n].subscribe.apply(null, a), e;
            }
            if ("string" == typeof n) return t[n];
        };
    n.addEventType = a;
    for (var r = 1, i = arguments.length; r < i; ++r) a(arguments[r]);
    return n;
    function a(e, r, i) {
        if ("object" != typeof e) {
            var o;
            r || (r = reverseStoppableEventChain), i || (i = nop);
            var s = {
                subscribers: [],
                fire: i,
                subscribe: function (e) {
                    -1 === s.subscribers.indexOf(e) &&
                        (s.subscribers.push(e), (s.fire = r(s.fire, e)));
                },
                unsubscribe: function (e) {
                    (s.subscribers = s.subscribers.filter(function (t) {
                        return t !== e;
                    })),
                        (s.fire = s.subscribers.reduce(r, i));
                },
            };
            return (t[e] = n[e] = s), s;
        }
        keys((o = e)).forEach(function (e) {
            var t = o[e];
            if (isArray(t)) a(e, o[e][0], o[e][1]);
            else {
                if ("asap" !== t)
                    throw new exceptions.InvalidArgument("Invalid event config");
                var n = a(e, mirror, function () {
                    for (var e = arguments.length, t = new Array(e); e--;)
                        t[e] = arguments[e];
                    n.subscribers.forEach(function (e) {
                        asap$1(function () {
                            e.apply(null, t);
                        });
                    });
                });
            }
        });
    }
}
function makeClassConstructor(e, t) {
    return derive(t).from({ prototype: e }), t;
}
function createTableConstructor(e) {
    return makeClassConstructor(Table.prototype, function (t, n, r) {
        (this.db = e),
            (this._tx = r),
            (this.name = t),
            (this.schema = n),
            (this.hook = e._allTables[t]
                ? e._allTables[t].hook
                : Events(null, {
                    creating: [hookCreatingChain, nop],
                    reading: [pureFunctionChain, mirror],
                    updating: [hookUpdatingChain, nop],
                    deleting: [hookDeletingChain, nop],
                }));
    });
}
function isPlainKeyRange(e, t) {
    return (
        !(e.filter || e.algorithm || e.or) && (t ? e.justLimit : !e.replayFilter)
    );
}
function addFilter(e, t) {
    e.filter = combine(e.filter, t);
}
function addReplayFilter(e, t, n) {
    var r = e.replayFilter;
    (e.replayFilter = r ? () => combine(r(), t()) : t), (e.justLimit = n && !r);
}
function addMatchFilter(e, t) {
    e.isMatch = combine(e.isMatch, t);
}
function getIndexOrStore(e, t) {
    if (e.isPrimKey) return t.primaryKey;
    const n = t.getIndexByKeyPath(e.index);
    if (!n)
        throw new exceptions.Schema(
            "KeyPath " + e.index + " on object store " + t.name + " is not indexed"
        );
    return n;
}
function openCursor(e, t, n) {
    const r = getIndexOrStore(e, t.schema);
    return t.openCursor({
        trans: n,
        values: !e.keysOnly,
        reverse: "prev" === e.dir,
        unique: !!e.unique,
        query: { index: r, range: e.range },
    });
}
function iter(e, t, n, r) {
    const i = e.replayFilter ? combine(e.filter, e.replayFilter()) : e.filter;
    if (e.or) {
        const a = {},
            o = (e, n, r) => {
                if (
                    !i ||
                    i(
                        n,
                        r,
                        (e) => n.stop(e),
                        (e) => n.fail(e)
                    )
                ) {
                    var o = n.primaryKey,
                        s = "" + o;
                    "[object ArrayBuffer]" === s && (s = "" + new Uint8Array(o)),
                        hasOwn(a, s) || ((a[s] = !0), t(e, n, r));
                }
            };
        return Promise.all([
            e.or._iterate(o, n),
            iterate(
                openCursor(e, r, n),
                e.algorithm,
                o,
                !e.keysOnly && e.valueMapper
            ),
        ]);
    }
    return iterate(
        openCursor(e, r, n),
        combine(e.algorithm, i),
        t,
        !e.keysOnly && e.valueMapper
    );
}
function iterate(e, t, n, r) {
    var i = wrap(r ? (e, t, i) => n(r(e), t, i) : n);
    return e.then((e) => {
        if (e)
            return e.start(() => {
                var n = () => e.continue();
                (t &&
                    !t(
                        e,
                        (e) => (n = e),
                        (t) => {
                            e.stop(t), (n = nop);
                        },
                        (t) => {
                            e.fail(t), (n = nop);
                        }
                    )) ||
                    i(e.value, e, (e) => (n = e)),
                    n();
            });
    });
}
function cmp(e, t) {
    try {
        const n = type(e),
            r = type(t);
        if (n !== r)
            return "Array" === n
                ? 1
                : "Array" === r
                    ? -1
                    : "binary" === n
                        ? 1
                        : "binary" === r
                            ? -1
                            : "string" === n
                                ? 1
                                : "string" === r
                                    ? -1
                                    : "Date" === n
                                        ? 1
                                        : "Date" !== r
                                            ? NaN
                                            : -1;
        switch (n) {
            case "number":
            case "Date":
            case "string":
                return e > t ? 1 : e < t ? -1 : 0;
            case "binary":
                return compareUint8Arrays(getUint8Array(e), getUint8Array(t));
            case "Array":
                return compareArrays(e, t);
        }
    } catch (e) { }
    return NaN;
}
function compareArrays(e, t) {
    const n = e.length,
        r = t.length,
        i = n < r ? n : r;
    for (let n = 0; n < i; ++n) {
        const r = cmp(e[n], t[n]);
        if (0 !== r) return r;
    }
    return n === r ? 0 : n < r ? -1 : 1;
}
function compareUint8Arrays(e, t) {
    const n = e.length,
        r = t.length,
        i = n < r ? n : r;
    for (let n = 0; n < i; ++n) if (e[n] !== t[n]) return e[n] < t[n] ? -1 : 1;
    return n === r ? 0 : n < r ? -1 : 1;
}
function type(e) {
    const t = typeof e;
    if ("object" !== t) return t;
    if (ArrayBuffer.isView(e)) return "binary";
    const n = toStringTag(e);
    return "ArrayBuffer" === n ? "binary" : n;
}
function getUint8Array(e) {
    return e instanceof Uint8Array
        ? e
        : ArrayBuffer.isView(e)
            ? new Uint8Array(e.buffer, e.byteOffset, e.byteLength)
            : new Uint8Array(e);
}
class Collection {
    _read(e, t) {
        var n = this._ctx;
        return n.error
            ? n.table._trans(null, rejection.bind(null, n.error))
            : n.table._trans("readonly", e).then(t);
    }
    _write(e) {
        var t = this._ctx;
        return t.error
            ? t.table._trans(null, rejection.bind(null, t.error))
            : t.table._trans("readwrite", e, "locked");
    }
    _addAlgorithm(e) {
        var t = this._ctx;
        t.algorithm = combine(t.algorithm, e);
    }
    _iterate(e, t) {
        return iter(this._ctx, e, t, this._ctx.table.core);
    }
    clone(e) {
        var t = Object.create(this.constructor.prototype),
            n = Object.create(this._ctx);
        return e && extend(n, e), (t._ctx = n), t;
    }
    raw() {
        return (this._ctx.valueMapper = null), this;
    }
    each(e) {
        var t = this._ctx;
        return this._read((n) => iter(t, e, n, t.table.core));
    }
    count(e) {
        return this._read((e) => {
            const t = this._ctx,
                n = t.table.core;
            if (isPlainKeyRange(t, !0))
                return n
                    .count({
                        trans: e,
                        query: { index: getIndexOrStore(t, n.schema), range: t.range },
                    })
                    .then((e) => Math.min(e, t.limit));
            var r = 0;
            return iter(t, () => (++r, !1), e, n).then(() => r);
        }).then(e);
    }
    sortBy(e, t) {
        const n = e.split(".").reverse(),
            r = n[0],
            i = n.length - 1;
        function a(e, t) {
            return t ? a(e[n[t]], t - 1) : e[r];
        }
        var o = "next" === this._ctx.dir ? 1 : -1;
        function s(e, t) {
            var n = a(e, i),
                r = a(t, i);
            return n < r ? -o : n > r ? o : 0;
        }
        return this.toArray(function (e) {
            return e.sort(s);
        }).then(t);
    }
    toArray(e) {
        return this._read((e) => {
            var t = this._ctx;
            if ("next" === t.dir && isPlainKeyRange(t, !0) && t.limit > 0) {
                const { valueMapper: n } = t,
                    r = getIndexOrStore(t, t.table.core.schema);
                return t.table.core
                    .query({
                        trans: e,
                        limit: t.limit,
                        values: !0,
                        query: { index: r, range: t.range },
                    })
                    .then(({ result: e }) => (n ? e.map(n) : e));
            }
            {
                const n = [];
                return iter(t, (e) => n.push(e), e, t.table.core).then(() => n);
            }
        }, e);
    }
    offset(e) {
        var t = this._ctx;
        return (
            e <= 0 ||
            ((t.offset += e),
                isPlainKeyRange(t)
                    ? addReplayFilter(t, () => {
                        var t = e;
                        return (e, n) =>
                            0 === t ||
                            (1 === t
                                ? (--t, !1)
                                : (n(() => {
                                    e.advance(t), (t = 0);
                                }),
                                    !1));
                    })
                    : addReplayFilter(t, () => {
                        var t = e;
                        return () => --t < 0;
                    })),
            this
        );
    }
    limit(e) {
        return (
            (this._ctx.limit = Math.min(this._ctx.limit, e)),
            addReplayFilter(
                this._ctx,
                () => {
                    var t = e;
                    return function (e, n, r) {
                        return --t <= 0 && n(r), t >= 0;
                    };
                },
                !0
            ),
            this
        );
    }
    until(e, t) {
        return (
            addFilter(this._ctx, function (n, r, i) {
                return !e(n.value) || (r(i), t);
            }),
            this
        );
    }
    first(e) {
        return this.limit(1)
            .toArray(function (e) {
                return e[0];
            })
            .then(e);
    }
    last(e) {
        return this.reverse().first(e);
    }
    filter(e) {
        return (
            addFilter(this._ctx, function (t) {
                return e(t.value);
            }),
            addMatchFilter(this._ctx, e),
            this
        );
    }
    and(e) {
        return this.filter(e);
    }
    or(e) {
        return new this.db.WhereClause(this._ctx.table, e, this);
    }
    reverse() {
        return (
            (this._ctx.dir = "prev" === this._ctx.dir ? "next" : "prev"),
            this._ondirectionchange && this._ondirectionchange(this._ctx.dir),
            this
        );
    }
    desc() {
        return this.reverse();
    }
    eachKey(e) {
        var t = this._ctx;
        return (
            (t.keysOnly = !t.isMatch),
            this.each(function (t, n) {
                e(n.key, n);
            })
        );
    }
    eachUniqueKey(e) {
        return (this._ctx.unique = "unique"), this.eachKey(e);
    }
    eachPrimaryKey(e) {
        var t = this._ctx;
        return (
            (t.keysOnly = !t.isMatch),
            this.each(function (t, n) {
                e(n.primaryKey, n);
            })
        );
    }
    keys(e) {
        var t = this._ctx;
        t.keysOnly = !t.isMatch;
        var n = [];
        return this.each(function (e, t) {
            n.push(t.key);
        })
            .then(function () {
                return n;
            })
            .then(e);
    }
    primaryKeys(e) {
        var t = this._ctx;
        if ("next" === t.dir && isPlainKeyRange(t, !0) && t.limit > 0)
            return this._read((e) => {
                var n = getIndexOrStore(t, t.table.core.schema);
                return t.table.core.query({
                    trans: e,
                    values: !1,
                    limit: t.limit,
                    query: { index: n, range: t.range },
                });
            })
                .then(({ result: e }) => e)
                .then(e);
        t.keysOnly = !t.isMatch;
        var n = [];
        return this.each(function (e, t) {
            n.push(t.primaryKey);
        })
            .then(function () {
                return n;
            })
            .then(e);
    }
    uniqueKeys(e) {
        return (this._ctx.unique = "unique"), this.keys(e);
    }
    firstKey(e) {
        return this.limit(1)
            .keys(function (e) {
                return e[0];
            })
            .then(e);
    }
    lastKey(e) {
        return this.reverse().firstKey(e);
    }
    distinct() {
        var e = this._ctx,
            t = e.index && e.table.schema.idxByName[e.index];
        if (!t || !t.multi) return this;
        var n = {};
        return (
            addFilter(this._ctx, function (e) {
                var t = e.primaryKey.toString(),
                    r = hasOwn(n, t);
                return (n[t] = !0), !r;
            }),
            this
        );
    }
    modify(e) {
        var t = this._ctx;
        return this._write((n) => {
            var r;
            if ("function" == typeof e) r = e;
            else {
                var i = keys(e),
                    a = i.length;
                r = function (t) {
                    for (var n = !1, r = 0; r < a; ++r) {
                        var o = i[r],
                            s = e[o];
                        getByKeyPath(t, o) !== s && (setByKeyPath(t, o, s), (n = !0));
                    }
                    return n;
                };
            }
            const o = t.table.core,
                { outbound: s, extractKey: l } = o.schema.primaryKey,
                c = this.db._options.modifyChunkSize || 200,
                u = [];
            let h = 0;
            const d = [],
                p = (e, t) => {
                    const { failures: n, numFailures: r } = t;
                    h += e - r;
                    for (let e of keys(n)) u.push(n[e]);
                };
            return this.clone()
                .primaryKeys()
                .then((i) => {
                    const a = (u) => {
                        const h = Math.min(c, i.length - u);
                        return o
                            .getMany({
                                trans: n,
                                keys: i.slice(u, u + h),
                                cache: "immutable",
                            })
                            .then((d) => {
                                const f = [],
                                    y = [],
                                    m = s ? [] : null,
                                    g = [];
                                for (let e = 0; e < h; ++e) {
                                    const t = d[e],
                                        n = { value: deepClone(t), primKey: i[u + e] };
                                    !1 !== r.call(n, n.value, n) &&
                                        (null == n.value
                                            ? g.push(i[u + e])
                                            : s || 0 === cmp(l(t), l(n.value))
                                                ? (y.push(n.value), s && m.push(i[u + e]))
                                                : (g.push(i[u + e]), f.push(n.value)));
                                }
                                const b = isPlainKeyRange(t) &&
                                    t.limit === 1 / 0 &&
                                    ("function" != typeof e || e === deleteCallback) && {
                                    index: t.index,
                                    range: t.range,
                                };
                                return Promise.resolve(
                                    f.length > 0 &&
                                    o.mutate({ trans: n, type: "add", values: f }).then((e) => {
                                        for (let t in e.failures) g.splice(parseInt(t), 1);
                                        p(f.length, e);
                                    })
                                )
                                    .then(
                                        () =>
                                            (y.length > 0 || (b && "object" == typeof e)) &&
                                            o
                                                .mutate({
                                                    trans: n,
                                                    type: "put",
                                                    keys: m,
                                                    values: y,
                                                    criteria: b,
                                                    changeSpec: "function" != typeof e && e,
                                                })
                                                .then((e) => p(y.length, e))
                                    )
                                    .then(
                                        () =>
                                            (g.length > 0 || (b && e === deleteCallback)) &&
                                            o
                                                .mutate({
                                                    trans: n,
                                                    type: "delete",
                                                    keys: g,
                                                    criteria: b,
                                                })
                                                .then((e) => p(g.length, e))
                                    )
                                    .then(() => i.length > u + h && a(u + c));
                            });
                    };
                    return a(0).then(() => {
                        if (u.length > 0)
                            throw new ModifyError(
                                "Error modifying one or more objects",
                                u,
                                h,
                                d
                            );
                        return i.length;
                    });
                });
        });
    }
    delete() {
        var e = this._ctx,
            t = e.range;
        return isPlainKeyRange(e) &&
            ((e.isPrimKey && !hangsOnDeleteLargeKeyRange) || 3 === t.type)
            ? this._write((n) => {
                const { primaryKey: r } = e.table.core.schema,
                    i = t;
                return e.table.core
                    .count({ trans: n, query: { index: r, range: i } })
                    .then((t) =>
                        e.table.core
                            .mutate({ trans: n, type: "deleteRange", range: i })
                            .then(
                                ({
                                    failures: e,
                                    lastResult: n,
                                    results: r,
                                    numFailures: i,
                                }) => {
                                    if (i)
                                        throw new ModifyError(
                                            "Could not delete some values",
                                            Object.keys(e).map((t) => e[t]),
                                            t - i
                                        );
                                    return t - i;
                                }
                            )
                    );
            })
            : this.modify(deleteCallback);
    }
}
const deleteCallback = (e, t) => (t.value = null);
function createCollectionConstructor(e) {
    return makeClassConstructor(Collection.prototype, function (t, n) {
        this.db = e;
        let r = AnyRange,
            i = null;
        if (n)
            try {
                r = n();
            } catch (e) {
                i = e;
            }
        const a = t._ctx,
            o = a.table,
            s = o.hook.reading.fire;
        this._ctx = {
            table: o,
            index: a.index,
            isPrimKey:
                !a.index ||
                (o.schema.primKey.keyPath && a.index === o.schema.primKey.name),
            range: r,
            keysOnly: !1,
            dir: "next",
            unique: "",
            algorithm: null,
            filter: null,
            replayFilter: null,
            justLimit: !0,
            isMatch: null,
            offset: 0,
            limit: 1 / 0,
            error: i,
            or: a.or,
            valueMapper: s !== mirror ? s : null,
        };
    });
}
function simpleCompare(e, t) {
    return e < t ? -1 : e === t ? 0 : 1;
}
function simpleCompareReverse(e, t) {
    return e > t ? -1 : e === t ? 0 : 1;
}
function fail(e, t, n) {
    var r = e instanceof WhereClause ? new e.Collection(e) : e;
    return (r._ctx.error = n ? new n(t) : new TypeError(t)), r;
}
function emptyCollection(e) {
    return new e.Collection(e, () => rangeEqual("")).limit(0);
}
function upperFactory(e) {
    return "next" === e ? (e) => e.toUpperCase() : (e) => e.toLowerCase();
}
function lowerFactory(e) {
    return "next" === e ? (e) => e.toLowerCase() : (e) => e.toUpperCase();
}
function nextCasing(e, t, n, r, i, a) {
    for (var o = Math.min(e.length, r.length), s = -1, l = 0; l < o; ++l) {
        var c = t[l];
        if (c !== r[l])
            return i(e[l], n[l]) < 0
                ? e.substr(0, l) + n[l] + n.substr(l + 1)
                : i(e[l], r[l]) < 0
                    ? e.substr(0, l) + r[l] + n.substr(l + 1)
                    : s >= 0
                        ? e.substr(0, s) + t[s] + n.substr(s + 1)
                        : null;
        i(e[l], c) < 0 && (s = l);
    }
    return o < r.length && "next" === a
        ? e + n.substr(e.length)
        : o < e.length && "prev" === a
            ? e.substr(0, n.length)
            : s < 0
                ? null
                : e.substr(0, s) + r[s] + n.substr(s + 1);
}
function addIgnoreCaseAlgorithm(e, t, n, r) {
    var i,
        a,
        o,
        s,
        l,
        c,
        u,
        h = n.length;
    if (!n.every((e) => "string" == typeof e)) return fail(e, STRING_EXPECTED);
    function d(e) {
        (i = upperFactory(e)),
            (a = lowerFactory(e)),
            (o = "next" === e ? simpleCompare : simpleCompareReverse);
        var t = n
            .map(function (e) {
                return { lower: a(e), upper: i(e) };
            })
            .sort(function (e, t) {
                return o(e.lower, t.lower);
            });
        (s = t.map(function (e) {
            return e.upper;
        })),
            (l = t.map(function (e) {
                return e.lower;
            })),
            (c = e),
            (u = "next" === e ? "" : r);
    }
    d("next");
    var p = new e.Collection(e, () => createRange(s[0], l[h - 1] + r));
    p._ondirectionchange = function (e) {
        d(e);
    };
    var f = 0;
    return (
        p._addAlgorithm(function (e, n, r) {
            var i = e.key;
            if ("string" != typeof i) return !1;
            var d = a(i);
            if (t(d, l, f)) return !0;
            for (var p = null, y = f; y < h; ++y) {
                var m = nextCasing(i, d, s[y], l[y], o, c);
                null === m && null === p
                    ? (f = y + 1)
                    : (null === p || o(p, m) > 0) && (p = m);
            }
            return (
                n(
                    null !== p
                        ? function () {
                            e.continue(p + u);
                        }
                        : r
                ),
                !1
            );
        }),
        p
    );
}
function createRange(e, t, n, r) {
    return { type: 2, lower: e, upper: t, lowerOpen: n, upperOpen: r };
}
function rangeEqual(e) {
    return { type: 1, lower: e, upper: e };
}
class WhereClause {
    get Collection() {
        return this._ctx.table.db.Collection;
    }
    between(e, t, n, r) {
        (n = !1 !== n), (r = !0 === r);
        try {
            return this._cmp(e, t) > 0 ||
                (0 === this._cmp(e, t) && (n || r) && (!n || !r))
                ? emptyCollection(this)
                : new this.Collection(this, () => createRange(e, t, !n, !r));
        } catch (e) {
            return fail(this, INVALID_KEY_ARGUMENT);
        }
    }
    equals(e) {
        return null == e
            ? fail(this, INVALID_KEY_ARGUMENT)
            : new this.Collection(this, () => rangeEqual(e));
    }
    above(e) {
        return null == e
            ? fail(this, INVALID_KEY_ARGUMENT)
            : new this.Collection(this, () => createRange(e, void 0, !0));
    }
    aboveOrEqual(e) {
        return null == e
            ? fail(this, INVALID_KEY_ARGUMENT)
            : new this.Collection(this, () => createRange(e, void 0, !1));
    }
    below(e) {
        return null == e
            ? fail(this, INVALID_KEY_ARGUMENT)
            : new this.Collection(this, () => createRange(void 0, e, !1, !0));
    }
    belowOrEqual(e) {
        return null == e
            ? fail(this, INVALID_KEY_ARGUMENT)
            : new this.Collection(this, () => createRange(void 0, e));
    }
    startsWith(e) {
        return "string" != typeof e
            ? fail(this, STRING_EXPECTED)
            : this.between(e, e + maxString, !0, !0);
    }
    startsWithIgnoreCase(e) {
        return "" === e
            ? this.startsWith(e)
            : addIgnoreCaseAlgorithm(
                this,
                (e, t) => 0 === e.indexOf(t[0]),
                [e],
                maxString
            );
    }
    equalsIgnoreCase(e) {
        return addIgnoreCaseAlgorithm(this, (e, t) => e === t[0], [e], "");
    }
    anyOfIgnoreCase() {
        var e = getArrayOf.apply(NO_CHAR_ARRAY, arguments);
        return 0 === e.length
            ? emptyCollection(this)
            : addIgnoreCaseAlgorithm(this, (e, t) => -1 !== t.indexOf(e), e, "");
    }
    startsWithAnyOfIgnoreCase() {
        var e = getArrayOf.apply(NO_CHAR_ARRAY, arguments);
        return 0 === e.length
            ? emptyCollection(this)
            : addIgnoreCaseAlgorithm(
                this,
                (e, t) => t.some((t) => 0 === e.indexOf(t)),
                e,
                maxString
            );
    }
    anyOf() {
        const e = getArrayOf.apply(NO_CHAR_ARRAY, arguments);
        let t = this._cmp;
        try {
            e.sort(t);
        } catch (e) {
            return fail(this, INVALID_KEY_ARGUMENT);
        }
        if (0 === e.length) return emptyCollection(this);
        const n = new this.Collection(this, () =>
            createRange(e[0], e[e.length - 1])
        );
        n._ondirectionchange = (n) => {
            (t = "next" === n ? this._ascending : this._descending), e.sort(t);
        };
        let r = 0;
        return (
            n._addAlgorithm((n, i, a) => {
                const o = n.key;
                for (; t(o, e[r]) > 0;) if ((++r, r === e.length)) return i(a), !1;
                return (
                    0 === t(o, e[r]) ||
                    (i(() => {
                        n.continue(e[r]);
                    }),
                        !1)
                );
            }),
            n
        );
    }
    notEqual(e) {
        return this.inAnyRange(
            [
                [minKey, e],
                [e, this.db._maxKey],
            ],
            { includeLowers: !1, includeUppers: !1 }
        );
    }
    noneOf() {
        const e = getArrayOf.apply(NO_CHAR_ARRAY, arguments);
        if (0 === e.length) return new this.Collection(this);
        try {
            e.sort(this._ascending);
        } catch (e) {
            return fail(this, INVALID_KEY_ARGUMENT);
        }
        const t = e.reduce(
            (e, t) => (e ? e.concat([[e[e.length - 1][1], t]]) : [[minKey, t]]),
            null
        );
        return (
            t.push([e[e.length - 1], this.db._maxKey]),
            this.inAnyRange(t, { includeLowers: !1, includeUppers: !1 })
        );
    }
    inAnyRange(e, t) {
        const n = this._cmp,
            r = this._ascending,
            i = this._descending,
            a = this._min,
            o = this._max;
        if (0 === e.length) return emptyCollection(this);
        if (
            !e.every((e) => void 0 !== e[0] && void 0 !== e[1] && r(e[0], e[1]) <= 0)
        )
            return fail(
                this,
                "First argument to inAnyRange() must be an Array of two-value Arrays [lower,upper] where upper must not be lower than lower",
                exceptions.InvalidArgument
            );
        const s = !t || !1 !== t.includeLowers,
            l = t && !0 === t.includeUppers;
        let c,
            u = r;
        function h(e, t) {
            return u(e[0], t[0]);
        }
        try {
            (c = e.reduce(function (e, t) {
                let r = 0,
                    i = e.length;
                for (; r < i; ++r) {
                    const i = e[r];
                    if (n(t[0], i[1]) < 0 && n(t[1], i[0]) > 0) {
                        (i[0] = a(i[0], t[0])), (i[1] = o(i[1], t[1]));
                        break;
                    }
                }
                return r === i && e.push(t), e;
            }, [])),
                c.sort(h);
        } catch (e) {
            return fail(this, INVALID_KEY_ARGUMENT);
        }
        let d = 0;
        const p = l ? (e) => r(e, c[d][1]) > 0 : (e) => r(e, c[d][1]) >= 0,
            f = s ? (e) => i(e, c[d][0]) > 0 : (e) => i(e, c[d][0]) >= 0;
        let y = p;
        const m = new this.Collection(this, () =>
            createRange(c[0][0], c[c.length - 1][1], !s, !l)
        );
        return (
            (m._ondirectionchange = (e) => {
                "next" === e ? ((y = p), (u = r)) : ((y = f), (u = i)), c.sort(h);
            }),
            m._addAlgorithm((e, t, n) => {
                for (var i = e.key; y(i);) if ((++d, d === c.length)) return t(n), !1;
                return (
                    !!(function (e) {
                        return !p(e) && !f(e);
                    })(i) ||
                    (0 === this._cmp(i, c[d][1]) ||
                        0 === this._cmp(i, c[d][0]) ||
                        t(() => {
                            u === r ? e.continue(c[d][0]) : e.continue(c[d][1]);
                        }),
                        !1)
                );
            }),
            m
        );
    }
    startsWithAnyOf() {
        const e = getArrayOf.apply(NO_CHAR_ARRAY, arguments);
        return e.every((e) => "string" == typeof e)
            ? 0 === e.length
                ? emptyCollection(this)
                : this.inAnyRange(e.map((e) => [e, e + maxString]))
            : fail(this, "startsWithAnyOf() only works with strings");
    }
}
function createWhereClauseConstructor(e) {
    return makeClassConstructor(WhereClause.prototype, function (t, n, r) {
        (this.db = e),
            (this._ctx = { table: t, index: ":id" === n ? null : n, or: r });
        const i = e._deps.indexedDB;
        if (!i) throw new exceptions.MissingAPI();
        (this._cmp = this._ascending = i.cmp.bind(i)),
            (this._descending = (e, t) => i.cmp(t, e)),
            (this._max = (e, t) => (i.cmp(e, t) > 0 ? e : t)),
            (this._min = (e, t) => (i.cmp(e, t) < 0 ? e : t)),
            (this._IDBKeyRange = e._deps.IDBKeyRange);
    });
}
function eventRejectHandler(e) {
    return wrap(function (t) {
        return preventDefault(t), e(t.target.error), !1;
    });
}
function preventDefault(e) {
    e.stopPropagation && e.stopPropagation(),
        e.preventDefault && e.preventDefault();
}
const DEXIE_STORAGE_MUTATED_EVENT_NAME = "storagemutated",
    STORAGE_MUTATED_DOM_EVENT_NAME = "x-storagemutated-1",
    globalEvents = Events(null, "storagemutated");
class Transaction {
    _lock() {
        return (
            assert(!PSD.global),
            ++this._reculock,
            1 !== this._reculock || PSD.global || (PSD.lockOwnerFor = this),
            this
        );
    }
    _unlock() {
        if ((assert(!PSD.global), 0 == --this._reculock))
            for (
                PSD.global || (PSD.lockOwnerFor = null);
                this._blockedFuncs.length > 0 && !this._locked();

            ) {
                var e = this._blockedFuncs.shift();
                try {
                    usePSD(e[1], e[0]);
                } catch (e) { }
            }
        return this;
    }
    _locked() {
        return this._reculock && PSD.lockOwnerFor !== this;
    }
    create(e) {
        if (!this.mode) return this;
        const t = this.db.idbdb,
            n = this.db._state.dbOpenError;
        if ((assert(!this.idbtrans), !e && !t))
            switch (n && n.name) {
                case "DatabaseClosedError":
                    throw new exceptions.DatabaseClosed(n);
                case "MissingAPIError":
                    throw new exceptions.MissingAPI(n.message, n);
                default:
                    throw new exceptions.OpenFailed(n);
            }
        if (!this.active) throw new exceptions.TransactionInactive();
        return (
            assert(null === this._completion._state),
            ((e = this.idbtrans =
                e ||
                (this.db.core
                    ? this.db.core.transaction(this.storeNames, this.mode, {
                        durability: this.chromeTransactionDurability,
                    })
                    : t.transaction(this.storeNames, this.mode, {
                        durability: this.chromeTransactionDurability,
                    }))).onerror = wrap((t) => {
                        preventDefault(t), this._reject(e.error);
                    })),
            (e.onabort = wrap((t) => {
                preventDefault(t),
                    this.active && this._reject(new exceptions.Abort(e.error)),
                    (this.active = !1),
                    this.on("abort").fire(t);
            })),
            (e.oncomplete = wrap(() => {
                (this.active = !1),
                    this._resolve(),
                    "mutatedParts" in e &&
                    globalEvents.storagemutated.fire(e.mutatedParts);
            })),
            this
        );
    }
    _promise(e, t, n) {
        if ("readwrite" === e && "readwrite" !== this.mode)
            return rejection(new exceptions.ReadOnly("Transaction is readonly"));
        if (!this.active) return rejection(new exceptions.TransactionInactive());
        if (this._locked())
            return new DexiePromise((r, i) => {
                this._blockedFuncs.push([
                    () => {
                        this._promise(e, t, n).then(r, i);
                    },
                    PSD,
                ]);
            });
        if (n)
            return newScope(() => {
                var e = new DexiePromise((e, n) => {
                    this._lock();
                    const r = t(e, n, this);
                    r && r.then && r.then(e, n);
                });
                return e.finally(() => this._unlock()), (e._lib = !0), e;
            });
        var r = new DexiePromise((e, n) => {
            var r = t(e, n, this);
            r && r.then && r.then(e, n);
        });
        return (r._lib = !0), r;
    }
    _root() {
        return this.parent ? this.parent._root() : this;
    }
    waitFor(e) {
        var t = this._root();
        const n = DexiePromise.resolve(e);
        if (t._waitingFor) t._waitingFor = t._waitingFor.then(() => n);
        else {
            (t._waitingFor = n), (t._waitingQueue = []);
            var r = t.idbtrans.objectStore(t.storeNames[0]);
            !(function e() {
                for (++t._spinCount; t._waitingQueue.length;)
                    t._waitingQueue.shift()();
                t._waitingFor && (r.get(-1 / 0).onsuccess = e);
            })();
        }
        var i = t._waitingFor;
        return new DexiePromise((e, r) => {
            n.then(
                (n) => t._waitingQueue.push(wrap(e.bind(null, n))),
                (e) => t._waitingQueue.push(wrap(r.bind(null, e)))
            ).finally(() => {
                t._waitingFor === i && (t._waitingFor = null);
            });
        });
    }
    abort() {
        this.active &&
            ((this.active = !1),
                this.idbtrans && this.idbtrans.abort(),
                this._reject(new exceptions.Abort()));
    }
    table(e) {
        const t = this._memoizedTables || (this._memoizedTables = {});
        if (hasOwn(t, e)) return t[e];
        const n = this.schema[e];
        if (!n)
            throw new exceptions.NotFound("Table " + e + " not part of transaction");
        const r = new this.db.Table(e, n, this);
        return (r.core = this.db.core.table(e)), (t[e] = r), r;
    }
}
function createTransactionConstructor(e) {
    return makeClassConstructor(Transaction.prototype, function (t, n, r, i, a) {
        (this.db = e),
            (this.mode = t),
            (this.storeNames = n),
            (this.schema = r),
            (this.chromeTransactionDurability = i),
            (this.idbtrans = null),
            (this.on = Events(this, "complete", "error", "abort")),
            (this.parent = a || null),
            (this.active = !0),
            (this._reculock = 0),
            (this._blockedFuncs = []),
            (this._resolve = null),
            (this._reject = null),
            (this._waitingFor = null),
            (this._waitingQueue = null),
            (this._spinCount = 0),
            (this._completion = new DexiePromise((e, t) => {
                (this._resolve = e), (this._reject = t);
            })),
            this._completion.then(
                () => {
                    (this.active = !1), this.on.complete.fire();
                },
                (e) => {
                    var t = this.active;
                    return (
                        (this.active = !1),
                        this.on.error.fire(e),
                        this.parent
                            ? this.parent._reject(e)
                            : t && this.idbtrans && this.idbtrans.abort(),
                        rejection(e)
                    );
                }
            );
    });
}
function createIndexSpec(e, t, n, r, i, a, o) {
    return {
        name: e,
        keyPath: t,
        unique: n,
        multi: r,
        auto: i,
        compound: a,
        src:
            (n && !o ? "&" : "") +
            (r ? "*" : "") +
            (i ? "++" : "") +
            nameFromKeyPath(t),
    };
}
function nameFromKeyPath(e) {
    return "string" == typeof e ? e : e ? "[" + [].join.call(e, "+") + "]" : "";
}
function createTableSchema(e, t, n) {
    return {
        name: e,
        primKey: t,
        indexes: n,
        mappedClass: null,
        idxByName: arrayToObject(n, (e) => [e.name, e]),
    };
}
function safariMultiStoreFix(e) {
    return 1 === e.length ? e[0] : e;
}
let getMaxKey = (e) => {
    try {
        return e.only([[]]), (getMaxKey = () => [[]]), [[]];
    } catch (e) {
        return (getMaxKey = () => maxString), maxString;
    }
};
function getKeyExtractor(e) {
    return null == e
        ? () => { }
        : "string" == typeof e
            ? getSinglePathKeyExtractor(e)
            : (t) => getByKeyPath(t, e);
}
function getSinglePathKeyExtractor(e) {
    return 1 === e.split(".").length ? (t) => t[e] : (t) => getByKeyPath(t, e);
}
function arrayify(e) {
    return [].slice.call(e);
}
let _id_counter = 0;
function getKeyPathAlias(e) {
    return null == e ? ":id" : "string" == typeof e ? e : `[${e.join("+")}]`;
}
function createDBCore(e, t, n) {
    function r(e) {
        if (3 === e.type) return null;
        if (4 === e.type)
            throw new Error("Cannot convert never type to IDBKeyRange");
        const { lower: n, upper: r, lowerOpen: i, upperOpen: a } = e;
        return void 0 === n
            ? void 0 === r
                ? null
                : t.upperBound(r, !!a)
            : void 0 === r
                ? t.lowerBound(n, !!i)
                : t.bound(n, r, !!i, !!a);
    }
    const { schema: i, hasGetAll: a } = (function (e, t) {
        const n = arrayify(e.objectStoreNames);
        return {
            schema: {
                name: e.name,
                tables: n
                    .map((e) => t.objectStore(e))
                    .map((e) => {
                        const { keyPath: t, autoIncrement: n } = e,
                            r = isArray(t),
                            i = null == t,
                            a = {},
                            o = {
                                name: e.name,
                                primaryKey: {
                                    name: null,
                                    isPrimaryKey: !0,
                                    outbound: i,
                                    compound: r,
                                    keyPath: t,
                                    autoIncrement: n,
                                    unique: !0,
                                    extractKey: getKeyExtractor(t),
                                },
                                indexes: arrayify(e.indexNames)
                                    .map((t) => e.index(t))
                                    .map((e) => {
                                        const {
                                            name: t,
                                            unique: n,
                                            multiEntry: r,
                                            keyPath: i,
                                        } = e,
                                            o = {
                                                name: t,
                                                compound: isArray(i),
                                                keyPath: i,
                                                unique: n,
                                                multiEntry: r,
                                                extractKey: getKeyExtractor(i),
                                            };
                                        return (a[getKeyPathAlias(i)] = o), o;
                                    }),
                                getIndexByKeyPath: (e) => a[getKeyPathAlias(e)],
                            };
                        return (
                            (a[":id"] = o.primaryKey),
                            null != t && (a[getKeyPathAlias(t)] = o.primaryKey),
                            o
                        );
                    }),
            },
            hasGetAll:
                n.length > 0 &&
                "getAll" in t.objectStore(n[0]) &&
                !(
                    "undefined" != typeof navigator &&
                    /Safari/.test(navigator.userAgent) &&
                    !/(Chrome\/|Edge\/)/.test(navigator.userAgent) &&
                    [].concat(navigator.userAgent.match(/Safari\/(\d*)/))[1] < 604
                ),
        };
    })(e, n),
        o = i.tables.map((e) =>
            (function (e) {
                const t = e.name;
                return {
                    name: t,
                    schema: e,
                    mutate: function ({
                        trans: e,
                        type: n,
                        keys: i,
                        values: a,
                        range: o,
                    }) {
                        return new Promise((s, l) => {
                            s = wrap(s);
                            const c = e.objectStore(t),
                                u = null == c.keyPath,
                                h = "put" === n || "add" === n;
                            if (!h && "delete" !== n && "deleteRange" !== n)
                                throw new Error("Invalid operation type: " + n);
                            const { length: d } = i || a || { length: 1 };
                            if (i && a && i.length !== a.length)
                                throw new Error(
                                    "Given keys array must have same length as given values array."
                                );
                            if (0 === d)
                                return s({
                                    numFailures: 0,
                                    failures: {},
                                    results: [],
                                    lastResult: void 0,
                                });
                            let p;
                            const f = [],
                                y = [];
                            let m = 0;
                            const g = (e) => {
                                ++m, preventDefault(e);
                            };
                            if ("deleteRange" === n) {
                                if (4 === o.type)
                                    return s({
                                        numFailures: m,
                                        failures: y,
                                        results: [],
                                        lastResult: void 0,
                                    });
                                3 === o.type
                                    ? f.push((p = c.clear()))
                                    : f.push((p = c.delete(r(o))));
                            } else {
                                const [e, t] = h ? (u ? [a, i] : [a, null]) : [i, null];
                                if (h)
                                    for (let r = 0; r < d; ++r)
                                        f.push(
                                            (p = t && void 0 !== t[r] ? c[n](e[r], t[r]) : c[n](e[r]))
                                        ),
                                            (p.onerror = g);
                                else
                                    for (let t = 0; t < d; ++t)
                                        f.push((p = c[n](e[t]))), (p.onerror = g);
                            }
                            const b = (e) => {
                                const t = e.target.result;
                                f.forEach((e, t) => null != e.error && (y[t] = e.error)),
                                    s({
                                        numFailures: m,
                                        failures: y,
                                        results: "delete" === n ? i : f.map((e) => e.result),
                                        lastResult: t,
                                    });
                            };
                            (p.onerror = (e) => {
                                g(e), b(e);
                            }),
                                (p.onsuccess = b);
                        });
                    },
                    getMany: ({ trans: e, keys: n }) =>
                        new Promise((r, i) => {
                            r = wrap(r);
                            const a = e.objectStore(t),
                                o = n.length,
                                s = new Array(o);
                            let l,
                                c = 0,
                                u = 0;
                            const h = (e) => {
                                const t = e.target;
                                (s[t._pos] = t.result), ++u === c && r(s);
                            },
                                d = eventRejectHandler(i);
                            for (let e = 0; e < o; ++e)
                                null != n[e] &&
                                    ((l = a.get(n[e])),
                                        (l._pos = e),
                                        (l.onsuccess = h),
                                        (l.onerror = d),
                                        ++c);
                            0 === c && r(s);
                        }),
                    get: ({ trans: e, key: n }) =>
                        new Promise((r, i) => {
                            r = wrap(r);
                            const a = e.objectStore(t).get(n);
                            (a.onsuccess = (e) => r(e.target.result)),
                                (a.onerror = eventRejectHandler(i));
                        }),
                    query: (function (e) {
                        return (n) =>
                            new Promise((i, a) => {
                                i = wrap(i);
                                const { trans: o, values: s, limit: l, query: c } = n,
                                    u = l === 1 / 0 ? void 0 : l,
                                    { index: h, range: d } = c,
                                    p = o.objectStore(t),
                                    f = h.isPrimaryKey ? p : p.index(h.name),
                                    y = r(d);
                                if (0 === l) return i({ result: [] });
                                if (e) {
                                    const e = s ? f.getAll(y, u) : f.getAllKeys(y, u);
                                    (e.onsuccess = (e) => i({ result: e.target.result })),
                                        (e.onerror = eventRejectHandler(a));
                                } else {
                                    let e = 0;
                                    const t =
                                        s || !("openKeyCursor" in f)
                                            ? f.openCursor(y)
                                            : f.openKeyCursor(y),
                                        n = [];
                                    (t.onsuccess = (r) => {
                                        const a = t.result;
                                        return a
                                            ? (n.push(s ? a.value : a.primaryKey),
                                                ++e === l ? i({ result: n }) : void a.continue())
                                            : i({ result: n });
                                    }),
                                        (t.onerror = eventRejectHandler(a));
                                }
                            });
                    })(a),
                    openCursor: function ({
                        trans: e,
                        values: n,
                        query: i,
                        reverse: a,
                        unique: o,
                    }) {
                        return new Promise((s, l) => {
                            s = wrap(s);
                            const { index: c, range: u } = i,
                                h = e.objectStore(t),
                                d = c.isPrimaryKey ? h : h.index(c.name),
                                p = a ? (o ? "prevunique" : "prev") : o ? "nextunique" : "next",
                                f =
                                    n || !("openKeyCursor" in d)
                                        ? d.openCursor(r(u), p)
                                        : d.openKeyCursor(r(u), p);
                            (f.onerror = eventRejectHandler(l)),
                                (f.onsuccess = wrap((t) => {
                                    const n = f.result;
                                    if (!n) return void s(null);
                                    (n.___id = ++_id_counter), (n.done = !1);
                                    const r = n.continue.bind(n);
                                    let i = n.continuePrimaryKey;
                                    i && (i = i.bind(n));
                                    const a = n.advance.bind(n),
                                        o = () => {
                                            throw new Error("Cursor not stopped");
                                        };
                                    (n.trans = e),
                                        (n.stop =
                                            n.continue =
                                            n.continuePrimaryKey =
                                            n.advance =
                                            () => {
                                                throw new Error("Cursor not started");
                                            }),
                                        (n.fail = wrap(l)),
                                        (n.next = function () {
                                            let e = 1;
                                            return this.start(() =>
                                                e-- ? this.continue() : this.stop()
                                            ).then(() => this);
                                        }),
                                        (n.start = (e) => {
                                            const t = new Promise((e, t) => {
                                                (e = wrap(e)),
                                                    (f.onerror = eventRejectHandler(t)),
                                                    (n.fail = t),
                                                    (n.stop = (t) => {
                                                        (n.stop =
                                                            n.continue =
                                                            n.continuePrimaryKey =
                                                            n.advance =
                                                            o),
                                                            e(t);
                                                    });
                                            }),
                                                s = () => {
                                                    if (f.result)
                                                        try {
                                                            e();
                                                        } catch (e) {
                                                            n.fail(e);
                                                        }
                                                    else
                                                        (n.done = !0),
                                                            (n.start = () => {
                                                                throw new Error("Cursor behind last entry");
                                                            }),
                                                            n.stop();
                                                };
                                            return (
                                                (f.onsuccess = wrap((e) => {
                                                    (f.onsuccess = s), s();
                                                })),
                                                (n.continue = r),
                                                (n.continuePrimaryKey = i),
                                                (n.advance = a),
                                                s(),
                                                t
                                            );
                                        }),
                                        s(n);
                                }, l));
                        });
                    },
                    count({ query: e, trans: n }) {
                        const { index: i, range: a } = e;
                        return new Promise((e, o) => {
                            const s = n.objectStore(t),
                                l = i.isPrimaryKey ? s : s.index(i.name),
                                c = r(a),
                                u = c ? l.count(c) : l.count();
                            (u.onsuccess = wrap((t) => e(t.target.result))),
                                (u.onerror = eventRejectHandler(o));
                        });
                    },
                };
            })(e)
        ),
        s = {};
    return (
        o.forEach((e) => (s[e.name] = e)),
        {
            stack: "dbcore",
            transaction: e.transaction.bind(e),
            table(e) {
                if (!s[e]) throw new Error(`Table '${e}' not found`);
                return s[e];
            },
            MIN_KEY: -1 / 0,
            MAX_KEY: getMaxKey(t),
            schema: i,
        }
    );
}
function createMiddlewareStack(e, t) {
    return t.reduce((e, { create: t }) => ({ ...e, ...t(e) }), e);
}
function createMiddlewareStacks(e, t, { IDBKeyRange: n, indexedDB: r }, i) {
    return { dbcore: createMiddlewareStack(createDBCore(t, n, i), e.dbcore) };
}
function generateMiddlewareStacks({ _novip: e }, t) {
    const n = t.db,
        r = createMiddlewareStacks(e._middlewares, n, e._deps, t);
    (e.core = r.dbcore),
        e.tables.forEach((t) => {
            const n = t.name;
            e.core.schema.tables.some((e) => e.name === n) &&
                ((t.core = e.core.table(n)),
                    e[n] instanceof e.Table && (e[n].core = t.core));
        });
}
function setApiOnPlace({ _novip: e }, t, n, r) {
    n.forEach((n) => {
        const i = r[n];
        t.forEach((t) => {
            const r = getPropertyDescriptor(t, n);
            (!r || ("value" in r && void 0 === r.value)) &&
                (t === e.Transaction.prototype || t instanceof e.Transaction
                    ? setProp(t, n, {
                        get() {
                            return this.table(n);
                        },
                        set(e) {
                            defineProperty(this, n, {
                                value: e,
                                writable: !0,
                                configurable: !0,
                                enumerable: !0,
                            });
                        },
                    })
                    : (t[n] = new e.Table(n, i)));
        });
    });
}
function removeTablesApi({ _novip: e }, t) {
    t.forEach((t) => {
        for (let n in t) t[n] instanceof e.Table && delete t[n];
    });
}
function lowerVersionFirst(e, t) {
    return e._cfg.version - t._cfg.version;
}
function runUpgraders(e, t, n, r) {
    const i = e._dbSchema,
        a = e._createTransaction("readwrite", e._storeNames, i);
    a.create(n), a._completion.catch(r);
    const o = a._reject.bind(a),
        s = PSD.transless || PSD;
    newScope(() => {
        (PSD.trans = a),
            (PSD.transless = s),
            0 === t
                ? (keys(i).forEach((e) => {
                    createTable(n, e, i[e].primKey, i[e].indexes);
                }),
                    generateMiddlewareStacks(e, n),
                    DexiePromise.follow(() => e.on.populate.fire(a)).catch(o))
                : updateTablesAndIndexes(e, t, a, n).catch(o);
    });
}
function updateTablesAndIndexes({ _novip: e }, t, n, r) {
    const i = [],
        a = e._versions;
    let o = (e._dbSchema = buildGlobalSchema(e, e.idbdb, r)),
        s = !1;
    return (
        a
            .filter((e) => e._cfg.version >= t)
            .forEach((a) => {
                i.push(() => {
                    const i = o,
                        l = a._cfg.dbschema;
                    adjustToExistingIndexNames(e, i, r),
                        adjustToExistingIndexNames(e, l, r),
                        (o = e._dbSchema = l);
                    const c = getSchemaDiff(i, l);
                    c.add.forEach((e) => {
                        createTable(r, e[0], e[1].primKey, e[1].indexes);
                    }),
                        c.change.forEach((e) => {
                            if (e.recreate)
                                throw new exceptions.Upgrade(
                                    "Not yet support for changing primary key"
                                );
                            {
                                const t = r.objectStore(e.name);
                                e.add.forEach((e) => addIndex(t, e)),
                                    e.change.forEach((e) => {
                                        t.deleteIndex(e.name), addIndex(t, e);
                                    }),
                                    e.del.forEach((e) => t.deleteIndex(e));
                            }
                        });
                    const u = a._cfg.contentUpgrade;
                    if (u && a._cfg.version > t) {
                        generateMiddlewareStacks(e, r), (n._memoizedTables = {}), (s = !0);
                        let t = shallowClone(l);
                        c.del.forEach((e) => {
                            t[e] = i[e];
                        }),
                            removeTablesApi(e, [e.Transaction.prototype]),
                            setApiOnPlace(e, [e.Transaction.prototype], keys(t), t),
                            (n.schema = t);
                        const a = isAsyncFunction(u);
                        let o;
                        a && incrementExpectedAwaits();
                        const h = DexiePromise.follow(() => {
                            if (((o = u(n)), o && a)) {
                                var e = decrementExpectedAwaits.bind(null, null);
                                o.then(e, e);
                            }
                        });
                        return o && "function" == typeof o.then
                            ? DexiePromise.resolve(o)
                            : h.then(() => o);
                    }
                }),
                    i.push((t) => {
                        if (!s || !hasIEDeleteObjectStoreBug) {
                            deleteRemovedTables(a._cfg.dbschema, t);
                        }
                        removeTablesApi(e, [e.Transaction.prototype]),
                            setApiOnPlace(
                                e,
                                [e.Transaction.prototype],
                                e._storeNames,
                                e._dbSchema
                            ),
                            (n.schema = e._dbSchema);
                    });
            }),
        (function e() {
            return i.length
                ? DexiePromise.resolve(i.shift()(n.idbtrans)).then(e)
                : DexiePromise.resolve();
        })().then(() => {
            createMissingTables(o, r);
        })
    );
}
function getSchemaDiff(e, t) {
    const n = { del: [], add: [], change: [] };
    let r;
    for (r in e) t[r] || n.del.push(r);
    for (r in t) {
        const i = e[r],
            a = t[r];
        if (i) {
            const e = { name: r, def: a, recreate: !1, del: [], add: [], change: [] };
            if (
                "" + (i.primKey.keyPath || "") != "" + (a.primKey.keyPath || "") ||
                (i.primKey.auto !== a.primKey.auto && !isIEOrEdge)
            )
                (e.recreate = !0), n.change.push(e);
            else {
                const t = i.idxByName,
                    r = a.idxByName;
                let o;
                for (o in t) r[o] || e.del.push(o);
                for (o in r) {
                    const n = t[o],
                        i = r[o];
                    n ? n.src !== i.src && e.change.push(i) : e.add.push(i);
                }
                (e.del.length > 0 || e.add.length > 0 || e.change.length > 0) &&
                    n.change.push(e);
            }
        } else n.add.push([r, a]);
    }
    return n;
}
function createTable(e, t, n, r) {
    const i = e.db.createObjectStore(
        t,
        n.keyPath
            ? { keyPath: n.keyPath, autoIncrement: n.auto }
            : { autoIncrement: n.auto }
    );
    return r.forEach((e) => addIndex(i, e)), i;
}
function createMissingTables(e, t) {
    keys(e).forEach((n) => {
        t.db.objectStoreNames.contains(n) ||
            createTable(t, n, e[n].primKey, e[n].indexes);
    });
}
function deleteRemovedTables(e, t) {
    [].slice
        .call(t.db.objectStoreNames)
        .forEach((n) => null == e[n] && t.db.deleteObjectStore(n));
}
function addIndex(e, t) {
    e.createIndex(t.name, t.keyPath, { unique: t.unique, multiEntry: t.multi });
}
function buildGlobalSchema(e, t, n) {
    const r = {};
    return (
        slice(t.objectStoreNames, 0).forEach((e) => {
            const t = n.objectStore(e);
            let i = t.keyPath;
            const a = createIndexSpec(
                nameFromKeyPath(i),
                i || "",
                !1,
                !1,
                !!t.autoIncrement,
                i && "string" != typeof i,
                !0
            ),
                o = [];
            for (let e = 0; e < t.indexNames.length; ++e) {
                const n = t.index(t.indexNames[e]);
                i = n.keyPath;
                var s = createIndexSpec(
                    n.name,
                    i,
                    !!n.unique,
                    !!n.multiEntry,
                    !1,
                    i && "string" != typeof i,
                    !1
                );
                o.push(s);
            }
            r[e] = createTableSchema(e, a, o);
        }),
        r
    );
}
function readGlobalSchema({ _novip: e }, t, n) {
    e.verno = t.version / 10;
    const r = (e._dbSchema = buildGlobalSchema(e, t, n));
    (e._storeNames = slice(t.objectStoreNames, 0)),
        setApiOnPlace(e, [e._allTables], keys(r), r);
}
function verifyInstalledSchema(e, t) {
    const n = getSchemaDiff(buildGlobalSchema(e, e.idbdb, t), e._dbSchema);
    return !(
        n.add.length || n.change.some((e) => e.add.length || e.change.length)
    );
}
function adjustToExistingIndexNames({ _novip: e }, t, n) {
    const r = n.db.objectStoreNames;
    for (let i = 0; i < r.length; ++i) {
        const a = r[i],
            o = n.objectStore(a);
        e._hasGetAll = "getAll" in o;
        for (let e = 0; e < o.indexNames.length; ++e) {
            const n = o.indexNames[e],
                r = o.index(n).keyPath,
                i = "string" == typeof r ? r : "[" + slice(r).join("+") + "]";
            if (t[a]) {
                const e = t[a].idxByName[i];
                e && ((e.name = n), delete t[a].idxByName[i], (t[a].idxByName[n] = e));
            }
        }
    }
    "undefined" != typeof navigator &&
        /Safari/.test(navigator.userAgent) &&
        !/(Chrome\/|Edge\/)/.test(navigator.userAgent) &&
        _global.WorkerGlobalScope &&
        _global instanceof _global.WorkerGlobalScope &&
        [].concat(navigator.userAgent.match(/Safari\/(\d*)/))[1] < 604 &&
        (e._hasGetAll = !1);
}
function parseIndexSyntax(e) {
    return e.split(",").map((e, t) => {
        const n = (e = e.trim()).replace(/([&*]|\+\+)/g, ""),
            r = /^\[/.test(n) ? n.match(/^\[(.*)\]$/)[1].split("+") : n;
        return createIndexSpec(
            n,
            r || null,
            /\&/.test(e),
            /\*/.test(e),
            /\+\+/.test(e),
            isArray(r),
            0 === t
        );
    });
}
class Version {
    _parseStoresSpec(e, t) {
        keys(e).forEach((n) => {
            if (null !== e[n]) {
                var r = parseIndexSyntax(e[n]),
                    i = r.shift();
                if (i.multi)
                    throw new exceptions.Schema("Primary key cannot be multi-valued");
                r.forEach((e) => {
                    if (e.auto)
                        throw new exceptions.Schema(
                            "Only primary key can be marked as autoIncrement (++)"
                        );
                    if (!e.keyPath)
                        throw new exceptions.Schema(
                            "Index must have a name and cannot be an empty string"
                        );
                }),
                    (t[n] = createTableSchema(n, i, r));
            }
        });
    }
    stores(e) {
        const t = this.db;
        this._cfg.storesSource = this._cfg.storesSource
            ? extend(this._cfg.storesSource, e)
            : e;
        const n = t._versions,
            r = {};
        let i = {};
        return (
            n.forEach((e) => {
                extend(r, e._cfg.storesSource),
                    (i = e._cfg.dbschema = {}),
                    e._parseStoresSpec(r, i);
            }),
            (t._dbSchema = i),
            removeTablesApi(t, [t._allTables, t, t.Transaction.prototype]),
            setApiOnPlace(
                t,
                [t._allTables, t, t.Transaction.prototype, this._cfg.tables],
                keys(i),
                i
            ),
            (t._storeNames = keys(i)),
            this
        );
    }
    upgrade(e) {
        return (
            (this._cfg.contentUpgrade = promisableChain(
                this._cfg.contentUpgrade || nop,
                e
            )),
            this
        );
    }
}
function createVersionConstructor(e) {
    return makeClassConstructor(Version.prototype, function (t) {
        (this.db = e),
            (this._cfg = {
                version: t,
                storesSource: null,
                dbschema: {},
                tables: {},
                contentUpgrade: null,
            });
    });
}
function getDbNamesTable(e, t) {
    let n = e._dbNamesDB;
    return (
        n ||
        ((n = e._dbNamesDB =
            new Dexie$1(DBNAMES_DB, { addons: [], indexedDB: e, IDBKeyRange: t })),
            n.version(1).stores({ dbnames: "name" })),
        n.table("dbnames")
    );
}
function hasDatabasesNative(e) {
    return e && "function" == typeof e.databases;
}
function getDatabaseNames({ indexedDB: e, IDBKeyRange: t }) {
    return hasDatabasesNative(e)
        ? Promise.resolve(e.databases()).then((e) =>
            e.map((e) => e.name).filter((e) => e !== DBNAMES_DB)
        )
        : getDbNamesTable(e, t).toCollection().primaryKeys();
}
function _onDatabaseCreated({ indexedDB: e, IDBKeyRange: t }, n) {
    !hasDatabasesNative(e) &&
        n !== DBNAMES_DB &&
        getDbNamesTable(e, t).put({ name: n }).catch(nop);
}
function _onDatabaseDeleted({ indexedDB: e, IDBKeyRange: t }, n) {
    !hasDatabasesNative(e) &&
        n !== DBNAMES_DB &&
        getDbNamesTable(e, t).delete(n).catch(nop);
}
function vip(e) {
    return newScope(function () {
        return (PSD.letThrough = !0), e();
    });
}
function idbReady() {
    var e;
    return !navigator.userAgentData &&
        /Safari\//.test(navigator.userAgent) &&
        !/Chrom(e|ium)\//.test(navigator.userAgent) &&
        indexedDB.databases
        ? new Promise(function (t) {
            var n = function () {
                return indexedDB.databases().finally(t);
            };
            (e = setInterval(n, 100)), n();
        }).finally(function () {
            return clearInterval(e);
        })
        : Promise.resolve();
}
function dexieOpen(e) {
    const t = e._state,
        { indexedDB: n } = e._deps;
    if (t.isBeingOpened || e.idbdb)
        return t.dbReadyPromise.then(() =>
            t.dbOpenError ? rejection(t.dbOpenError) : e
        );
    debug && (t.openCanceller._stackHolder = getErrorWithStack()),
        (t.isBeingOpened = !0),
        (t.dbOpenError = null),
        (t.openComplete = !1);
    const r = t.openCanceller;
    function i() {
        if (t.openCanceller !== r)
            throw new exceptions.DatabaseClosed("db.open() was cancelled");
    }
    let a = t.dbReadyResolve,
        o = null,
        s = !1;
    const l = () =>
        new DexiePromise((r, a) => {
            if ((i(), !n)) throw new exceptions.MissingAPI();
            const l = e.name,
                c = t.autoSchema ? n.open(l) : n.open(l, Math.round(10 * e.verno));
            if (!c) throw new exceptions.MissingAPI();
            (c.onerror = eventRejectHandler(a)),
                (c.onblocked = wrap(e._fireOnBlocked)),
                (c.onupgradeneeded = wrap((r) => {
                    if (((o = c.transaction), t.autoSchema && !e._options.allowEmptyDB)) {
                        (c.onerror = preventDefault), o.abort(), c.result.close();
                        const e = n.deleteDatabase(l);
                        e.onsuccess = e.onerror = wrap(() => {
                            a(new exceptions.NoSuchDatabase(`Database ${l} doesnt exist`));
                        });
                    } else {
                        o.onerror = eventRejectHandler(a);
                        var i = r.oldVersion > Math.pow(2, 62) ? 0 : r.oldVersion;
                        (s = i < 1),
                            (e._novip.idbdb = c.result),
                            runUpgraders(e, i / 10, o, a);
                    }
                }, a)),
                (c.onsuccess = wrap(() => {
                    o = null;
                    const n = (e._novip.idbdb = c.result),
                        i = slice(n.objectStoreNames);
                    if (i.length > 0)
                        try {
                            const r = n.transaction(safariMultiStoreFix(i), "readonly");
                            t.autoSchema
                                ? readGlobalSchema(e, n, r)
                                : (adjustToExistingIndexNames(e, e._dbSchema, r),
                                    verifyInstalledSchema(e, r) ||
                                    console.warn(
                                        "Dexie SchemaDiff: Schema was extended without increasing the number passed to db.version(). Some queries may fail."
                                    )),
                                generateMiddlewareStacks(e, r);
                        } catch (e) { }
                    connections.push(e),
                        (n.onversionchange = wrap((n) => {
                            (t.vcFired = !0), e.on("versionchange").fire(n);
                        })),
                        (n.onclose = wrap((t) => {
                            e.on("close").fire(t);
                        })),
                        s && _onDatabaseCreated(e._deps, l),
                        r();
                }, a));
        }).catch((e) =>
            e && "UnknownError" === e.name && t.PR1398_maxLoop > 0
                ? (t.PR1398_maxLoop--,
                    console.warn("Dexie: Workaround for Chrome UnknownError on open()"),
                    l())
                : DexiePromise.reject(e)
        );
    return DexiePromise.race([
        r,
        ("undefined" == typeof navigator
            ? DexiePromise.resolve()
            : idbReady()
        ).then(l),
    ])
        .then(
            () => (
                i(),
                (t.onReadyBeingFired = []),
                DexiePromise.resolve(vip(() => e.on.ready.fire(e.vip))).then(
                    function n() {
                        if (t.onReadyBeingFired.length > 0) {
                            let r = t.onReadyBeingFired.reduce(promisableChain, nop);
                            return (
                                (t.onReadyBeingFired = []),
                                DexiePromise.resolve(vip(() => r(e.vip))).then(n)
                            );
                        }
                    }
                )
            )
        )
        .finally(() => {
            (t.onReadyBeingFired = null), (t.isBeingOpened = !1);
        })
        .then(() => e)
        .catch((n) => {
            t.dbOpenError = n;
            try {
                o && o.abort();
            } catch (e) { }
            return r === t.openCanceller && e._close(), rejection(n);
        })
        .finally(() => {
            (t.openComplete = !0), a();
        });
}
function awaitIterator(e) {
    var t = (t) => e.next(t),
        n = i(t),
        r = i((t) => e.throw(t));
    function i(e) {
        return (t) => {
            var i = e(t),
                a = i.value;
            return i.done
                ? a
                : a && "function" == typeof a.then
                    ? a.then(n, r)
                    : isArray(a)
                        ? Promise.all(a).then(n, r)
                        : n(a);
        };
    }
    return i(t)();
}
function extractTransactionArgs(e, t, n) {
    var r = arguments.length;
    if (r < 2) throw new exceptions.InvalidArgument("Too few arguments");
    for (var i = new Array(r - 1); --r;) i[r - 1] = arguments[r];
    return (n = i.pop()), [e, flatten(i), n];
}
function enterTransactionScope(e, t, n, r, i) {
    return DexiePromise.resolve().then(() => {
        const a = PSD.transless || PSD,
            o = e._createTransaction(t, n, e._dbSchema, r),
            s = { trans: o, transless: a };
        if (r) o.idbtrans = r.idbtrans;
        else
            try {
                o.create(), (e._state.PR1398_maxLoop = 3);
            } catch (r) {
                return r.name === errnames.InvalidState &&
                    e.isOpen() &&
                    --e._state.PR1398_maxLoop > 0
                    ? (console.warn("Dexie: Need to reopen db"),
                        e._close(),
                        e.open().then(() => enterTransactionScope(e, t, n, null, i)))
                    : rejection(r);
            }
        const l = isAsyncFunction(i);
        let c;
        l && incrementExpectedAwaits();
        const u = DexiePromise.follow(() => {
            if (((c = i.call(o, o)), c))
                if (l) {
                    var e = decrementExpectedAwaits.bind(null, null);
                    c.then(e, e);
                } else
                    "function" == typeof c.next &&
                        "function" == typeof c.throw &&
                        (c = awaitIterator(c));
        }, s);
        return (
            c && "function" == typeof c.then
                ? DexiePromise.resolve(c).then((e) =>
                    o.active
                        ? e
                        : rejection(
                            new exceptions.PrematureCommit(
                                "Transaction committed too early. See http://bit.ly/2kdckMn"
                            )
                        )
                )
                : u.then(() => c)
        )
            .then((e) => (r && o._resolve(), o._completion.then(() => e)))
            .catch((e) => (o._reject(e), rejection(e)));
    });
}
function pad(e, t, n) {
    const r = isArray(e) ? e.slice() : [e];
    for (let e = 0; e < n; ++e) r.push(t);
    return r;
}
function createVirtualIndexMiddleware(e) {
    return {
        ...e,
        table(t) {
            const n = e.table(t),
                { schema: r } = n,
                i = {},
                a = [];
            function o(e, t, n) {
                const r = getKeyPathAlias(e),
                    s = (i[r] = i[r] || []),
                    l = null == e ? 0 : "string" == typeof e ? 1 : e.length,
                    c = t > 0,
                    u = {
                        ...n,
                        isVirtual: c,
                        keyTail: t,
                        keyLength: l,
                        extractKey: getKeyExtractor(e),
                        unique: !c && n.unique,
                    };
                if ((s.push(u), u.isPrimaryKey || a.push(u), l > 1)) {
                    o(2 === l ? e[0] : e.slice(0, l - 1), t + 1, n);
                }
                return s.sort((e, t) => e.keyTail - t.keyTail), u;
            }
            const s = o(r.primaryKey.keyPath, 0, r.primaryKey);
            i[":id"] = [s];
            for (const e of r.indexes) o(e.keyPath, 0, e);
            function l(t) {
                const n = t.query.index;
                return n.isVirtual
                    ? {
                        ...t,
                        query: {
                            index: n,
                            range:
                                ((r = t.query.range),
                                    (i = n.keyTail),
                                {
                                    type: 1 === r.type ? 2 : r.type,
                                    lower: pad(r.lower, r.lowerOpen ? e.MAX_KEY : e.MIN_KEY, i),
                                    lowerOpen: !0,
                                    upper: pad(r.upper, r.upperOpen ? e.MIN_KEY : e.MAX_KEY, i),
                                    upperOpen: !0,
                                }),
                        },
                    }
                    : t;
                var r, i;
            }
            const c = {
                ...n,
                schema: {
                    ...r,
                    primaryKey: s,
                    indexes: a,
                    getIndexByKeyPath: function (e) {
                        const t = i[getKeyPathAlias(e)];
                        return t && t[0];
                    },
                },
                count: (e) => n.count(l(e)),
                query: (e) => n.query(l(e)),
                openCursor(t) {
                    const { keyTail: r, isVirtual: i, keyLength: a } = t.query.index;
                    if (!i) return n.openCursor(t);
                    return n.openCursor(l(t)).then(
                        (n) =>
                            n &&
                            (function (n) {
                                const i = Object.create(n, {
                                    continue: {
                                        value: function (i) {
                                            null != i
                                                ? n.continue(
                                                    pad(i, t.reverse ? e.MAX_KEY : e.MIN_KEY, r)
                                                )
                                                : t.unique
                                                    ? n.continue(
                                                        n.key
                                                            .slice(0, a)
                                                            .concat(t.reverse ? e.MIN_KEY : e.MAX_KEY, r)
                                                    )
                                                    : n.continue();
                                        },
                                    },
                                    continuePrimaryKey: {
                                        value(t, i) {
                                            n.continuePrimaryKey(pad(t, e.MAX_KEY, r), i);
                                        },
                                    },
                                    primaryKey: { get: () => n.primaryKey },
                                    key: {
                                        get() {
                                            const e = n.key;
                                            return 1 === a ? e[0] : e.slice(0, a);
                                        },
                                    },
                                    value: { get: () => n.value },
                                });
                                return i;
                            })(n)
                    );
                },
            };
            return c;
        },
    };
}
const virtualIndexMiddleware = {
    stack: "dbcore",
    name: "VirtualIndexMiddleware",
    level: 1,
    create: createVirtualIndexMiddleware,
};
function getObjectDiff(e, t, n, r) {
    return (
        (n = n || {}),
        (r = r || ""),
        keys(e).forEach((i) => {
            if (hasOwn(t, i)) {
                var a = e[i],
                    o = t[i];
                if ("object" == typeof a && "object" == typeof o && a && o) {
                    const e = toStringTag(a);
                    e !== toStringTag(o)
                        ? (n[r + i] = t[i])
                        : "Object" === e
                            ? getObjectDiff(a, o, n, r + i + ".")
                            : a !== o && (n[r + i] = t[i]);
                } else a !== o && (n[r + i] = t[i]);
            } else n[r + i] = void 0;
        }),
        keys(t).forEach((i) => {
            hasOwn(e, i) || (n[r + i] = t[i]);
        }),
        n
    );
}
function getEffectiveKeys(e, t) {
    return "delete" === t.type ? t.keys : t.keys || t.values.map(e.extractKey);
}
const hooksMiddleware = {
    stack: "dbcore",
    name: "HooksMiddleware",
    level: 2,
    create: (e) => ({
        ...e,
        table(t) {
            const n = e.table(t),
                { primaryKey: r } = n.schema,
                i = {
                    ...n,
                    mutate(e) {
                        const i = PSD.trans,
                            { deleting: a, creating: o, updating: s } = i.table(t).hook;
                        switch (e.type) {
                            case "add":
                                if (o.fire === nop) break;
                                return i._promise("readwrite", () => l(e), !0);
                            case "put":
                                if (o.fire === nop && s.fire === nop) break;
                                return i._promise("readwrite", () => l(e), !0);
                            case "delete":
                                if (a.fire === nop) break;
                                return i._promise("readwrite", () => l(e), !0);
                            case "deleteRange":
                                if (a.fire === nop) break;
                                return i._promise(
                                    "readwrite",
                                    () =>
                                        (function (e) {
                                            return c(e.trans, e.range, 1e4);
                                        })(e),
                                    !0
                                );
                        }
                        return n.mutate(e);
                        function l(e) {
                            const t = PSD.trans,
                                i = e.keys || getEffectiveKeys(r, e);
                            if (!i) throw new Error("Keys missing");
                            return (
                                "delete" !==
                                (e =
                                    "add" === e.type || "put" === e.type
                                        ? { ...e, keys: i }
                                        : { ...e }).type && (e.values = [...e.values]),
                                e.keys && (e.keys = [...e.keys]),
                                getExistingValues(n, e, i).then((l) => {
                                    const c = i.map((n, i) => {
                                        const c = l[i],
                                            u = { onerror: null, onsuccess: null };
                                        if ("delete" === e.type) a.fire.call(u, n, c, t);
                                        else if ("add" === e.type || void 0 === c) {
                                            const a = o.fire.call(u, n, e.values[i], t);
                                            null == n &&
                                                null != a &&
                                                ((n = a),
                                                    (e.keys[i] = n),
                                                    r.outbound || setByKeyPath(e.values[i], r.keyPath, n));
                                        } else {
                                            const r = getObjectDiff(c, e.values[i]),
                                                a = s.fire.call(u, r, n, c, t);
                                            if (a) {
                                                const t = e.values[i];
                                                Object.keys(a).forEach((e) => {
                                                    hasOwn(t, e)
                                                        ? (t[e] = a[e])
                                                        : setByKeyPath(t, e, a[e]);
                                                });
                                            }
                                        }
                                        return u;
                                    });
                                    return n
                                        .mutate(e)
                                        .then(
                                            ({
                                                failures: t,
                                                results: n,
                                                numFailures: r,
                                                lastResult: a,
                                            }) => {
                                                for (let r = 0; r < i.length; ++r) {
                                                    const a = n ? n[r] : i[r],
                                                        o = c[r];
                                                    null == a
                                                        ? o.onerror && o.onerror(t[r])
                                                        : o.onsuccess &&
                                                        o.onsuccess(
                                                            "put" === e.type && l[r] ? e.values[r] : a
                                                        );
                                                }
                                                return {
                                                    failures: t,
                                                    results: n,
                                                    numFailures: r,
                                                    lastResult: a,
                                                };
                                            }
                                        )
                                        .catch(
                                            (e) => (
                                                c.forEach((t) => t.onerror && t.onerror(e)),
                                                Promise.reject(e)
                                            )
                                        );
                                })
                            );
                        }
                        function c(e, t, i) {
                            return n
                                .query({
                                    trans: e,
                                    values: !1,
                                    query: { index: r, range: t },
                                    limit: i,
                                })
                                .then(({ result: n }) =>
                                    l({ type: "delete", keys: n, trans: e }).then((r) =>
                                        r.numFailures > 0
                                            ? Promise.reject(r.failures[0])
                                            : n.length < i
                                                ? { failures: [], numFailures: 0, lastResult: void 0 }
                                                : c(e, { ...t, lower: n[n.length - 1], lowerOpen: !0 }, i)
                                    )
                                );
                        }
                    },
                };
            return i;
        },
    }),
};
function getExistingValues(e, t, n) {
    return "add" === t.type
        ? Promise.resolve([])
        : e.getMany({ trans: t.trans, keys: n, cache: "immutable" });
}
function getFromTransactionCache(e, t, n) {
    try {
        if (!t) return null;
        if (t.keys.length < e.length) return null;
        const r = [];
        for (let i = 0, a = 0; i < t.keys.length && a < e.length; ++i)
            0 === cmp(t.keys[i], e[a]) &&
                (r.push(n ? deepClone(t.values[i]) : t.values[i]), ++a);
        return r.length === e.length ? r : null;
    } catch (e) {
        return null;
    }
}
const cacheExistingValuesMiddleware = {
    stack: "dbcore",
    level: -1,
    create: (e) => ({
        table: (t) => {
            const n = e.table(t);
            return {
                ...n,
                getMany: (e) => {
                    if (!e.cache) return n.getMany(e);
                    const t = getFromTransactionCache(
                        e.keys,
                        e.trans._cache,
                        "clone" === e.cache
                    );
                    return t
                        ? DexiePromise.resolve(t)
                        : n
                            .getMany(e)
                            .then(
                                (t) => (
                                    (e.trans._cache = {
                                        keys: e.keys,
                                        values: "clone" === e.cache ? deepClone(t) : t,
                                    }),
                                    t
                                )
                            );
                },
                mutate: (e) => (
                    "add" !== e.type && (e.trans._cache = null), n.mutate(e)
                ),
            };
        },
    }),
};
function isEmptyRange(e) {
    return !("from" in e);
}
const RangeSet = function (e, t) {
    if (!this) {
        const t = new RangeSet();
        return e && "d" in e && extend(t, e), t;
    }
    extend(
        this,
        arguments.length
            ? { d: 1, from: e, to: arguments.length > 1 ? t : e }
            : { d: 0 }
    );
};
function addRange(e, t, n) {
    const r = cmp(t, n);
    if (isNaN(r)) return;
    if (r > 0) throw RangeError();
    if (isEmptyRange(e)) return extend(e, { from: t, to: n, d: 1 });
    const i = e.l,
        a = e.r;
    if (cmp(n, e.from) < 0)
        return (
            i
                ? addRange(i, t, n)
                : (e.l = { from: t, to: n, d: 1, l: null, r: null }),
            rebalance(e)
        );
    if (cmp(t, e.to) > 0)
        return (
            a
                ? addRange(a, t, n)
                : (e.r = { from: t, to: n, d: 1, l: null, r: null }),
            rebalance(e)
        );
    cmp(t, e.from) < 0 && ((e.from = t), (e.l = null), (e.d = a ? a.d + 1 : 1)),
        cmp(n, e.to) > 0 && ((e.to = n), (e.r = null), (e.d = e.l ? e.l.d + 1 : 1));
    const o = !e.r;
    i && !e.l && mergeRanges(e, i), a && o && mergeRanges(e, a);
}
function mergeRanges(e, t) {
    isEmptyRange(t) ||
        (function e(t, { from: n, to: r, l: i, r: a }) {
            addRange(t, n, r), i && e(t, i), a && e(t, a);
        })(e, t);
}
function rangesOverlap(e, t) {
    const n = getRangeSetIterator(t);
    let r = n.next();
    if (r.done) return !1;
    let i = r.value;
    const a = getRangeSetIterator(e);
    let o = a.next(i.from),
        s = o.value;
    for (; !r.done && !o.done;) {
        if (cmp(s.from, i.to) <= 0 && cmp(s.to, i.from) >= 0) return !0;
        cmp(i.from, s.from) < 0
            ? (i = (r = n.next(s.from)).value)
            : (s = (o = a.next(i.from)).value);
    }
    return !1;
}
function getRangeSetIterator(e) {
    let t = isEmptyRange(e) ? null : { s: 0, n: e };
    return {
        next(e) {
            const n = arguments.length > 0;
            for (; t;)
                switch (t.s) {
                    case 0:
                        if (((t.s = 1), n))
                            for (; t.n.l && cmp(e, t.n.from) < 0;)
                                t = { up: t, n: t.n.l, s: 1 };
                        else for (; t.n.l;) t = { up: t, n: t.n.l, s: 1 };
                    case 1:
                        if (((t.s = 2), !n || cmp(e, t.n.to) <= 0))
                            return { value: t.n, done: !1 };
                    case 2:
                        if (t.n.r) {
                            (t.s = 3), (t = { up: t, n: t.n.r, s: 0 });
                            continue;
                        }
                    case 3:
                        t = t.up;
                }
            return { done: !0 };
        },
    };
}
function rebalance(e) {
    var t, n;
    const r =
        ((null === (t = e.r) || void 0 === t ? void 0 : t.d) || 0) -
        ((null === (n = e.l) || void 0 === n ? void 0 : n.d) || 0),
        i = r > 1 ? "r" : r < -1 ? "l" : "";
    if (i) {
        const t = "r" === i ? "l" : "r",
            n = { ...e },
            r = e[i];
        (e.from = r.from),
            (e.to = r.to),
            (e[i] = r[i]),
            (n[i] = r[t]),
            (e[t] = n),
            (n.d = computeDepth(n));
    }
    e.d = computeDepth(e);
}
function computeDepth({ r: e, l: t }) {
    return (e ? (t ? Math.max(e.d, t.d) : e.d) : t ? t.d : 0) + 1;
}
props(RangeSet.prototype, {
    add(e) {
        return mergeRanges(this, e), this;
    },
    addKey(e) {
        return addRange(this, e, e), this;
    },
    addKeys(e) {
        return e.forEach((e) => addRange(this, e, e)), this;
    },
    [iteratorSymbol]() {
        return getRangeSetIterator(this);
    },
});
const observabilityMiddleware = {
    stack: "dbcore",
    level: 0,
    create: (e) => {
        const t = e.schema.name,
            n = new RangeSet(e.MIN_KEY, e.MAX_KEY);
        return {
            ...e,
            table: (r) => {
                const i = e.table(r),
                    { schema: a } = i,
                    { primaryKey: o } = a,
                    { extractKey: s, outbound: l } = o,
                    c = {
                        ...i,
                        mutate: (e) => {
                            const o = e.trans,
                                s = o.mutatedParts || (o.mutatedParts = {}),
                                l = (e) => {
                                    const n = `idb://${t}/${r}/${e}`;
                                    return s[n] || (s[n] = new RangeSet());
                                },
                                c = l(""),
                                u = l(":dels"),
                                { type: h } = e;
                            let [d, p] =
                                "deleteRange" === e.type
                                    ? [e.range]
                                    : "delete" === e.type
                                        ? [e.keys]
                                        : e.values.length < 50
                                            ? [[], e.values]
                                            : [];
                            const f = e.trans._cache;
                            return i.mutate(e).then((e) => {
                                if (isArray(d)) {
                                    "delete" !== h && (d = e.results), c.addKeys(d);
                                    const t = getFromTransactionCache(d, f);
                                    t || "add" === h || u.addKeys(d),
                                        (t || p) && trackAffectedIndexes(l, a, t, p);
                                } else if (d) {
                                    const e = { from: d.lower, to: d.upper };
                                    u.add(e), c.add(e);
                                } else
                                    c.add(n),
                                        u.add(n),
                                        a.indexes.forEach((e) => l(e.name).add(n));
                                return e;
                            });
                        },
                    },
                    u = ({ query: { index: t, range: n } }) => {
                        var r, i;
                        return [
                            t,
                            new RangeSet(
                                null !== (r = n.lower) && void 0 !== r ? r : e.MIN_KEY,
                                null !== (i = n.upper) && void 0 !== i ? i : e.MAX_KEY
                            ),
                        ];
                    },
                    h = {
                        get: (e) => [o, new RangeSet(e.key)],
                        getMany: (e) => [o, new RangeSet().addKeys(e.keys)],
                        count: u,
                        query: u,
                        openCursor: u,
                    };
                return (
                    keys(h).forEach((e) => {
                        c[e] = function (a) {
                            const { subscr: o } = PSD;
                            if (o) {
                                const c = (e) => {
                                    const n = `idb://${t}/${r}/${e}`;
                                    return o[n] || (o[n] = new RangeSet());
                                },
                                    u = c(""),
                                    d = c(":dels"),
                                    [p, f] = h[e](a);
                                if ((c(p.name || "").add(f), !p.isPrimaryKey)) {
                                    if ("count" !== e) {
                                        const t =
                                            "query" === e &&
                                            l &&
                                            a.values &&
                                            i.query({ ...a, values: !1 });
                                        return i[e].apply(this, arguments).then((n) => {
                                            if ("query" === e) {
                                                if (l && a.values)
                                                    return t.then(({ result: e }) => (u.addKeys(e), n));
                                                const e = a.values ? n.result.map(s) : n.result;
                                                a.values ? u.addKeys(e) : d.addKeys(e);
                                            } else if ("openCursor" === e) {
                                                const e = n,
                                                    t = a.values;
                                                return (
                                                    e &&
                                                    Object.create(e, {
                                                        key: { get: () => (d.addKey(e.primaryKey), e.key) },
                                                        primaryKey: {
                                                            get() {
                                                                const t = e.primaryKey;
                                                                return d.addKey(t), t;
                                                            },
                                                        },
                                                        value: {
                                                            get: () => (t && u.addKey(e.primaryKey), e.value),
                                                        },
                                                    })
                                                );
                                            }
                                            return n;
                                        });
                                    }
                                    d.add(n);
                                }
                            }
                            return i[e].apply(this, arguments);
                        };
                    }),
                    c
                );
            },
        };
    },
};
function trackAffectedIndexes(e, t, n, r) {
    t.indexes.forEach(function (t) {
        const i = e(t.name || "");
        function a(e) {
            return null != e ? t.extractKey(e) : null;
        }
        const o = (e) =>
            t.multiEntry && isArray(e) ? e.forEach((e) => i.addKey(e)) : i.addKey(e);
        (n || r).forEach((e, t) => {
            const i = n && a(n[t]),
                s = r && a(r[t]);
            0 !== cmp(i, s) && (null != i && o(i), null != s && o(s));
        });
    });
}
class Dexie$1 {
    constructor(e, t) {
        (this._middlewares = {}), (this.verno = 0);
        const n = Dexie$1.dependencies;
        (this._options = t =
        {
            addons: Dexie$1.addons,
            autoOpen: !0,
            indexedDB: n.indexedDB,
            IDBKeyRange: n.IDBKeyRange,
            ...t,
        }),
            (this._deps = { indexedDB: t.indexedDB, IDBKeyRange: t.IDBKeyRange });
        const { addons: r } = t;
        (this._dbSchema = {}),
            (this._versions = []),
            (this._storeNames = []),
            (this._allTables = {}),
            (this.idbdb = null),
            (this._novip = this);
        const i = {
            dbOpenError: null,
            isBeingOpened: !1,
            onReadyBeingFired: null,
            openComplete: !1,
            dbReadyResolve: nop,
            dbReadyPromise: null,
            cancelOpen: nop,
            openCanceller: null,
            autoSchema: !0,
            PR1398_maxLoop: 3,
        };
        (i.dbReadyPromise = new DexiePromise((e) => {
            i.dbReadyResolve = e;
        })),
            (i.openCanceller = new DexiePromise((e, t) => {
                i.cancelOpen = t;
            })),
            (this._state = i),
            (this.name = e),
            (this.on = Events(this, "populate", "blocked", "versionchange", "close", {
                ready: [promisableChain, nop],
            })),
            (this.on.ready.subscribe = override(
                this.on.ready.subscribe,
                (e) => (t, n) => {
                    Dexie$1.vip(() => {
                        const r = this._state;
                        if (r.openComplete)
                            r.dbOpenError || DexiePromise.resolve().then(t), n && e(t);
                        else if (r.onReadyBeingFired)
                            r.onReadyBeingFired.push(t), n && e(t);
                        else {
                            e(t);
                            const r = this;
                            n ||
                                e(function e() {
                                    r.on.ready.unsubscribe(t), r.on.ready.unsubscribe(e);
                                });
                        }
                    });
                }
            )),
            (this.Collection = createCollectionConstructor(this)),
            (this.Table = createTableConstructor(this)),
            (this.Transaction = createTransactionConstructor(this)),
            (this.Version = createVersionConstructor(this)),
            (this.WhereClause = createWhereClauseConstructor(this)),
            this.on("versionchange", (e) => {
                e.newVersion > 0
                    ? console.warn(
                        `Another connection wants to upgrade database '${this.name}'. Closing db now to resume the upgrade.`
                    )
                    : console.warn(
                        `Another connection wants to delete database '${this.name}'. Closing db now to resume the delete request.`
                    ),
                    this.close();
            }),
            this.on("blocked", (e) => {
                !e.newVersion || e.newVersion < e.oldVersion
                    ? console.warn(`Dexie.delete('${this.name}') was blocked`)
                    : console.warn(
                        `Upgrade '${this.name
                        }' blocked by other connection holding version ${e.oldVersion / 10
                        }`
                    );
            }),
            (this._maxKey = getMaxKey(t.IDBKeyRange)),
            (this._createTransaction = (e, t, n, r) =>
                new this.Transaction(
                    e,
                    t,
                    n,
                    this._options.chromeTransactionDurability,
                    r
                )),
            (this._fireOnBlocked = (e) => {
                this.on("blocked").fire(e),
                    connections
                        .filter(
                            (e) => e.name === this.name && e !== this && !e._state.vcFired
                        )
                        .map((t) => t.on("versionchange").fire(e));
            }),
            this.use(virtualIndexMiddleware),
            this.use(hooksMiddleware),
            this.use(observabilityMiddleware),
            this.use(cacheExistingValuesMiddleware),
            (this.vip = Object.create(this, { _vip: { value: !0 } })),
            r.forEach((e) => e(this));
    }
    version(e) {
        if (isNaN(e) || e < 0.1)
            throw new exceptions.Type("Given version is not a positive number");
        if (
            ((e = Math.round(10 * e) / 10), this.idbdb || this._state.isBeingOpened)
        )
            throw new exceptions.Schema("Cannot add version when database is open");
        this.verno = Math.max(this.verno, e);
        const t = this._versions;
        var n = t.filter((t) => t._cfg.version === e)[0];
        return (
            n ||
            ((n = new this.Version(e)),
                t.push(n),
                t.sort(lowerVersionFirst),
                n.stores({}),
                (this._state.autoSchema = !1),
                n)
        );
    }
    _whenReady(e) {
        return this.idbdb &&
            (this._state.openComplete || PSD.letThrough || this._vip)
            ? e()
            : new DexiePromise((e, t) => {
                if (this._state.openComplete)
                    return t(new exceptions.DatabaseClosed(this._state.dbOpenError));
                if (!this._state.isBeingOpened) {
                    if (!this._options.autoOpen)
                        return void t(new exceptions.DatabaseClosed());
                    this.open().catch(nop);
                }
                this._state.dbReadyPromise.then(e, t);
            }).then(e);
    }
    use({ stack: e, create: t, level: n, name: r }) {
        r && this.unuse({ stack: e, name: r });
        const i = this._middlewares[e] || (this._middlewares[e] = []);
        return (
            i.push({ stack: e, create: t, level: null == n ? 10 : n, name: r }),
            i.sort((e, t) => e.level - t.level),
            this
        );
    }
    unuse({ stack: e, name: t, create: n }) {
        return (
            e &&
            this._middlewares[e] &&
            (this._middlewares[e] = this._middlewares[e].filter((e) =>
                n ? e.create !== n : !!t && e.name !== t
            )),
            this
        );
    }
    open() {
        return dexieOpen(this);
    }
    _close() {
        const e = this._state,
            t = connections.indexOf(this);
        if ((t >= 0 && connections.splice(t, 1), this.idbdb)) {
            try {
                this.idbdb.close();
            } catch (e) { }
            this._novip.idbdb = null;
        }
        (e.dbReadyPromise = new DexiePromise((t) => {
            e.dbReadyResolve = t;
        })),
            (e.openCanceller = new DexiePromise((t, n) => {
                e.cancelOpen = n;
            }));
    }
    close() {
        this._close();
        const e = this._state;
        (this._options.autoOpen = !1),
            (e.dbOpenError = new exceptions.DatabaseClosed()),
            e.isBeingOpened && e.cancelOpen(e.dbOpenError);
    }
    delete() {
        const e = arguments.length > 0,
            t = this._state;
        return new DexiePromise((n, r) => {
            const i = () => {
                this.close();
                var e = this._deps.indexedDB.deleteDatabase(this.name);
                (e.onsuccess = wrap(() => {
                    _onDatabaseDeleted(this._deps, this.name), n();
                })),
                    (e.onerror = eventRejectHandler(r)),
                    (e.onblocked = this._fireOnBlocked);
            };
            if (e)
                throw new exceptions.InvalidArgument(
                    "Arguments not allowed in db.delete()"
                );
            t.isBeingOpened ? t.dbReadyPromise.then(i) : i();
        });
    }
    backendDB() {
        return this.idbdb;
    }
    isOpen() {
        return null !== this.idbdb;
    }
    hasBeenClosed() {
        const e = this._state.dbOpenError;
        return e && "DatabaseClosed" === e.name;
    }
    hasFailed() {
        return null !== this._state.dbOpenError;
    }
    dynamicallyOpened() {
        return this._state.autoSchema;
    }
    get tables() {
        return keys(this._allTables).map((e) => this._allTables[e]);
    }
    transaction() {
        const e = extractTransactionArgs.apply(this, arguments);
        return this._transaction.apply(this, e);
    }
    _transaction(e, t, n) {
        let r = PSD.trans;
        (r && r.db === this && -1 === e.indexOf("!")) || (r = null);
        const i = -1 !== e.indexOf("?");
        let a, o;
        e = e.replace("!", "").replace("?", "");
        try {
            if (
                ((o = t.map((e) => {
                    var t = e instanceof this.Table ? e.name : e;
                    if ("string" != typeof t)
                        throw new TypeError(
                            "Invalid table argument to Dexie.transaction(). Only Table or String are allowed"
                        );
                    return t;
                })),
                    "r" == e || e === READONLY)
            )
                a = READONLY;
            else {
                if ("rw" != e && e != READWRITE)
                    throw new exceptions.InvalidArgument(
                        "Invalid transaction mode: " + e
                    );
                a = READWRITE;
            }
            if (r) {
                if (r.mode === READONLY && a === READWRITE) {
                    if (!i)
                        throw new exceptions.SubTransaction(
                            "Cannot enter a sub-transaction with READWRITE mode when parent transaction is READONLY"
                        );
                    r = null;
                }
                r &&
                    o.forEach((e) => {
                        if (r && -1 === r.storeNames.indexOf(e)) {
                            if (!i)
                                throw new exceptions.SubTransaction(
                                    "Table " + e + " not included in parent transaction."
                                );
                            r = null;
                        }
                    }),
                    i && r && !r.active && (r = null);
            }
        } catch (e) {
            return r
                ? r._promise(null, (t, n) => {
                    n(e);
                })
                : rejection(e);
        }
        const s = enterTransactionScope.bind(null, this, a, o, r, n);
        return r
            ? r._promise(a, s, "lock")
            : PSD.trans
                ? usePSD(PSD.transless, () => this._whenReady(s))
                : this._whenReady(s);
    }
    table(e) {
        if (!hasOwn(this._allTables, e))
            throw new exceptions.InvalidTable(`Table ${e} does not exist`);
        return this._allTables[e];
    }
}
const symbolObservable =
    "undefined" != typeof Symbol && "observable" in Symbol
        ? Symbol.observable
        : "@@observable";
class Observable {
    constructor(e) {
        this._subscribe = e;
    }
    subscribe(e, t, n) {
        return this._subscribe(
            e && "function" != typeof e ? e : { next: e, error: t, complete: n }
        );
    }
    [symbolObservable]() {
        return this;
    }
}
function extendObservabilitySet(e, t) {
    return (
        keys(t).forEach((n) => {
            mergeRanges(e[n] || (e[n] = new RangeSet()), t[n]);
        }),
        e
    );
}
function liveQuery(e) {
    let t,
        n = !1;
    const r = new Observable((r) => {
        const i = isAsyncFunction(e);
        let a = !1,
            o = {},
            s = {};
        const l = {
            get closed() {
                return a;
            },
            unsubscribe: () => {
                (a = !0), globalEvents.storagemutated.unsubscribe(d);
            },
        };
        r.start && r.start(l);
        let c = !1,
            u = !1;
        function h() {
            return keys(s).some((e) => o[e] && rangesOverlap(o[e], s[e]));
        }
        const d = (e) => {
            extendObservabilitySet(o, e), h() && p();
        },
            p = () => {
                if (c || a) return;
                o = {};
                const f = {},
                    y = (function (t) {
                        i && incrementExpectedAwaits();
                        const n = () => newScope(e, { subscr: t, trans: null }),
                            r = PSD.trans ? usePSD(PSD.transless, n) : n();
                        return (
                            i && r.then(decrementExpectedAwaits, decrementExpectedAwaits), r
                        );
                    })(f);
                u || (globalEvents("storagemutated", d), (u = !0)),
                    (c = !0),
                    Promise.resolve(y).then(
                        (e) => {
                            (n = !0),
                                (t = e),
                                (c = !1),
                                a || (h() ? p() : ((o = {}), (s = f), r.next && r.next(e)));
                        },
                        (e) => {
                            (c = !1), (n = !1), r.error && r.error(e), l.unsubscribe();
                        }
                    );
            };
        return p(), l;
    });
    return (r.hasValue = () => n), (r.getValue = () => t), r;
}
let domDeps;
try {
    domDeps = {
        indexedDB:
            _global.indexedDB ||
            _global.mozIndexedDB ||
            _global.webkitIndexedDB ||
            _global.msIndexedDB,
        IDBKeyRange: _global.IDBKeyRange || _global.webkitIDBKeyRange,
    };
} catch (e) {
    domDeps = { indexedDB: null, IDBKeyRange: null };
}
const Dexie = Dexie$1;
function propagateLocally(e) {
    let t = propagatingLocally;
    try {
        (propagatingLocally = !0), globalEvents.storagemutated.fire(e);
    } finally {
        propagatingLocally = t;
    }
}
props(Dexie, {
    ...fullNameExceptions,
    delete: (e) => new Dexie(e, { addons: [] }).delete(),
    exists: (e) =>
        new Dexie(e, { addons: [] })
            .open()
            .then((e) => (e.close(), !0))
            .catch("NoSuchDatabaseError", () => !1),
    getDatabaseNames(e) {
        try {
            return getDatabaseNames(Dexie.dependencies).then(e);
        } catch (e) {
            return rejection(new exceptions.MissingAPI());
        }
    },
    defineClass: () =>
        function (e) {
            extend(this, e);
        },
    ignoreTransaction: (e) => (PSD.trans ? usePSD(PSD.transless, e) : e()),
    vip: vip,
    async: function (e) {
        return function () {
            try {
                var t = awaitIterator(e.apply(this, arguments));
                return t && "function" == typeof t.then ? t : DexiePromise.resolve(t);
            } catch (e) {
                return rejection(e);
            }
        };
    },
    spawn: function (e, t, n) {
        try {
            var r = awaitIterator(e.apply(n, t || []));
            return r && "function" == typeof r.then ? r : DexiePromise.resolve(r);
        } catch (e) {
            return rejection(e);
        }
    },
    currentTransaction: { get: () => PSD.trans || null },
    waitFor: function (e, t) {
        const n = DexiePromise.resolve(
            "function" == typeof e ? Dexie.ignoreTransaction(e) : e
        ).timeout(t || 6e4);
        return PSD.trans ? PSD.trans.waitFor(n) : n;
    },
    Promise: DexiePromise,
    debug: {
        get: () => debug,
        set: (e) => {
            setDebug(e, "dexie" === e ? () => !0 : dexieStackFrameFilter);
        },
    },
    derive: derive,
    extend: extend,
    props: props,
    override: override,
    Events: Events,
    on: globalEvents,
    liveQuery: liveQuery,
    extendObservabilitySet: extendObservabilitySet,
    getByKeyPath: getByKeyPath,
    setByKeyPath: setByKeyPath,
    delByKeyPath: delByKeyPath,
    shallowClone: shallowClone,
    deepClone: deepClone,
    getObjectDiff: getObjectDiff,
    cmp: cmp,
    asap: asap$1,
    minKey: minKey,
    addons: [],
    connections: connections,
    errnames: errnames,
    dependencies: domDeps,
    semVer: "3.2.5",
    version: "3.2.5"
        .split(".")
        .map((e) => parseInt(e))
        .reduce((e, t, n) => e + t / Math.pow(10, 2 * n)),
}),
    (Dexie.maxKey = getMaxKey(Dexie.dependencies.IDBKeyRange)),
    "undefined" != typeof dispatchEvent &&
    "undefined" != typeof addEventListener &&
    (globalEvents("storagemutated", (e) => {
        if (!propagatingLocally) {
            let t;
            isIEOrEdge
                ? ((t = document.createEvent("CustomEvent")),
                    t.initCustomEvent("x-storagemutated-1", !0, !0, e))
                : (t = new CustomEvent("x-storagemutated-1", { detail: e })),
                (propagatingLocally = !0),
                dispatchEvent(t),
                (propagatingLocally = !1);
        }
    }),
        addEventListener("x-storagemutated-1", ({ detail: e }) => {
            propagatingLocally || propagateLocally(e);
        }));
let propagatingLocally = !1;
if ("undefined" != typeof BroadcastChannel) {
    const e = new BroadcastChannel("x-storagemutated-1");
    "function" == typeof e.unref && e.unref(),
        globalEvents("storagemutated", (t) => {
            propagatingLocally || e.postMessage(t);
        }),
        (e.onmessage = (e) => {
            e.data && propagateLocally(e.data);
        });
} else if ("undefined" != typeof self && "undefined" != typeof navigator) {
    globalEvents("storagemutated", (e) => {
        try {
            propagatingLocally ||
                ("undefined" != typeof localStorage &&
                    localStorage.setItem(
                        "x-storagemutated-1",
                        JSON.stringify({ trig: Math.random(), changedParts: e })
                    ),
                    "object" == typeof self.clients &&
                    [...self.clients.matchAll({ includeUncontrolled: !0 })].forEach((t) =>
                        t.postMessage({ type: "x-storagemutated-1", changedParts: e })
                    ));
        } catch (e) { }
    }),
        "undefined" != typeof addEventListener &&
        addEventListener("storage", (e) => {
            if ("x-storagemutated-1" === e.key) {
                const t = JSON.parse(e.newValue);
                t && propagateLocally(t.changedParts);
            }
        });
    const e = self.document && navigator.serviceWorker;
    e && e.addEventListener("message", propagateMessageLocally);
}
function propagateMessageLocally({ data: e }) {
    e && "x-storagemutated-1" === e.type && propagateLocally(e.changedParts);
}
(DexiePromise.rejectionMapper = mapError),
    setDebug(debug, dexieStackFrameFilter);
export {
    Dexie$1 as Dexie,
    RangeSet,
    Dexie$1 as default,
    liveQuery,
    mergeRanges,
    rangesOverlap,
};
