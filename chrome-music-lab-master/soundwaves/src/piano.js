!(function (t, e) {
  "object" == typeof exports && "object" == typeof module
    ? (module.exports = e())
    : "function" == typeof define && define.amd
    ? define([], e)
    : "object" == typeof exports
    ? (exports.Piano = e())
    : (t.Piano = e());
})(this, function () {
  return (function (t) {
    function e(n) {
      if (i[n]) return i[n].exports;
      var o = (i[n] = { exports: {}, id: n, loaded: !1 });
      return t[n].call(o.exports, o, o.exports, e), (o.loaded = !0), o.exports;
    }
    var i = {};
    return (e.m = t), (e.c = i), (e.p = ""), e(0);
  })([
    function (t, e, i) {
      var n, o;
      (n = [i(6), i(5), i(7), i(1)]),
        (o = function (t, e, i, n) {
          var o = {
              "C#": "Db",
              "D#": "Eb",
              "F#": "Gb",
              "G#": "Ab",
              "A#": "Bb",
            },
            s = function (t, e, i) {
              (this._canvas = document.createElement("canvas")),
                (this._canvas.id = "PianoKeyboard"),
                t.appendChild(this._canvas),
                (this._context = this._canvas.getContext("2d")),
                (this._container = t),
                (this._startNote = e || "C4"),
                (this._endNote = i || "C6"),
                (this._notes = []),
                (this._noteNames = {}),
                (this._isMouseDown = !1),
                (this._touchDragged = !1),
                (this._contextStarted = !1),
                (this._highlightedKeys = []),
                (this._highlightColor = "#FFB729"),
                this._container.addEventListener(
                  "resize",
                  this._resize.bind(this)
                ),
                this._container.addEventListener(
                  "mousedown",
                  this._mouseDown.bind(this)
                ),
                this._container.addEventListener(
                  "mousemove",
                  this._mouseMove.bind(this)
                ),
                this._container.addEventListener(
                  "mouseup",
                  this._mouseUp.bind(this)
                ),
                this._container.addEventListener(
                  "mouseleave",
                  this._mouseLeave.bind(this)
                ),
                this._container.addEventListener(
                  "touchstart",
                  this._touchStart.bind(this)
                ),
                this._container.addEventListener(
                  "touchend",
                  this._touchEnd.bind(this)
                ),
                this._container.addEventListener(
                  "touchmove",
                  this._touchMove.bind(this)
                ),
                this._makeKeys(),
                this._resize(),
                (this.onkeydown = function () {}),
                (this.onkeyup = function () {}),
                (this.oncontextstart = function () {});
            };
          return (
            (s.prototype._resize = function () {
              (this._context.canvas.width = 2 * this._container.clientWidth),
                (this._context.canvas.height =
                  2 * this._container.clientHeight),
                this.draw();
            }),
            (s.prototype.draw = function () {
              var t = this._context.canvas.width,
                e = this._context.canvas.height,
                o = 2;
              (this._context.lineWidth = o),
                this._context.clearRect(0, 0, t, e),
                (this._context.strokeStyle = n.lightGrey);
              for (
                var s,
                  h = i.getDistanceBetween(this._startNote, this._endNote),
                  r = t / h,
                  a = 0;
                a < this._keys.length;
                a++
              )
                (s = this._keys[a]), s.isSharp || s.draw(this._context, r, e);
              for (var u = 0; u < this._keys.length; u++)
                (s = this._keys[u]), s.isSharp && s.draw(this._context, r, e);
              return (
                this._context.beginPath(),
                (this._context.lineWidth = 2 * o),
                this._context.rect(0, 0, t, e),
                this._context.stroke(),
                this
              );
            }),
            (s.prototype._getCollision = function (t, e) {
              var n = i.getDistanceBetween(this._startNote, this._endNote),
                o = this._context.canvas.width / n,
                s = this._context.canvas.height;
              (t = (2 * t) / o), (e = (2 * e) / s);
              for (var h, r, a = 0; a < this._keys.length; a++)
                if (((h = this._keys[a]), h.isSharp && h.testCollision(t, e))) {
                  r = h;
                  break;
                }
              if (!r)
                for (var u = 0; u < this._keys.length; u++)
                  if (
                    ((h = this._keys[u]), !h.isSharp && h.testCollision(t, e))
                  ) {
                    r = h;
                    break;
                  }
              return r;
            }),
            (s.prototype._makeKeys = function () {
              (this._notes = i.getNotes(this._startNote, this._endNote)),
                (this._keys = []);
              for (var e = 0; e < this._notes.length; e++) {
                var n = this._notes[e],
                  s = new t(n, i.getDistanceBetween(this._startNote, n));
                this._noteNames[n] = s;
                var h = n.substr(0, 2);
                if (o.hasOwnProperty(h)) {
                  var r = n.substr(2);
                  this._noteNames[o[h] + r] = s;
                }
                this._keys.push(s);
              }
              return this;
            }),
            (s.prototype._mouseDown = function (t) {
              t.preventDefault();
              var e = this._getCollision(t.offsetX, t.offsetY);
              (this._isMouseDown = !0),
                e && (this._highlightedKeys.push(e), this.onkeydown(e.note));
            }),
            (s.prototype._mouseUp = function (t) {
              t.preventDefault();
              var e = this._getCollision(t.offsetX, t.offsetY);
              (this._isMouseDown = !1),
                e &&
                  (this._highlightedKeys.splice(
                    this._highlightedKeys.indexOf(e),
                    1
                  ),
                  this.onkeyup(e.note));
            }),
            (s.prototype._mouseLeave = function (t) {
              t.preventDefault(), (this._isMouseDown = !1);
              for (var e = 0; e < this._highlightedKeys.length; e++)
                this.onkeyup(this._highlightedKeys[e].note);
              this._highlightedKeys = [];
            }),
            (s.prototype._mouseMove = function (t) {
              if (this._isMouseDown) {
                t.preventDefault();
                var e = this._getCollision(t.offsetX, t.offsetY);
                if (-1 === this._highlightedKeys.indexOf(e)) {
                  for (var i = 0; i < this._highlightedKeys.length; i++)
                    this.onkeyup(this._highlightedKeys[i].note);
                  (this._highlightedKeys = []),
                    e &&
                      (this._highlightedKeys.push(e), this.onkeydown(e.note));
                }
              }
            }),
            (s.prototype._touchStart = function (t) {
              t.preventDefault();
              for (
                var e = this._container.getBoundingClientRect(),
                  i = t.changedTouches,
                  n = 0;
                n < i.length;
                n++
              ) {
                var o = i[n],
                  s = this._getCollision(o.clientX - e.left, o.clientY - e.top);
                s && (this._highlightedKeys.push(s), this.onkeydown(s.note));
              }
              this._touchDragged = !1;
            }),
            (s.prototype._touchEnd = function (t) {
              t.preventDefault();
              for (
                var e = this._container.getBoundingClientRect(),
                  i = t.changedTouches,
                  n = 0;
                n < i.length;
                n++
              ) {
                var o = i[n],
                  s = this._getCollision(o.clientX - e.left, o.clientY - e.top);
                s &&
                  (this._highlightedKeys.splice(
                    this._highlightedKeys.indexOf(s),
                    1
                  ),
                  this.onkeyup(s.note));
              }
              this._touchDragged ||
                this._contextStarted ||
                ((this._contextStarted = !0), this.oncontextstart());
            }),
            (s.prototype._touchMove = function (t) {
              t.preventDefault();
              for (
                var e = this._container.getBoundingClientRect(),
                  i = t.changedTouches,
                  n = 0;
                n < i.length;
                n++
              ) {
                var o = i[n],
                  s = this._getCollision(o.clientX - e.left, o.clientY - e.top);
                if (-1 === this._highlightedKeys.indexOf(s)) {
                  for (var h = 0; h < this._highlightedKeys.length; h++)
                    this.onkeyup(this._highlightedKeys[h].note);
                  (this._highlightedKeys = []),
                    s &&
                      (this._highlightedKeys.push(s), this.onkeydown(s.note));
                }
              }
              this._touchDragged = !0;
            }),
            (s.prototype.setHighlightColor = function (t) {
              return (
                (this._highlightColor = t),
                this._keys.forEach(function (e) {
                  e.setHighlightColor(t);
                }),
                this.draw(),
                this
              );
            }),
            (s.prototype.setStartNote = function (t) {
              return (this._startNote = t), this._makeKeys(), this.draw(), this;
            }),
            (s.prototype.setEndNote = function (t) {
              return (this._endNote = t), this._makeKeys(), this.draw(), this;
            }),
            (s.prototype.keyDown = function (t) {
              if (Array.isArray(t))
                for (var e = 0; e < t.length; e++) this.keyDown(t[e]);
              else
                this._noteNames.hasOwnProperty(t) &&
                  this._noteNames[t].highlight(this._highlightColor);
              this.draw();
            }),
            (s.prototype.highlight = function (t, e, i) {
              if (Array.isArray(t))
                for (var o = 0; o < t.length; o++) this.highlight(t[o]);
              else if (this._noteNames.hasOwnProperty(t)) {
                var s = this._noteNames[t];
                s.isSharp
                  ? this._noteNames[t].highlight(i || n.lightGrey)
                  : this._noteNames[t].highlight(e || "black");
              }
              this.draw();
            }),
            (s.prototype.keyUp = function (t) {
              if (Array.isArray(t))
                for (var e = 0; e < t.length; e++) this.keyUp(t[e]);
              else
                this._noteNames.hasOwnProperty(t) &&
                  this._noteNames[t].unhighlight();
              this.draw();
            }),
            (s.prototype.unselectAll = function () {
              for (var t = 0; t < this._keys.length; t++)
                this._keys[t].unhighlight();
              this.draw();
            }),
            s
          );
        }.apply(e, n)),
        !(void 0 !== o && (t.exports = o));
    },
    function (t, e, i) {
      var n;
      (n = function () {
        return {
          charcoal: "rgb(50,51,52)",
          lightGrey: "rgb(223,224,225)",
          grey: "rgb(204, 204, 204)",
          orange: "#FFB729",
          blue: "rgb(22, 168, 240)",
          lightBlue: "rgb(131, 211, 248)",
          C: "#4e61d8",
          "C#": "#8064c6",
          Db: "#8064c6",
          D: "#a542b1",
          "D#": "#ed3883",
          Eb: "#ed3883",
          E: "#f75839",
          F: "#f7943d",
          "F#": "#f6be37",
          Gb: "#f6be37",
          G: "#d1c12e",
          "G#": "#95c631",
          Ab: "#95c631",
          A: "#4bb250",
          "A#": "#45b5a1",
          Bb: "#45b5a1",
          B: "#4598b6",
        };
      }.call(e, i, e, t)),
        !(void 0 !== n && (t.exports = n));
    },
    function (t, e, i) {
      (e = t.exports = i(3)()),
        e.push([
          t.id,
          "#PianoKeyboard{width:100%;height:100%;position:relative;cursor:pointer}",
          "",
        ]);
    },
    function (t, e) {
      t.exports = function () {
        var t = [];
        return (
          (t.toString = function () {
            for (var t = [], e = 0; e < this.length; e++) {
              var i = this[e];
              i[2] ? t.push("@media " + i[2] + "{" + i[1] + "}") : t.push(i[1]);
            }
            return t.join("");
          }),
          (t.i = function (e, i) {
            "string" == typeof e && (e = [[null, e, ""]]);
            for (var n = {}, o = 0; o < this.length; o++) {
              var s = this[o][0];
              "number" == typeof s && (n[s] = !0);
            }
            for (o = 0; o < e.length; o++) {
              var h = e[o];
              ("number" == typeof h[0] && n[h[0]]) ||
                (i && !h[2]
                  ? (h[2] = i)
                  : i && (h[2] = "(" + h[2] + ") and (" + i + ")"),
                t.push(h));
            }
          }),
          t
        );
      };
    },
    function (t, e, i) {
      function n(t, e) {
        for (var i = 0; i < t.length; i++) {
          var n = t[i],
            o = l[n.id];
          if (o) {
            o.refs++;
            for (var s = 0; s < o.parts.length; s++) o.parts[s](n.parts[s]);
            for (; s < n.parts.length; s++) o.parts.push(r(n.parts[s], e));
          } else {
            for (var h = [], s = 0; s < n.parts.length; s++)
              h.push(r(n.parts[s], e));
            l[n.id] = { id: n.id, refs: 1, parts: h };
          }
        }
      }
      function o(t) {
        for (var e = [], i = {}, n = 0; n < t.length; n++) {
          var o = t[n],
            s = o[0],
            h = o[1],
            r = o[2],
            a = o[3],
            u = { css: h, media: r, sourceMap: a };
          i[s] ? i[s].parts.push(u) : e.push((i[s] = { id: s, parts: [u] }));
        }
        return e;
      }
      function s() {
        var t = document.createElement("style"),
          e = f();
        return (t.type = "text/css"), e.appendChild(t), t;
      }
      function h() {
        var t = document.createElement("link"),
          e = f();
        return (t.rel = "stylesheet"), e.appendChild(t), t;
      }
      function r(t, e) {
        var i, n, o;
        if (e.singleton) {
          var r = _++;
          (i = g || (g = s())),
            (n = a.bind(null, i, r, !1)),
            (o = a.bind(null, i, r, !0));
        } else
          t.sourceMap &&
          "function" == typeof URL &&
          "function" == typeof URL.createObjectURL &&
          "function" == typeof URL.revokeObjectURL &&
          "function" == typeof Blob &&
          "function" == typeof btoa
            ? ((i = h()),
              (n = c.bind(null, i)),
              (o = function () {
                i.parentNode.removeChild(i),
                  i.href && URL.revokeObjectURL(i.href);
              }))
            : ((i = s()),
              (n = u.bind(null, i)),
              (o = function () {
                i.parentNode.removeChild(i);
              }));
        return (
          n(t),
          function (e) {
            if (e) {
              if (
                e.css === t.css &&
                e.media === t.media &&
                e.sourceMap === t.sourceMap
              )
                return;
              n((t = e));
            } else o();
          }
        );
      }
      function a(t, e, i, n) {
        var o = i ? "" : n.css;
        if (t.styleSheet) t.styleSheet.cssText = v(e, o);
        else {
          var s = document.createTextNode(o),
            h = t.childNodes;
          h[e] && t.removeChild(h[e]),
            h.length ? t.insertBefore(s, h[e]) : t.appendChild(s);
        }
      }
      function u(t, e) {
        var i = e.css,
          n = e.media;
        e.sourceMap;
        if ((n && t.setAttribute("media", n), t.styleSheet))
          t.styleSheet.cssText = i;
        else {
          for (; t.firstChild; ) t.removeChild(t.firstChild);
          t.appendChild(document.createTextNode(i));
        }
      }
      function c(t, e) {
        var i = e.css,
          n = (e.media, e.sourceMap);
        n &&
          (i +=
            "\n/*# sourceMappingURL=data:application/json;base64," +
            btoa(unescape(encodeURIComponent(JSON.stringify(n)))) +
            " */");
        var o = new Blob([i], { type: "text/css" }),
          s = t.href;
        (t.href = URL.createObjectURL(o)), s && URL.revokeObjectURL(s);
      }
      var l = {},
        d = function (t) {
          var e;
          return function () {
            return "undefined" == typeof e && (e = t.apply(this, arguments)), e;
          };
        },
        p = d(function () {
          return /msie [6-9]\b/.test(window.navigator.userAgent.toLowerCase());
        }),
        f = d(function () {
          return document.head || document.getElementsByTagName("head")[0];
        }),
        g = null,
        _ = 0;
      t.exports = function (t, e) {
        (e = e || {}), "undefined" == typeof e.singleton && (e.singleton = p());
        var i = o(t);
        return (
          n(i, e),
          function (t) {
            for (var s = [], h = 0; h < i.length; h++) {
              var r = i[h],
                a = l[r.id];
              a.refs--, s.push(a);
            }
            if (t) {
              var u = o(t);
              n(u, e);
            }
            for (var h = 0; h < s.length; h++) {
              var a = s[h];
              if (0 === a.refs) {
                for (var c = 0; c < a.parts.length; c++) a.parts[c]();
                delete l[a.id];
              }
            }
          }
        );
      };
      var v = (function () {
        var t = [];
        return function (e, i) {
          return (t[e] = i), t.filter(Boolean).join("\n");
        };
      })();
    },
    function (t, e, i) {
      var n = i(2);
      "string" == typeof n && (n = [[t.id, n, ""]]);
      i(4)(n, {});
      n.locals && (t.exports = n.locals);
    },
    function (t, e, i) {
      var n, o;
      (n = [i(1)]),
        (o = function (t) {
          "use strict";
          var e = function (t, e) {
            (this.note = t),
              (this._offset = e),
              (this.isSharp = -1 !== this.note.indexOf("#")),
              (this._isHighlighted = !1),
              (this._highlightColor = ""),
              this.setHighlightColor("rainbow"),
              this._computeBoundingBox();
          };
          return (
            (e.prototype._computeBoundingBox = function () {
              var t = this.isSharp ? 0.6 : 1,
                e = this.isSharp ? 0.7 : 1,
                i = this.isSharp ? (1 - e) / 2 : 0;
              return [this._offset + i, 0, e, t];
            }),
            (e.prototype._getNoteName = function () {
              var t = this.note.split(/(-?\d+)/);
              if (3 === t.length) {
                var e = t[0].toUpperCase();
                return e;
              }
            }),
            (e.prototype.highlight = function (t) {
              return (
                (this._isHighlighted = !0), (this._highlightColor = t), this
              );
            }),
            (e.prototype.unhighlight = function () {
              return (this._isHighlighted = !1), this;
            }),
            (e.prototype.setHighlightColor = function (e) {
              return (
                "rainbow" === e
                  ? (this._highlightColor = t[this._getNoteName()])
                  : (this._highlightColor = e),
                this
              );
            }),
            (e.prototype.setStartNote = function (t) {
              (this._startNote = t), this._computeBoundingBox();
            }),
            (e.prototype.setEndNote = function (t) {
              (this._endNote = t), this._computeBoundingBox();
            }),
            (e.prototype.testCollision = function (t, e) {
              var i = this._computeBoundingBox();
              return i[0] <= t && i[0] + i[2] >= t && i[1] <= e && i[3] >= e
                ? !0
                : void 0;
            }),
            (e.prototype.draw = function (e, i, n) {
              e.beginPath(),
                this._isHighlighted
                  ? (e.fillStyle = this._highlightColor)
                  : (e.fillStyle = this.isSharp ? t.charcoal : "white");
              var o = this._computeBoundingBox();
              return (
                (o[0] = Math.round(i * o[0])),
                (o[2] = Math.round(i * o[2])),
                (o[1] = Math.round(n * o[1])),
                (o[3] = Math.round(n * o[3])),
                e.rect.apply(e, o),
                e.fill(),
                this.isSharp || this._isHighlighted || e.stroke(),
                this
              );
            }),
            e
          );
        }.apply(e, n)),
        !(void 0 !== o && (t.exports = o));
    },
    function (t, e, i) {
      var n;
      (n = function () {
        var t = [
          "C",
          "C#",
          "D",
          "D#",
          "E",
          "F",
          "F#",
          "G",
          "G#",
          "A",
          "A#",
          "B",
        ];
        return {
          getNotes: function (e, i) {
            var n = parseInt(e.split(/(-?\d+)/)[1]),
              o = e.split(/(-?\d+)/)[0];
            o = t.indexOf(o);
            var s = parseInt(i.split(/(-?\d+)/)[1]),
              h = i.split(/(-?\d+)/)[0];
            h = t.indexOf(h);
            for (var r = o, a = n, u = []; r !== h || a !== s; )
              u.push(t[r] + a), r++, r >= t.length && ((r = 0), a++);
            return u;
          },
          getDistanceBetween: function (t, e) {
            for (var i = this.getNotes(t, e), n = 0, o = 0; o < i.length; o++) {
              var s = i[o];
              n += ("E" !== s[0] && "B" !== s[0]) || "#" === s[1] ? 0.5 : 1;
            }
            return n;
          },
        };
      }.call(e, i, e, t)),
        !(void 0 !== n && (t.exports = n));
    },
  ]);
});
