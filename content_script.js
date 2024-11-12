!(function () {
    "use strict";
    const e = [
        "copy",
        "paste",
        "cut",
        "contextmenu",
        "keyup",
        "keypress",
        "keydown",
        "auxclick",
    ];
    location.pathname.includes("GDB/StudentMessage.aspx") ||
        ((Node.prototype._addEventListener = Node.prototype.addEventListener),
            (Node.prototype._removeEventListener = Node.prototype.removeEventListener),
            (Node.prototype.addEventListener = function (t, n, i = !1) {
                if (!e.includes(t.toLowerCase()))
                    return this._addEventListener.apply(this, arguments);
                const s = new AbortController();
                let r = {};
                "boolean" == typeof i ? (r.capture = i) : "object" == typeof i && (r = i),
                    (r.signal = s.signal),
                    this._addEventListener(t, n, r),
                    this.eventListenerList || (this.eventListenerList = {}),
                    this.eventListenerList[t] || (this.eventListenerList[t] = []),
                    this.eventListenerList[t].push({
                        type: t,
                        listener: n,
                        opts: r,
                        controller: s,
                    });
            }),
            (Node.prototype.removeEventListener = function (t, n, i = !1) {
                if (!e.includes(t.toLowerCase()))
                    return this._removeEventListener.apply(this, arguments);
                this._removeEventListener(t, n, i),
                    this.eventListenerList || (this.eventListenerList = {}),
                    this.eventListenerList[t] || (this.eventListenerList[t] = []);
                for (let e = 0; e < this.eventListenerList[t].length; e++)
                    if (
                        this.eventListenerList[t][e].listener === n &&
                        this.eventListenerList[t][e].opts.capture === i
                    ) {
                        this.eventListenerList[t].splice(e, 1);
                        break;
                    }
                0 == this.eventListenerList[t].length && delete this.eventListenerList[t];
            }),
            (Node.prototype._getEventListeners = function (e) {
                this.eventListenerList || (this.eventListenerList = {});
                for (const e in this) {
                    if (!e.startsWith("on") || "function" != typeof this[e]) continue;
                    let t = e.replace(/^on/, "").toLowerCase();
                    if (
                        (Array.isArray(this.eventListenerList[t]) ||
                            (this.eventListenerList[t] = []),
                            this.eventListenerList[t].some((e) => e.local))
                    )
                        continue;
                    const n = this,
                        i = this[e],
                        s = new AbortController();
                    s.signal.addEventListener(
                        "abort",
                        () => {
                            n.removeEventListener(t, i),
                                "function" == typeof n.removeAttribute && n.removeAttribute(e),
                                n[e] === i && (n[e] = null);
                        },
                        { once: !0 }
                    ),
                        this.eventListenerList[t].push({
                            type: t,
                            listener: i,
                            local: !0,
                            opts: { capture: !1, signal: s.signal },
                            controller: s,
                        });
                }
                return void 0 === e ? this.eventListenerList : this.eventListenerList[e];
            }));
})(),
    (function () {
        "use strict";
        if (!location.pathname.includes("GDB/StudentMessage.aspx")) return;
        const e = document.createElement("input");
        (e.type = "hidden"),
            (e.name = "hfAllowCopyPaste"),
            (e.id = "hfAllowCopyPaste"),
            (e.value = "1"),
            (document.body ?? document.head ?? document.documentElement)?.prepend(e);
    })(),
    (function () {
        "use strict";
        if (location.pathname.includes("GDB/StudentMessage.aspx")) return;
        const e =
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:125.0) Gecko/20100101 Firefox/125.0",
            t = 125,
            n = "Firefox",
            i = !1,
            s = "Windows",
            r = "x86",
            o = "64",
            a = "10.0.0";
        Object.defineProperty(Navigator.prototype, "userAgent", {
            get: function () {
                return e;
            },
        }),
            (self.NavigatorUAData =
                self.NavigatorUAData ||
                new (class {
                    brands = [];
                    mobile = !1;
                    platform = "Unknown";
                    toJSON() {
                        return {};
                    }
                    getHighEntropyValues() {
                        return Promise.resolve({});
                    }
                })()),
            Object.defineProperty(self.NavigatorUAData.prototype, "brands", {
                get: function () {
                    return [
                        { brand: n, version: t },
                        { brand: "Chromium", version: t },
                        { brand: "Not=A?Brand", version: "24" },
                    ];
                },
            }),
            Object.defineProperty(self.NavigatorUAData.prototype, "mobile", {
                get: function () {
                    return i;
                },
            }),
            Object.defineProperty(self.NavigatorUAData.prototype, "platform", {
                get: function () {
                    return s;
                },
            }),
            (self.NavigatorUAData.prototype.toJSON = new Proxy(
                self.NavigatorUAData.prototype.toJSON,
                {
                    apply: (e, t, n) => ({
                        brands: t.brands,
                        mobile: t.mobile,
                        platform: t.platform,
                    }),
                }
            )),
            (self.NavigatorUAData.prototype.getHighEntropyValues = new Proxy(
                self.NavigatorUAData.prototype.getHighEntropyValues,
                {
                    apply(e, t, n) {
                        const i = n[0];
                        if (!i || !1 === Array.isArray(i))
                            return Promise.reject(
                                Error(
                                    "Failed to execute 'getHighEntropyValues' on 'NavigatorUAData'"
                                )
                            );
                        const s = t.toJSON();
                        return (
                            i.includes("architecture") && (s.architecture = r),
                            i.includes("bitness") && (s.bitness = o),
                            i.includes("model") && (s.model = ""),
                            i.includes("platformVersion") && (s.platformVersion = a),
                            i.includes("uaFullVersion") &&
                            (s.uaFullVersion = t.brands[0].version),
                            i.includes("fullVersionList") &&
                            (s.fullVersionList = this.brands),
                            Promise.resolve(s)
                        );
                    },
                }
            ));
    })();
