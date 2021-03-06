!(function (t, e) {
  "object" == typeof exports && "object" == typeof module
    ? (module.exports = e(require("jQuery")))
    : "function" == typeof define && define.amd
    ? define(["jQuery"], e)
    : "object" == typeof exports
    ? (exports.Logo = e(require("jQuery")))
    : (t.Logo = e(t.jQuery));
})(this, function (t) {
  return (function (t) {
    function e(o) {
      if (n[o]) return n[o].exports;
      var r = (n[o] = { exports: {}, id: o, loaded: !1 });
      return t[o].call(r.exports, r, r.exports, e), (r.loaded = !0), r.exports;
    }
    var n = {};
    return (e.m = t), (e.c = n), (e.p = ""), e(0);
  })([
    function (t, e, n) {
      var o, r;
      (o = [n(6), n(5), n(1)]),
        (r = function (t, e, n) {
          var o = 256,
            r = n(o).random,
            i = "function" == typeof window.Tone,
            s = function (e) {
              for (var n in s.defaults)
                "undefined" == typeof e[n] && (e[n] = s.defaults[n]);
              (this.element = t("<div>", { id: "TonejsLogo" })
                .appendTo(e.container)
                .on("click", function (t) {
                  t.preventDefault(),
                    (window.location.href = "http://tonejs.org");
                })),
                (this.textContainer = t("<div>", {
                  id: "TextContainer",
                }).appendTo(this.element)),
                (this.canvas = t("<canvas>", { id: "Canvas" }).appendTo(
                  this.textContainer
                )),
                (this.context = this.canvas.get(0).getContext("2d")),
                (this.title = t("<div>", { id: "Title" })
                  .appendTo(this.textContainer)
                  .html(
                    "<span class='Closer'>T</span>one<span class='Closer'>.</span><span id='JS'>js</span>"
                  )),
                i &&
                  ((this.analyser = new Tone.Analyser({
                    size: o,
                    type: "waveform",
                    returnType: "byte",
                  })),
                  (this._signal = new Tone.Signal(0).connect(this.analyser)),
                  Tone.Master.connect(this.analyser)),
                (this._silentThresh = 0.01),
                (this._rms = 0),
                this.resize(e.width, e.height),
                i ? this._draw() : this._drawBuffer(r, !0);
            };
          return (
            (s.defaults = { container: "body", width: 300, height: 80 }),
            (s.prototype.resize = function (t, e) {
              return (
                this.element.width(t),
                this.element.height(e),
                (this.context.canvas.width = 2 * this.canvas.height()),
                (this.context.canvas.height = 2 * this.canvas.height()),
                this.title.css({
                  "line-height": (0.85 * e).toString() + "px",
                  "font-size": 0.88 * e,
                }),
                this.canvas.css({
                  "border-radius": e / 50,
                  width: this.canvas.height(),
                  height: this.canvas.height(),
                }),
                this
              );
            }),
            (s.prototype._draw = function () {
              requestAnimationFrame(this._draw.bind(this));
              var t = this.analyser.analyse();
              this._isSilent(t)
                ? this._drawBuffer(r, !0)
                : this._drawBuffer(t, !1);
            }),
            (s.prototype._drawBuffer = function (t, e) {
              var n = this.context,
                o = this.context.canvas.width,
                r = this.context.canvas.height;
              e
                ? (margin = this._scale(
                    this._rms,
                    0,
                    this._silentThresh,
                    0.2 * r,
                    0.5 * r
                  ))
                : (margin = 0.2 * r),
                n.clearRect(0, 0, o, r),
                n.beginPath();
              for (var i, s = 0, a = t.length; a > s; s++) {
                var h = this._scale(s, 0, a - 1, 0, o),
                  l = this._scale(t[s], 0, 255, r - margin, margin);
                0 === s ? ((i = l), n.moveTo(h, l)) : n.lineTo(h, l);
              }
              n.lineTo(o, r),
                n.lineTo(0, r),
                n.lineTo(0, i),
                (n.lineCap = "round"),
                (n.fillStyle = "#22DBC0"),
                n.fill();
            }),
            (s.prototype._isSilent = function (t) {
              for (var e = 0, n = 0; n < t.length; n++)
                e += Math.pow((t[n] - 128) / 128, 2);
              var o = Math.sqrt(e / t.length);
              return (
                (this._rms = Math.max(o, 0.9 * this._rms)),
                this._rms < this._silentThresh
              );
            }),
            (s.prototype._scale = function (t, e, n, o, r) {
              var i = (t - e) / (n - e);
              return i * (r - o) + o;
            }),
            (s.prototype.dispose = function () {
              this.element.remove(),
                (this.element = null),
                this.canvas.remove(),
                (this.canvas = null),
                this.title.remove(),
                (this.title = null),
                (this.context = null),
                this.analyser.dispose(),
                (this.analyser = null),
                this._signal.dispose(),
                (this._signal = null);
            }),
            i && (Tone.Logo = s),
            s
          );
        }.apply(e, o)),
        !(void 0 !== r && (t.exports = r));
    },
    function (t, e, n) {
      var o;
      (o = function () {
        return function (t) {
          var e,
            n = new Array(t),
            o = new Array(t),
            r = new Array(t),
            i = new Array(t),
            s = [n, r, i, o];
          for (e = 0; t > e; e++)
            n[e] = 128 * (Math.sin((2 * Math.PI * e) / 255) + 1);
          for (e = 0; t > e; e++) r[e] = (((e + t / 2) % t) / t) * 255;
          for (e = 0; t > e; e++)
            t / 4 > e
              ? (i[e] = (e / (t / 4)) * 127 + 128)
              : 0.75 * t > e
              ? (i[e] = 255 * (1 - (e - t / 4) / (t / 2)))
              : (i[e] = ((e - 0.75 * t) / (t / 4)) * 127);
          for (e = 0; t > e; e++) {
            var a = t / 16;
            a > e
              ? (o[e] = 0)
              : t / 2 > e
              ? (o[e] = 255)
              : t - a > e
              ? (o[e] = 0)
              : (o[e] = 255);
          }
          var h = s[Math.floor(Math.random() * s.length)];
          return { sawtooth: r, sine: n, triangle: i, square: o, random: h };
        };
      }.call(e, n, e, t)),
        !(void 0 !== o && (t.exports = o));
    },
    function (t, e, n) {
      (e = t.exports = n(3)()),
        e.push([
          t.id,
          "@import url(https://fonts.googleapis.com/css?family=Roboto+Mono);",
          "",
        ]),
        e.push([
          t.id,
          "#TonejsLogo{background-color:#000;cursor:pointer}#TonejsLogo,#TonejsLogo #Border,#TonejsLogo #Canvas,#TonejsLogo #Title{position:absolute}#TonejsLogo #TextContainer{position:absolute;width:auto;-webkit-transform:translate(-50%, 0px);-ms-transform:translate(-50%, 0px);transform:translate(-50%, 0px);left:50%;height:100%}#TonejsLogo #TextContainer #Title{position:relative;display:inline-block;font-family:Roboto Mono,monospace;color:#fff;text-align:center;height:100%;top:0;width:100%;font-weight:400}#TonejsLogo #TextContainer #Title .Closer{margin:-3%}#TonejsLogo #TextContainer #Canvas{position:absolute;height:100%;top:0;border-radius:2%;z-index:0;right:0;width:10px;background-color:#f734d7}",
          "",
        ]);
    },
    function (t, e) {
      t.exports = function () {
        var t = [];
        return (
          (t.toString = function () {
            for (var t = [], e = 0; e < this.length; e++) {
              var n = this[e];
              n[2] ? t.push("@media " + n[2] + "{" + n[1] + "}") : t.push(n[1]);
            }
            return t.join("");
          }),
          (t.i = function (e, n) {
            "string" == typeof e && (e = [[null, e, ""]]);
            for (var o = {}, r = 0; r < this.length; r++) {
              var i = this[r][0];
              "number" == typeof i && (o[i] = !0);
            }
            for (r = 0; r < e.length; r++) {
              var s = e[r];
              ("number" == typeof s[0] && o[s[0]]) ||
                (n && !s[2]
                  ? (s[2] = n)
                  : n && (s[2] = "(" + s[2] + ") and (" + n + ")"),
                t.push(s));
            }
          }),
          t
        );
      };
    },
    function (t, e, n) {
      function o(t, e) {
        for (var n = 0; n < t.length; n++) {
          var o = t[n],
            r = c[o.id];
          if (r) {
            r.refs++;
            for (var i = 0; i < r.parts.length; i++) r.parts[i](o.parts[i]);
            for (; i < o.parts.length; i++) r.parts.push(a(o.parts[i], e));
          } else {
            for (var s = [], i = 0; i < o.parts.length; i++)
              s.push(a(o.parts[i], e));
            c[o.id] = { id: o.id, refs: 1, parts: s };
          }
        }
      }
      function r(t) {
        for (var e = [], n = {}, o = 0; o < t.length; o++) {
          var r = t[o],
            i = r[0],
            s = r[1],
            a = r[2],
            h = r[3],
            l = { css: s, media: a, sourceMap: h };
          n[i] ? n[i].parts.push(l) : e.push((n[i] = { id: i, parts: [l] }));
        }
        return e;
      }
      function i() {
        var t = document.createElement("style"),
          e = d();
        return (t.type = "text/css"), e.appendChild(t), t;
      }
      function s() {
        var t = document.createElement("link"),
          e = d();
        return (t.rel = "stylesheet"), e.appendChild(t), t;
      }
      function a(t, e) {
        var n, o, r;
        if (e.singleton) {
          var a = g++;
          (n = v || (v = i())),
            (o = h.bind(null, n, a, !1)),
            (r = h.bind(null, n, a, !0));
        } else
          t.sourceMap &&
          "function" == typeof URL &&
          "function" == typeof URL.createObjectURL &&
          "function" == typeof URL.revokeObjectURL &&
          "function" == typeof Blob &&
          "function" == typeof btoa
            ? ((n = s()),
              (o = u.bind(null, n)),
              (r = function () {
                n.parentNode.removeChild(n),
                  n.href && URL.revokeObjectURL(n.href);
              }))
            : ((n = i()),
              (o = l.bind(null, n)),
              (r = function () {
                n.parentNode.removeChild(n);
              }));
        return (
          o(t),
          function (e) {
            if (e) {
              if (
                e.css === t.css &&
                e.media === t.media &&
                e.sourceMap === t.sourceMap
              )
                return;
              o((t = e));
            } else r();
          }
        );
      }
      function h(t, e, n, o) {
        var r = n ? "" : o.css;
        if (t.styleSheet) t.styleSheet.cssText = m(e, r);
        else {
          var i = document.createTextNode(r),
            s = t.childNodes;
          s[e] && t.removeChild(s[e]),
            s.length ? t.insertBefore(i, s[e]) : t.appendChild(i);
        }
      }
      function l(t, e) {
        var n = e.css,
          o = e.media;
        if ((e.sourceMap, o && t.setAttribute("media", o), t.styleSheet))
          t.styleSheet.cssText = n;
        else {
          for (; t.firstChild; ) t.removeChild(t.firstChild);
          t.appendChild(document.createTextNode(n));
        }
      }
      function u(t, e) {
        var n = e.css,
          o = (e.media, e.sourceMap);
        o &&
          (n +=
            "\n/*# sourceMappingURL=data:application/json;base64," +
            btoa(unescape(encodeURIComponent(JSON.stringify(o)))) +
            " */");
        var r = new Blob([n], { type: "text/css" }),
          i = t.href;
        (t.href = URL.createObjectURL(r)), i && URL.revokeObjectURL(i);
      }
      var c = {},
        f = function (t) {
          var e;
          return function () {
            return "undefined" == typeof e && (e = t.apply(this, arguments)), e;
          };
        },
        p = f(function () {
          return /msie [6-9]\b/.test(window.navigator.userAgent.toLowerCase());
        }),
        d = f(function () {
          return document.head || document.getElementsByTagName("head")[0];
        }),
        v = null,
        g = 0;
      t.exports = function (t, e) {
        (e = e || {}), "undefined" == typeof e.singleton && (e.singleton = p());
        var n = r(t);
        return (
          o(n, e),
          function (t) {
            for (var i = [], s = 0; s < n.length; s++) {
              var a = n[s],
                h = c[a.id];
              h.refs--, i.push(h);
            }
            if (t) {
              var l = r(t);
              o(l, e);
            }
            for (var s = 0; s < i.length; s++) {
              var h = i[s];
              if (0 === h.refs) {
                for (var u = 0; u < h.parts.length; u++) h.parts[u]();
                delete c[h.id];
              }
            }
          }
        );
      };
      var m = (function () {
        var t = [];
        return function (e, n) {
          return (t[e] = n), t.filter(Boolean).join("\n");
        };
      })();
    },
    function (t, e, n) {
      var o = n(2);
      "string" == typeof o && (o = [[t.id, o, ""]]),
        n(4)(o, {}),
        o.locals && (t.exports = o.locals);
    },
    function (e, n) {
      e.exports = t;
    },
  ]);
});
