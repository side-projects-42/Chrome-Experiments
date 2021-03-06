/*!
 * Draggabilly PACKAGED v1.2.4
 * Make that shiz draggable
 * http://draggabilly.desandro.com
 * MIT license
 */

!(function (t) {
  function e() {}
  function n(t) {
    function n(e) {
      e.prototype.option ||
        (e.prototype.option = function (e) {
          t.isPlainObject(e) && (this.options = t.extend(!0, this.options, e));
        });
    }
    function o(e, n) {
      t.fn[e] = function (o) {
        if ("string" == typeof o) {
          for (
            var s = i.call(arguments, 1), a = 0, p = this.length;
            p > a;
            a++
          ) {
            var u = this[a],
              d = t.data(u, e);
            if (d)
              if (t.isFunction(d[o]) && "_" !== o.charAt(0)) {
                var c = d[o].apply(d, s);
                if (void 0 !== c) return c;
              } else r("no such method '" + o + "' for " + e + " instance");
            else
              r(
                "cannot call methods on " +
                  e +
                  " prior to initialization; attempted to call '" +
                  o +
                  "'"
              );
          }
          return this;
        }
        return this.each(function () {
          var i = t.data(this, e);
          i
            ? (i.option(o), i._init())
            : ((i = new n(this, o)), t.data(this, e, i));
        });
      };
    }
    if (t) {
      var r =
        "undefined" == typeof console
          ? e
          : function (t) {
              console.error(t);
            };
      return (
        (t.bridget = function (t, e) {
          n(e), o(t, e);
        }),
        t.bridget
      );
    }
  }
  var i = Array.prototype.slice;
  "function" == typeof define && define.amd
    ? define("jquery-bridget/jquery.bridget", ["jquery"], n)
    : n("object" == typeof exports ? require("jquery") : t.jQuery);
})(window),
  (function (t) {
    function e(t) {
      return new RegExp("(^|\\s+)" + t + "(\\s+|$)");
    }
    function n(t, e) {
      var n = i(t, e) ? r : o;
      n(t, e);
    }
    var i, o, r;
    "classList" in document.documentElement
      ? ((i = function (t, e) {
          return t.classList.contains(e);
        }),
        (o = function (t, e) {
          t.classList.add(e);
        }),
        (r = function (t, e) {
          t.classList.remove(e);
        }))
      : ((i = function (t, n) {
          return e(n).test(t.className);
        }),
        (o = function (t, e) {
          i(t, e) || (t.className = t.className + " " + e);
        }),
        (r = function (t, n) {
          t.className = t.className.replace(e(n), " ");
        }));
    var s = {
      hasClass: i,
      addClass: o,
      removeClass: r,
      toggleClass: n,
      has: i,
      add: o,
      remove: r,
      toggle: n,
    };
    "function" == typeof define && define.amd
      ? define("classie/classie", s)
      : "object" == typeof exports
      ? (module.exports = s)
      : (t.classie = s);
  })(window),
  (function (t) {
    function e(t) {
      if (t) {
        if ("string" == typeof i[t]) return t;
        t = t.charAt(0).toUpperCase() + t.slice(1);
        for (var e, o = 0, r = n.length; r > o; o++)
          if (((e = n[o] + t), "string" == typeof i[e])) return e;
      }
    }
    var n = "Webkit Moz ms Ms O".split(" "),
      i = document.documentElement.style;
    "function" == typeof define && define.amd
      ? define("get-style-property/get-style-property", [], function () {
          return e;
        })
      : "object" == typeof exports
      ? (module.exports = e)
      : (t.getStyleProperty = e);
  })(window),
  (function (t) {
    function e(t) {
      var e = parseFloat(t),
        n = -1 === t.indexOf("%") && !isNaN(e);
      return n && e;
    }
    function n() {}
    function i() {
      for (
        var t = {
            width: 0,
            height: 0,
            innerWidth: 0,
            innerHeight: 0,
            outerWidth: 0,
            outerHeight: 0,
          },
          e = 0,
          n = s.length;
        n > e;
        e++
      ) {
        var i = s[e];
        t[i] = 0;
      }
      return t;
    }
    function o(n) {
      function o() {
        if (!h) {
          h = !0;
          var i = t.getComputedStyle;
          if (
            ((u = (function () {
              var t = i
                ? function (t) {
                    return i(t, null);
                  }
                : function (t) {
                    return t.currentStyle;
                  };
              return function (e) {
                var n = t(e);
                return (
                  n ||
                    r(
                      "Style returned " +
                        n +
                        ". Are you running this code in a hidden iframe on Firefox? See http://bit.ly/getsizebug1"
                    ),
                  n
                );
              };
            })()),
            (d = n("boxSizing")))
          ) {
            var o = document.createElement("div");
            (o.style.width = "200px"),
              (o.style.padding = "1px 2px 3px 4px"),
              (o.style.borderStyle = "solid"),
              (o.style.borderWidth = "1px 2px 3px 4px"),
              (o.style[d] = "border-box");
            var s = document.body || document.documentElement;
            s.appendChild(o);
            var a = u(o);
            (c = 200 === e(a.width)), s.removeChild(o);
          }
        }
      }
      function a(t) {
        if (
          (o(),
          "string" == typeof t && (t = document.querySelector(t)),
          t && "object" == typeof t && t.nodeType)
        ) {
          var n = u(t);
          if ("none" === n.display) return i();
          var r = {};
          (r.width = t.offsetWidth), (r.height = t.offsetHeight);
          for (
            var a = (r.isBorderBox = !(!d || !n[d] || "border-box" !== n[d])),
              h = 0,
              f = s.length;
            f > h;
            h++
          ) {
            var l = s[h],
              g = n[l];
            g = p(t, g);
            var v = parseFloat(g);
            r[l] = isNaN(v) ? 0 : v;
          }
          var y = r.paddingLeft + r.paddingRight,
            m = r.paddingTop + r.paddingBottom,
            E = r.marginLeft + r.marginRight,
            b = r.marginTop + r.marginBottom,
            P = r.borderLeftWidth + r.borderRightWidth,
            x = r.borderTopWidth + r.borderBottomWidth,
            _ = a && c,
            w = e(n.width);
          w !== !1 && (r.width = w + (_ ? 0 : y + P));
          var S = e(n.height);
          return (
            S !== !1 && (r.height = S + (_ ? 0 : m + x)),
            (r.innerWidth = r.width - (y + P)),
            (r.innerHeight = r.height - (m + x)),
            (r.outerWidth = r.width + E),
            (r.outerHeight = r.height + b),
            r
          );
        }
      }
      function p(e, n) {
        if (t.getComputedStyle || -1 === n.indexOf("%")) return n;
        var i = e.style,
          o = i.left,
          r = e.runtimeStyle,
          s = r && r.left;
        return (
          s && (r.left = e.currentStyle.left),
          (i.left = n),
          (n = i.pixelLeft),
          (i.left = o),
          s && (r.left = s),
          n
        );
      }
      var u,
        d,
        c,
        h = !1;
      return a;
    }
    var r =
        "undefined" == typeof console
          ? n
          : function (t) {
              console.error(t);
            },
      s = [
        "paddingLeft",
        "paddingRight",
        "paddingTop",
        "paddingBottom",
        "marginLeft",
        "marginRight",
        "marginTop",
        "marginBottom",
        "borderLeftWidth",
        "borderRightWidth",
        "borderTopWidth",
        "borderBottomWidth",
      ];
    "function" == typeof define && define.amd
      ? define(
          "get-size/get-size",
          ["get-style-property/get-style-property"],
          o
        )
      : "object" == typeof exports
      ? (module.exports = o(require("desandro-get-style-property")))
      : (t.getSize = o(t.getStyleProperty));
  })(window),
  (function (t) {
    function e(e) {
      var n = t.event;
      return (n.target = n.target || n.srcElement || e), n;
    }
    var n = document.documentElement,
      i = function () {};
    n.addEventListener
      ? (i = function (t, e, n) {
          t.addEventListener(e, n, !1);
        })
      : n.attachEvent &&
        (i = function (t, n, i) {
          (t[n + i] = i.handleEvent
            ? function () {
                var n = e(t);
                i.handleEvent.call(i, n);
              }
            : function () {
                var n = e(t);
                i.call(t, n);
              }),
            t.attachEvent("on" + n, t[n + i]);
        });
    var o = function () {};
    n.removeEventListener
      ? (o = function (t, e, n) {
          t.removeEventListener(e, n, !1);
        })
      : n.detachEvent &&
        (o = function (t, e, n) {
          t.detachEvent("on" + e, t[e + n]);
          try {
            delete t[e + n];
          } catch (i) {
            t[e + n] = void 0;
          }
        });
    var r = { bind: i, unbind: o };
    "function" == typeof define && define.amd
      ? define("eventie/eventie", r)
      : "object" == typeof exports
      ? (module.exports = r)
      : (t.eventie = r);
  })(window),
  function () {
    function t() {}
    function e(t, e) {
      for (var n = t.length; n--; ) if (t[n].listener === e) return n;
      return -1;
    }
    function n(t) {
      return function () {
        return this[t].apply(this, arguments);
      };
    }
    var i = t.prototype,
      o = this,
      r = o.EventEmitter;
    (i.getListeners = function (t) {
      var e,
        n,
        i = this._getEvents();
      if (t instanceof RegExp) {
        e = {};
        for (n in i) i.hasOwnProperty(n) && t.test(n) && (e[n] = i[n]);
      } else e = i[t] || (i[t] = []);
      return e;
    }),
      (i.flattenListeners = function (t) {
        var e,
          n = [];
        for (e = 0; e < t.length; e += 1) n.push(t[e].listener);
        return n;
      }),
      (i.getListenersAsObject = function (t) {
        var e,
          n = this.getListeners(t);
        return n instanceof Array && ((e = {}), (e[t] = n)), e || n;
      }),
      (i.addListener = function (t, n) {
        var i,
          o = this.getListenersAsObject(t),
          r = "object" == typeof n;
        for (i in o)
          o.hasOwnProperty(i) &&
            -1 === e(o[i], n) &&
            o[i].push(r ? n : { listener: n, once: !1 });
        return this;
      }),
      (i.on = n("addListener")),
      (i.addOnceListener = function (t, e) {
        return this.addListener(t, { listener: e, once: !0 });
      }),
      (i.once = n("addOnceListener")),
      (i.defineEvent = function (t) {
        return this.getListeners(t), this;
      }),
      (i.defineEvents = function (t) {
        for (var e = 0; e < t.length; e += 1) this.defineEvent(t[e]);
        return this;
      }),
      (i.removeListener = function (t, n) {
        var i,
          o,
          r = this.getListenersAsObject(t);
        for (o in r)
          r.hasOwnProperty(o) &&
            ((i = e(r[o], n)), -1 !== i && r[o].splice(i, 1));
        return this;
      }),
      (i.off = n("removeListener")),
      (i.addListeners = function (t, e) {
        return this.manipulateListeners(!1, t, e);
      }),
      (i.removeListeners = function (t, e) {
        return this.manipulateListeners(!0, t, e);
      }),
      (i.manipulateListeners = function (t, e, n) {
        var i,
          o,
          r = t ? this.removeListener : this.addListener,
          s = t ? this.removeListeners : this.addListeners;
        if ("object" != typeof e || e instanceof RegExp)
          for (i = n.length; i--; ) r.call(this, e, n[i]);
        else
          for (i in e)
            e.hasOwnProperty(i) &&
              (o = e[i]) &&
              ("function" == typeof o
                ? r.call(this, i, o)
                : s.call(this, i, o));
        return this;
      }),
      (i.removeEvent = function (t) {
        var e,
          n = typeof t,
          i = this._getEvents();
        if ("string" === n) delete i[t];
        else if (t instanceof RegExp)
          for (e in i) i.hasOwnProperty(e) && t.test(e) && delete i[e];
        else delete this._events;
        return this;
      }),
      (i.removeAllListeners = n("removeEvent")),
      (i.emitEvent = function (t, e) {
        var n,
          i,
          o,
          r,
          s = this.getListenersAsObject(t);
        for (o in s)
          if (s.hasOwnProperty(o))
            for (i = s[o].length; i--; )
              (n = s[o][i]),
                n.once === !0 && this.removeListener(t, n.listener),
                (r = n.listener.apply(this, e || [])),
                r === this._getOnceReturnValue() &&
                  this.removeListener(t, n.listener);
        return this;
      }),
      (i.trigger = n("emitEvent")),
      (i.emit = function (t) {
        var e = Array.prototype.slice.call(arguments, 1);
        return this.emitEvent(t, e);
      }),
      (i.setOnceReturnValue = function (t) {
        return (this._onceReturnValue = t), this;
      }),
      (i._getOnceReturnValue = function () {
        return this.hasOwnProperty("_onceReturnValue")
          ? this._onceReturnValue
          : !0;
      }),
      (i._getEvents = function () {
        return this._events || (this._events = {});
      }),
      (t.noConflict = function () {
        return (o.EventEmitter = r), t;
      }),
      "function" == typeof define && define.amd
        ? define("eventEmitter/EventEmitter", [], function () {
            return t;
          })
        : "object" == typeof module && module.exports
        ? (module.exports = t)
        : (o.EventEmitter = t);
  }.call(this),
  (function (t, e) {
    "function" == typeof define && define.amd
      ? define(
          "unipointer/unipointer",
          ["eventEmitter/EventEmitter", "eventie/eventie"],
          function (n, i) {
            return e(t, n, i);
          }
        )
      : "object" == typeof exports
      ? (module.exports = e(
          t,
          require("wolfy87-eventemitter"),
          require("eventie")
        ))
      : (t.Unipointer = e(t, t.EventEmitter, t.eventie));
  })(window, function (t, e, n) {
    function i() {}
    function o() {}
    (o.prototype = new e()),
      (o.prototype.bindStartEvent = function (t) {
        this._bindStartEvent(t, !0);
      }),
      (o.prototype.unbindStartEvent = function (t) {
        this._bindStartEvent(t, !1);
      }),
      (o.prototype._bindStartEvent = function (e, i) {
        i = void 0 === i ? !0 : !!i;
        var o = i ? "bind" : "unbind";
        t.navigator.pointerEnabled
          ? n[o](e, "pointerdown", this)
          : t.navigator.msPointerEnabled
          ? n[o](e, "MSPointerDown", this)
          : (n[o](e, "mousedown", this), n[o](e, "touchstart", this));
      }),
      (o.prototype.handleEvent = function (t) {
        var e = "on" + t.type;
        this[e] && this[e](t);
      }),
      (o.prototype.getTouch = function (t) {
        for (var e = 0, n = t.length; n > e; e++) {
          var i = t[e];
          if (i.identifier == this.pointerIdentifier) return i;
        }
      }),
      (o.prototype.onmousedown = function (t) {
        var e = t.button;
        (e && 0 !== e && 1 !== e) || this._pointerDown(t, t);
      }),
      (o.prototype.ontouchstart = function (t) {
        this._pointerDown(t, t.changedTouches[0]);
      }),
      (o.prototype.onMSPointerDown = o.prototype.onpointerdown =
        function (t) {
          this._pointerDown(t, t);
        }),
      (o.prototype._pointerDown = function (t, e) {
        this.isPointerDown ||
          ((this.isPointerDown = !0),
          (this.pointerIdentifier =
            void 0 !== e.pointerId ? e.pointerId : e.identifier),
          this.pointerDown(t, e));
      }),
      (o.prototype.pointerDown = function (t, e) {
        this._bindPostStartEvents(t), this.emitEvent("pointerDown", [t, e]);
      });
    var r = {
      mousedown: ["mousemove", "mouseup"],
      touchstart: ["touchmove", "touchend", "touchcancel"],
      pointerdown: ["pointermove", "pointerup", "pointercancel"],
      MSPointerDown: ["MSPointerMove", "MSPointerUp", "MSPointerCancel"],
    };
    return (
      (o.prototype._bindPostStartEvents = function (e) {
        if (e) {
          for (
            var i = r[e.type],
              o = e.preventDefault ? t : document,
              s = 0,
              a = i.length;
            a > s;
            s++
          ) {
            var p = i[s];
            n.bind(o, p, this);
          }
          this._boundPointerEvents = { events: i, node: o };
        }
      }),
      (o.prototype._unbindPostStartEvents = function () {
        var t = this._boundPointerEvents;
        if (t && t.events) {
          for (var e = 0, i = t.events.length; i > e; e++) {
            var o = t.events[e];
            n.unbind(t.node, o, this);
          }
          delete this._boundPointerEvents;
        }
      }),
      (o.prototype.onmousemove = function (t) {
        this._pointerMove(t, t);
      }),
      (o.prototype.onMSPointerMove = o.prototype.onpointermove =
        function (t) {
          t.pointerId == this.pointerIdentifier && this._pointerMove(t, t);
        }),
      (o.prototype.ontouchmove = function (t) {
        var e = this.getTouch(t.changedTouches);
        e && this._pointerMove(t, e);
      }),
      (o.prototype._pointerMove = function (t, e) {
        this.pointerMove(t, e);
      }),
      (o.prototype.pointerMove = function (t, e) {
        this.emitEvent("pointerMove", [t, e]);
      }),
      (o.prototype.onmouseup = function (t) {
        this._pointerUp(t, t);
      }),
      (o.prototype.onMSPointerUp = o.prototype.onpointerup =
        function (t) {
          t.pointerId == this.pointerIdentifier && this._pointerUp(t, t);
        }),
      (o.prototype.ontouchend = function (t) {
        var e = this.getTouch(t.changedTouches);
        e && this._pointerUp(t, e);
      }),
      (o.prototype._pointerUp = function (t, e) {
        this._pointerDone(), this.pointerUp(t, e);
      }),
      (o.prototype.pointerUp = function (t, e) {
        this.emitEvent("pointerUp", [t, e]);
      }),
      (o.prototype._pointerDone = function () {
        (this.isPointerDown = !1),
          delete this.pointerIdentifier,
          this._unbindPostStartEvents(),
          this.pointerDone();
      }),
      (o.prototype.pointerDone = i),
      (o.prototype.onMSPointerCancel = o.prototype.onpointercancel =
        function (t) {
          t.pointerId == this.pointerIdentifier && this._pointerCancel(t, t);
        }),
      (o.prototype.ontouchcancel = function (t) {
        var e = this.getTouch(t.changedTouches);
        e && this._pointerCancel(t, e);
      }),
      (o.prototype._pointerCancel = function (t, e) {
        this._pointerDone(), this.pointerCancel(t, e);
      }),
      (o.prototype.pointerCancel = function (t, e) {
        this.emitEvent("pointerCancel", [t, e]);
      }),
      (o.getPointerPoint = function (t) {
        return {
          x: void 0 !== t.pageX ? t.pageX : t.clientX,
          y: void 0 !== t.pageY ? t.pageY : t.clientY,
        };
      }),
      o
    );
  }),
  (function (t, e) {
    "function" == typeof define && define.amd
      ? define(
          "unidragger/unidragger",
          ["eventie/eventie", "unipointer/unipointer"],
          function (n, i) {
            return e(t, n, i);
          }
        )
      : "object" == typeof exports
      ? (module.exports = e(t, require("eventie"), require("unipointer")))
      : (t.Unidragger = e(t, t.eventie, t.Unipointer));
  })(window, function (t, e, n) {
    function i() {}
    function o(t) {
      t.preventDefault ? t.preventDefault() : (t.returnValue = !1);
    }
    function r(t) {
      for (; t != document.body; )
        if (((t = t.parentNode), "A" == t.nodeName)) return t;
    }
    function s() {}
    function a() {
      return !1;
    }
    (s.prototype = new n()),
      (s.prototype.bindHandles = function () {
        this._bindHandles(!0);
      }),
      (s.prototype.unbindHandles = function () {
        this._bindHandles(!1);
      });
    var p = t.navigator;
    s.prototype._bindHandles = function (t) {
      t = void 0 === t ? !0 : !!t;
      var n;
      n = p.pointerEnabled
        ? function (e) {
            e.style.touchAction = t ? "none" : "";
          }
        : p.msPointerEnabled
        ? function (e) {
            e.style.msTouchAction = t ? "none" : "";
          }
        : function () {
            t && d(s);
          };
      for (
        var i = t ? "bind" : "unbind", o = 0, r = this.handles.length;
        r > o;
        o++
      ) {
        var s = this.handles[o];
        this._bindStartEvent(s, t), n(s), e[i](s, "click", this);
      }
    };
    var u = "attachEvent" in document.documentElement,
      d = u
        ? function (t) {
            "IMG" == t.nodeName && (t.ondragstart = a);
            for (
              var e = t.querySelectorAll("img"), n = 0, i = e.length;
              i > n;
              n++
            ) {
              var o = e[n];
              o.ondragstart = a;
            }
          }
        : i,
      c = (s.allowTouchstartNodes = {
        INPUT: !0,
        A: !0,
        BUTTON: !0,
        SELECT: !0,
      });
    return (
      (s.prototype.pointerDown = function (t, e) {
        this._dragPointerDown(t, e);
        var n = document.activeElement;
        n && n.blur && n.blur(),
          this._bindPostStartEvents(t),
          this.emitEvent("pointerDown", [t, e]);
      }),
      (s.prototype._dragPointerDown = function (t, e) {
        this.pointerDownPoint = n.getPointerPoint(e);
        var i = t.target.nodeName,
          s = "touchstart" == t.type && (c[i] || r(t.target));
        s || "SELECT" == i || o(t);
      }),
      (s.prototype.pointerMove = function (t, e) {
        var n = this._dragPointerMove(t, e);
        this.emitEvent("pointerMove", [t, e, n]), this._dragMove(t, e, n);
      }),
      (s.prototype._dragPointerMove = function (t, e) {
        var i = n.getPointerPoint(e),
          o = {
            x: i.x - this.pointerDownPoint.x,
            y: i.y - this.pointerDownPoint.y,
          };
        return (
          !this.isDragging && this.hasDragStarted(o) && this._dragStart(t, e), o
        );
      }),
      (s.prototype.hasDragStarted = function (t) {
        return Math.abs(t.x) > 3 || Math.abs(t.y) > 3;
      }),
      (s.prototype.pointerUp = function (t, e) {
        this.emitEvent("pointerUp", [t, e]), this._dragPointerUp(t, e);
      }),
      (s.prototype._dragPointerUp = function (t, e) {
        this.isDragging ? this._dragEnd(t, e) : this._staticClick(t, e);
      }),
      (s.prototype._dragStart = function (t, e) {
        (this.isDragging = !0),
          (this.dragStartPoint = s.getPointerPoint(e)),
          (this.isPreventingClicks = !0),
          this.dragStart(t, e);
      }),
      (s.prototype.dragStart = function (t, e) {
        this.emitEvent("dragStart", [t, e]);
      }),
      (s.prototype._dragMove = function (t, e, n) {
        this.isDragging && this.dragMove(t, e, n);
      }),
      (s.prototype.dragMove = function (t, e, n) {
        this.emitEvent("dragMove", [t, e, n]);
      }),
      (s.prototype._dragEnd = function (t, e) {
        this.isDragging = !1;
        var n = this;
        setTimeout(function () {
          delete n.isPreventingClicks;
        }),
          this.dragEnd(t, e);
      }),
      (s.prototype.dragEnd = function (t, e) {
        this.emitEvent("dragEnd", [t, e]);
      }),
      (s.prototype.onclick = function (t) {
        this.isPreventingClicks && o(t);
      }),
      (s.prototype._staticClick = function (t, e) {
        "INPUT" == t.target.nodeName &&
          "text" == t.target.type &&
          t.target.focus(),
          this.staticClick(t, e);
      }),
      (s.prototype.staticClick = function (t, e) {
        this.emitEvent("staticClick", [t, e]);
      }),
      (s.getPointerPoint = function (t) {
        return {
          x: void 0 !== t.pageX ? t.pageX : t.clientX,
          y: void 0 !== t.pageY ? t.pageY : t.clientY,
        };
      }),
      (s.getPointerPoint = n.getPointerPoint),
      s
    );
  }),
  (function (t, e) {
    "function" == typeof define && define.amd
      ? define(
          [
            "classie/classie",
            "get-style-property/get-style-property",
            "get-size/get-size",
            "unidragger/unidragger",
          ],
          function (n, i, o, r) {
            return e(t, n, i, o, r);
          }
        )
      : "object" == typeof exports
      ? (module.exports = e(
          t,
          require("desandro-classie"),
          require("desandro-get-style-property"),
          require("get-size"),
          require("unidragger")
        ))
      : (t.Draggabilly = e(
          t,
          t.classie,
          t.getStyleProperty,
          t.getSize,
          t.Unidragger
        ));
  })(window, function (t, e, n, i, o) {
    function r() {}
    function s(t, e) {
      for (var n in e) t[n] = e[n];
      return t;
    }
    function a(t, e) {
      (this.element = "string" == typeof t ? d.querySelector(t) : t),
        P && (this.$element = P(this.element)),
        (this.options = s({}, this.constructor.defaults)),
        this.option(e),
        this._create();
    }
    function p(t, e, n) {
      return (n = n || "round"), e ? Math[n](t / e) * e : t;
    }
    for (
      var u,
        d = t.document,
        c = d.defaultView,
        h =
          c && c.getComputedStyle
            ? function (t) {
                return c.getComputedStyle(t, null);
              }
            : function (t) {
                return t.currentStyle;
              },
        f =
          "object" == typeof HTMLElement
            ? function (t) {
                return t instanceof HTMLElement;
              }
            : function (t) {
                return (
                  t &&
                  "object" == typeof t &&
                  1 == t.nodeType &&
                  "string" == typeof t.nodeName
                );
              },
        l = 0,
        g = "webkit moz ms o".split(" "),
        v = t.requestAnimationFrame,
        y = t.cancelAnimationFrame,
        m = 0;
      m < g.length && (!v || !y);
      m++
    )
      (u = g[m]),
        (v = v || t[u + "RequestAnimationFrame"]),
        (y =
          y ||
          t[u + "CancelAnimationFrame"] ||
          t[u + "CancelRequestAnimationFrame"]);
    (v && y) ||
      ((v = function (e) {
        var n = new Date().getTime(),
          i = Math.max(0, 16 - (n - l)),
          o = t.setTimeout(function () {
            e(n + i);
          }, i);
        return (l = n + i), o;
      }),
      (y = function (e) {
        t.clearTimeout(e);
      }));
    var E = n("transform"),
      b = !!n("perspective"),
      P = t.jQuery;
    s(a.prototype, o.prototype),
      (a.defaults = {}),
      (a.prototype.option = function (t) {
        s(this.options, t);
      }),
      (a.prototype._create = function () {
        (this.position = {}),
          this._getPosition(),
          (this.startPoint = { x: 0, y: 0 }),
          (this.dragPoint = { x: 0, y: 0 }),
          (this.startPosition = s({}, this.position));
        var t = h(this.element);
        "relative" != t.position &&
          "absolute" != t.position &&
          (this.element.style.position = "relative"),
          this.enable(),
          this.setHandles();
      }),
      (a.prototype.setHandles = function () {
        (this.handles = this.options.handle
          ? this.element.querySelectorAll(this.options.handle)
          : [this.element]),
          this.bindHandles();
      }),
      (a.prototype.dispatchEvent = function (e, n, i) {
        var o = [n].concat(i);
        this.emitEvent(e, o);
        var r = t.jQuery;
        if (r && this.$element)
          if (n) {
            var s = r.Event(n);
            (s.type = e), this.$element.trigger(s, i);
          } else this.$element.trigger(e, i);
      }),
      (a.prototype._getPosition = function () {
        var t = h(this.element),
          e = parseInt(t.left, 10),
          n = parseInt(t.top, 10);
        (this.position.x = isNaN(e) ? 0 : e),
          (this.position.y = isNaN(n) ? 0 : n),
          this._addTransformPosition(t);
      }),
      (a.prototype._addTransformPosition = function (t) {
        if (E) {
          var e = t[E];
          if (0 === e.indexOf("matrix")) {
            var n = e.split(","),
              i = 0 === e.indexOf("matrix3d") ? 12 : 4,
              o = parseInt(n[i], 10),
              r = parseInt(n[i + 1], 10);
            (this.position.x += o), (this.position.y += r);
          }
        }
      }),
      (a.prototype.pointerDown = function (t, n) {
        this._dragPointerDown(t, n);
        var i = d.activeElement;
        i && i.blur && i.blur(),
          this._bindPostStartEvents(t),
          e.add(this.element, "is-pointer-down"),
          this.dispatchEvent("pointerDown", t, [n]);
      }),
      (a.prototype.pointerMove = function (t, e) {
        var n = this._dragPointerMove(t, e);
        this.dispatchEvent("pointerMove", t, [e, n]), this._dragMove(t, e, n);
      }),
      (a.prototype.dragStart = function (t, n) {
        this.isEnabled &&
          (this._getPosition(),
          this.measureContainment(),
          (this.startPosition.x = this.position.x),
          (this.startPosition.y = this.position.y),
          this.setLeftTop(),
          (this.dragPoint.x = 0),
          (this.dragPoint.y = 0),
          (this.isDragging = !0),
          e.add(this.element, "is-dragging"),
          this.dispatchEvent("dragStart", t, [n]),
          this.animate());
      }),
      (a.prototype.measureContainment = function () {
        var t = this.options.containment;
        if (t) {
          this.size = i(this.element);
          var e = this.element.getBoundingClientRect(),
            n = f(t)
              ? t
              : "string" == typeof t
              ? d.querySelector(t)
              : this.element.parentNode;
          this.containerSize = i(n);
          var o = n.getBoundingClientRect();
          this.relativeStartPosition = { x: e.left - o.left, y: e.top - o.top };
        }
      }),
      (a.prototype.dragMove = function (t, e, n) {
        if (this.isEnabled) {
          var i = n.x,
            o = n.y,
            r = this.options.grid,
            s = r && r[0],
            a = r && r[1];
          (i = p(i, s)),
            (o = p(o, a)),
            (i = this.containDrag("x", i, s)),
            (o = this.containDrag("y", o, a)),
            (i = "y" == this.options.axis ? 0 : i),
            (o = "x" == this.options.axis ? 0 : o),
            (this.position.x = this.startPosition.x + i),
            (this.position.y = this.startPosition.y + o),
            (this.dragPoint.x = i),
            (this.dragPoint.y = o),
            this.dispatchEvent("dragMove", t, [e, n]);
        }
      }),
      (a.prototype.containDrag = function (t, e, n) {
        if (!this.options.containment) return e;
        var i = "x" == t ? "width" : "height",
          o = this.relativeStartPosition[t],
          r = p(-o, n, "ceil"),
          s = this.containerSize[i] - o - this.size[i];
        return (s = p(s, n, "floor")), Math.min(s, Math.max(r, e));
      }),
      (a.prototype.pointerUp = function (t, n) {
        e.remove(this.element, "is-pointer-down"),
          this.dispatchEvent("pointerUp", t, [n]),
          this._dragPointerUp(t, n);
      }),
      (a.prototype.dragEnd = function (t, n) {
        this.isEnabled &&
          ((this.isDragging = !1),
          E && ((this.element.style[E] = ""), this.setLeftTop()),
          e.remove(this.element, "is-dragging"),
          this.dispatchEvent("dragEnd", t, [n]));
      }),
      (a.prototype.animate = function () {
        if (this.isDragging) {
          this.positionDrag();
          var t = this;
          v(function () {
            t.animate();
          });
        }
      });
    var x = b
      ? function (t, e) {
          return "translate3d( " + t + "px, " + e + "px, 0)";
        }
      : function (t, e) {
          return "translate( " + t + "px, " + e + "px)";
        };
    return (
      (a.prototype.setLeftTop = function () {
        (this.element.style.left = this.position.x + "px"),
          (this.element.style.top = this.position.y + "px");
      }),
      (a.prototype.positionDrag = E
        ? function () {
            this.element.style[E] = x(this.dragPoint.x, this.dragPoint.y);
          }
        : a.prototype.setLeftTop),
      (a.prototype.staticClick = function (t, e) {
        this.dispatchEvent("staticClick", t, [e]);
      }),
      (a.prototype.enable = function () {
        this.isEnabled = !0;
      }),
      (a.prototype.disable = function () {
        (this.isEnabled = !1), this.isDragging && this.dragEnd();
      }),
      (a.prototype.destroy = function () {
        this.disable(),
          E && (this.element.style[E] = ""),
          (this.element.style.left = ""),
          (this.element.style.top = ""),
          (this.element.style.position = ""),
          this.unbindHandles(),
          this.$element && this.$element.removeData("draggabilly");
      }),
      (a.prototype._init = r),
      P && P.bridget && P.bridget("draggabilly", a),
      a
    );
  });
