var maplet, GUnload = function () {
};
function maplet_getWindowInfoXY(b, a) {
    function d(a) {
        a = $(a);
        return DP.DOM ? {x: parseInt(a.css("width")), y: parseInt(a.css("height"))} : a.getSize()
    }

    var a = a || b.info.content, c = d(b.icon.div), e = d(a.dom || a), f = b.pt ? b.pt.mapX : b.x, g = b.pt ? b.pt.mapY : b.y;
    return{x: f > b.maplet.width / 2 ? f - e.x + c.x : f - c.x, y: g >= b.maplet.height / 2 ? g - e.y - c.y / 2 : g + c.y / 2}
}
window.Class || (window.Class = function (b) {
    return DP.Class(b)
});
var Map = new Class({options: {css: !1, hold: !0, wheel: !0, scaleLevel: !1, contains: !1, settings: {digi: 16, add: 10, plus: 7, cha: 36, center: {lat: 34.957995, lng: 107.050781, isDef: !0}}, imgPath: "http://i1.dpfile.com/s/img/map/", draggerText: "<p style='height:25px'>\u62d6\u52a8\u6b64\u56fe\u6807\u5728\u5730\u56fe\u4e0a\u6807\u6ce8\u4f4d\u7f6e</p>", staticState: !1, smallStandard: !1}, _getEl: function (b) {
    return DP.DOM ? $(b).el(0) : $(b)
}, _getDOM: function (b) {
    return $(b)
}, _merge: function (b, a) {
    var d, c;
    for (d in a)c = a[d], b[d] = DP.isObject(c) ?
        this._merge(b[d] || {}, c) : c;
    return b
}, setOptions: function (b) {
    var a = this.options;
    this._merge(a, b || {});
    return a
}, initialize: function (b, a, d) {
    this.ele = b = this._getEl(b);
    if (!b)throw{code: 404, msg: "\u5143\u7d20\u4e0d\u5b58\u5728"};
    this.setOptions(d);
    a = DP.makeArray(a);
    this.options.css && this._getDOM(b).css(this.options.css);
    maplet = this.map = this.getMap(b, this.options.hold);
    if (!maplet)throw{code: 501, msg: "\u5730\u56fe\u521d\u59cb\u5316\u5931\u8d25"};
    this.init(b, a, maplet)
}, init: function (b, a, d) {
    var c = this.options,
        e, f;
    d.$panels = [];
    a = this.checkPOI(a, c.settings.center);
    f = a[0];
    e = new MPoint(f.lng, f.lat);
    c.scaleLevel = (f.isDef ? 4 : DP.isNumber(c.scaleLevel) ? c.scaleLevel : 15) - 3;
    d.centerAndZoom(e, this.options.scaleLevel);
    d.showOverview(!1);
    d.customInfoWindow = !0;
    d.allowDrawingDragMap = !1;
    d.clickToCenter = !1;
    MOUSEWHEEL = !!c.wheel;
    c.staticState && (MOUSEWHEEL = !1, d.allowDrawingDragMap = !1);
    (f.isCenter || f.isDef) && a.shift();
    0 < a.length ? (d.$added ? d.$initPoint && d.$initPoint.setPoint(e) : (d.$initPoint = this.initPoint = this.addPoint(b, a),
        c.staticState || d.addControl(new MStandardControl)), d.$added = c.staticState) : c.staticState || d.addControl(new MStandardControl);
    ["click", "dblclick", "zoomend", "dragend"].forEach(function (a) {
        DPEvent.addListener(d, a, function () {
            d.$panels.forEach(function (a) {
                a.hide()
            })
        })
    });
    c.smallStandard && d.DP_setStyleControl("show");
    d.showScale(!1)
}, getMap: function (b, a) {
    maplet = b.__maplet;
    if (!maplet || !a)maplet = new DPMap(b), b.__maplet = maplet;
    return maplet
}, addPoint: function (b, a, d) {
    var c = this, e = c.getMap(b, !0), f = [], g = c.options,
        i, j, n = e.getCenter();
    if (!e || 1 > a.length)throw{code: 502, msg: "\u6dfb\u52a0\u6807\u6ce8\u5931\u8d25"};
    a = DP.makeArray(a);
    for (b = a.length - 1; 0 <= b; b--)(function (a) {
        if ((a = c.checkPOI(a, (j = DP.isFunction(a.dFn)) ? {lat: n.lat, lng: n.lon} : null)) && 0 < a.length) {
            a = a[0];
            j && (i = g.imgPath + "dragger.png");
            a.ico && (i = g.imgPath + a.ico + ".png");
            i = i || g.imgPath + "marker.png";
            var b = a.GIcon || new DPIcon(i), d = new MPoint(a.lng, a.lat), h = new DPMarker(d, b), k, r = a.popOnly || !1;
            b.$DP_oldImgUrl = b.getImgUrl();
            b.img.title = a.title || "";
            var l = function () {
                    e.$panels.each(function (a) {
                        a.hide()
                    })
                },
                b = function () {
                    k && e.removePanel(k);
                    k = new MPanel({pin: !0, zindex: 5, mousewheel: !1, content: h.info.content});
                    r && (l(), e.$panels.push(k));
                    h.$panel = k;
                    MPanel.enableDragMap(k.dom, !1);
                    e.addPanel(k);
                    var a = maplet_getWindowInfoXY(h, k);
                    k.setLocation({type: "xy", x: a.x, y: a.y, pt: null})
                };
            e.addOverlay(h);
            if (a.msg || j)j ? a.msg = {html: a.msg || g.draggerText, open: 1} : a.msg = {html: a.msg || "", open: a.open}, h.setEditable(j), h.dragAnimation = !1, h.$style_index = 1, h.$panelContainer = h.DP_choosePanel(h.$style_index, a.msg.html, a.styles || {height: "auto",
                width: 190}), h.setInfoWindow(new MInfoWindow("", h.$panelContainer.window)), $(h.$panelContainer.close).on("click", function () {
                h.DP_closeInfoWindow(!0)
            }), MEvent.addListener(h, "iw_beforeopen", b), MEvent.addListener(h, "click", function () {
                l()
            }), j && (MEvent.addListener(h, "dragstart", function () {
                a.dsFn && a.dsFn.call(this);
                k.hide()
            }), MEvent.addListener(h, "drag", function (b) {
                a.dFn.apply(this, arguments);
                setTimeout(function () {
                    h.DP_openInfoWindowHtml()
                }, 500)
            })), "function" == typeof a.overFn && a.id && MEvent.addListener(h,
                "mouseover", function () {
                    a.overFn.apply(c, [e, h, a.msg.html, a.id])
                }), "function" == typeof a.poiCallback && a.id && a.poiCallback(e, h, a.msg.html, a.id), "function" == typeof a.outFn && a.id && MEvent.addListener(h, "mouseout", function () {
                a.outFn.apply(c, [e, h, a.msg.html, a.id])
            }), e.addOverlay(h), a.msg.open && setTimeout(function () {
                h.DP_openInfoWindowHtml()
            }, 500);
            f.push(h)
        }
    })(a[b]);
    this.options.contains && !d && e.setAutoZoom();
    return 1 < f.length ? f : f[0]
}, checkPOI: function (b, a) {
    var d = 0, c, e, f, b = DP.makeArray(b || a);
    for (c = b.length; d <
        c; d++)if (e = b[d] || "", e.poi && (f = this.decode(e.poi), e.lat = f.lat, e.lng = f.lng, delete e.poi), !e.lat || !e.lng)if (a)for (var g in a)e[g] = a[g]; else b.splice(d, 1), c--;
    a && 1 > b.length && (b = DP.makeArray(a));
    return b
}, decode: function (b) {

    var a = this.options, d = -1, c = 0, e = "", f = b.length, g = b.charCodeAt(f - 1), i, b = b.substring(0, f - 1);
    f--;
    for (var j = 0; j < f; j++)i = parseInt(b.charAt(j), a.settings.cha) - a.settings.add, i >= a.settings.add && (i -= a.settings.plus), e += i.toString(a.settings.cha), i > c && (d = j, c = i);
    b = parseInt(e.substring(0,
        d), a.settings.digi);
    a = parseInt(e.substring(d + 1), a.settings.digi);
    g = (b + a - parseInt(g)) / 2;
    a = (a - g) / 1E5;
    return{lat: a, lng: g / 1E5}
}, addPointAndLabel: function (b) {
    function a() {
        for (var a in m)m[a](), delete m[a];
        m = {}
    }

    var d = this, c = Browser.ie && 6 == Browser.version, e = d.map, f = e.DP_getCenter(), g = 0 < document.domain.indexOf("dianping") ? "i1.dpfile.com" : "i3.static.dp/trunk", i = "http://" + g + "/s/i/map/g.pop-map.red" + (c ? 8 : 24) + ".png", j = "http://" + g + "/s/i/map/g.pop-map.yel" + (c ? 8 : 24) + ".png", n = [], o, m = {}, p;
    DP.makeArray(b).forEach(function (b) {
        var c,
            g, l;
        if (b.poi && (o = d.decode(b.poi, f), o.lng && o.lat)) {
            g = new DPLabel(b.html || "");
            l = new DPIcon(i, 23, 30);
            c = new DPMarker(new MPoint(o.lng, o.lat), l, null, g);
            var q = function () {
                c.DP_setImage(i);
                b.mouseout.call(c);
                g.DP_setDisplay(!1)
            };
            g.DP_marker = c;
            g.DP_addListener("mouseenter", function () {
                clearTimeout(p);
                p = null
            });
            g.DP_addListener("mouseleave", q);
            b.mouseover && l.DP_addListener("mouseenter", function () {
                clearTimeout(p);
                p = null;
                g.DP_setDisplay(!0);
                g.DP_redraw();
                a();
                c.DP_setImage(j);
                b.mouseover.call(c);
                m[c.id] = q
            });
            b.mouseout &&
            l.DP_addListener("mouseleave", function () {
                m[c.id] = q;
                p = setTimeout(a, 300)
            });
            n.push(c);
            g.DP_setDisplay(!1);
            e.addOverlay(c)
        }
    });
    e.setAutoZoom();
    return n
}, drawCircle: function (b, a, d, c, e, f, g) {
    var a = 1E3 * a, d = new MBrush, i = this.map;
    d.color = e || "#2196C7";
    d.bgcolor = f || "#2196C7";
    d.fill = !0;
    d.transparency = 80;
    d.bgtransparency = 30;
    d.stroke = g || 2;
    ellipse = new MEllipse(b, a, a, d);
    i.addOverlay(ellipse);
    c && i.setAutoZoom();
    return ellipse
}, addIcon: function (b, a, d, c) {
    var e = this.map, a = this.decode(a), c = new DPLabel(c || ""), b = new DPIcon(b,
        d[0], d[1]), a = new DPMarker(new MPoint(a.lng, a.lat), b, null, c);
    e.addOverlay(a);
    return a
}, removeOverlay: function (b) {
    this.map.removeOverlay(b)
}, clearOverlays: function () {
    this.map.clearOverlays()
}, drawPolyline: function (b, a) {
    var d = this, a = a || {}, c = this.map, e = new MBrush(a.color || "blue"), f = new MInfoWindow("\u4fe1\u606f\u7a97\u53e3\u6807\u9898", "\u4fe1\u606f\u7a97\u53e3\u5185\u5bb9"), g = b.map(function (a) {
        a = d.decode(a);
        return new MPoint(a.lng, a.lat)
    }), e = new MPolyline(g, e, f);
    c.addOverlay(e);
    return e
}, panTo: function (b) {
    b =
        this.decode(b);
    b = new MPoint(b.lat, b.lng);
    this.map.panTo(b.mapX, b.mapY)
}});
Map.traffic = function (b) {
    switch (b) {
        case "r":
            return"&st=b&qbus=1&ac=bus";
        case "d":
            return"&wf=navs";
        default:
            return""
    }
};
Map.type = "mapbar";
function DPMap(b) {
    b = new Maplet(b);
    DP.mix(b, {DP_Resize: function (a, b) {
        return this.resize(a, b)
    }, DP_checkResize: function () {
        return this.refresh()
    }, DP_setAutoZoom: function () {
        return this.setAutoZoom()
    }, DP_clearOverlays: function (a) {
        this.$panels && this.$panels.each(function (a) {
            a.hide()
        });
        this.clearOverlays(a)
    }, DP_addOverlay: function (a) {
        this.addOverlay(a)
    }, DP_removeOverlay: function (a) {
        return this.removeOverlay(a)
    }, DP_getCenter: function () {
        return this.getCenter()
    }, DP_setCenter: function (a, b) {
        b && this.DP_setZoom(b);
        this.setCenter(a)
    }, DP_setStyleControl: function (a) {
        "show" == a ? (this.controlCanvas.showCtlPan(!1), this.controlCanvas.showCtlRuler(!1)) : "hide" == a && (this.controlCanvas.showCtlPan(!0), this.controlCanvas.showCtlRuler(!0))
    }, DP_closeInfoWindow: function () {
        return this.hideBubble()
    }, DP_setZoom: function (a) {
        switch (a) {
            case 0:
                a = 0;
                break;
            case 1:
                a = 0;
                break;
            case 2:
                a = 0;
                break;
            case 3:
                a = 1;
                break;
            case 4:
                a = 2;
                break;
            case 5:
                a = 3;
                break;
            case 6:
                a = 3;
                break;
            case 7:
                a = 4;
                break;
            case 8:
                a = 5;
                break;
            case 9:
                a = 6;
                break;
            case 10:
                a = 7;
                break;
            case 11:
                a =
                    8;
                break;
            case 12:
                a = 9;
                break;
            case 13:
                a = 10;
                break;
            case 14:
                a = 11;
                break;
            case 15:
                a = 12;
                break;
            case 16:
                a = 13;
                break;
            case 17:
                a = 13;
                break;
            case 18:
                a = 14;
                break;
            case 19:
                a = 14;
                break;
            case 20:
                a = 14;
                break;
            case 21:
                a = 14
        }
        return this.setZoomLevel(a)
    }, DP_getZoom: function (a) {
        a = a || this.getZoomLevel();
        switch (a) {
            case 0:
                a = 2;
                break;
            case 1:
                a = 3;
                break;
            case 2:
                a = 4;
                break;
            case 3:
                a = 6;
                break;
            case 4:
                a = 7;
                break;
            case 5:
                a = 8;
                break;
            case 6:
                a = 9;
                break;
            case 7:
                a = 10;
                break;
            case 8:
                a = 11;
                break;
            case 9:
                a = 11;
                break;
            case 10:
                a = 13;
                break;
            case 11:
                a = 14;
                break;
            case 12:
                a = 15;
                break;
            case 13:
                a = 16;
                break;
            case 14:
                a = 18
        }
        return a
    }, DP_getBounds: function () {
        var a = this.getViewBound();
        return{getSouthWest: function () {
            return{lng: function () {
                return a.LeftDown.split(",")[0]
            }, lat: function () {
                return a.LeftDown.split(",")[1]
            }}
        }, getNorthEast: function () {
            return{lng: function () {
                return a.RightUp.split(",")[0]
            }, lat: function () {
                return a.RightUp.split(",")[1]
            }}
        }}
    }, DP_enableDragging: function () {
    }, DP_disableDragging: function () {
    }});
    return b
}
function DPMarker(b, a, d, c, e) {
    var f = new MMarker(b, a, d, c, e);
    DP.mix(f, {DP_choosePanel: function (a, b, d) {
        var d = d || {}, c = document, e = c.createElement("div"), f = c.createElement("div"), c = c.createElement("a");
        c.title = "\u5173\u95ed";
        1 == a && ($(e).css({"text-align": d.textAlign || "center", "background-color": "black", padding: "3px", zoom: 1, width: d.width || 190, height: d.height || "auto"}), $(f).css({"background-color": "white", padding: d.padding || "30px 10px 10px 0", "text-align": d.textAlign || "center", zoom: 1, height: "100%"}), $(c).css({background: "transparent url(http://i2.dpfile.com/s/css/img/dpui.gif) no-repeat 0 0",
            border: "solid 1px #EEE", height: "15px", width: "15px", position: "absolute", right: "10px", top: "12px", cursor: "pointer"}));
        "string" == typeof b ? f.innerHTML = b : $(f).grab(b);
        $(e).grab(c).grab(f);
        return{window: e, content: f, close: c}
    }, DP_getLatLng: function () {
        var a = this.pt;
        return new DPLatLng(a.lat, a.lon, this.maplet)
    }, DP_setLatLng: function (a) {
        this.setPoint(new MPoint(a.x, a.y));
        return this
    }, DP_bindInfoWindowHtml: function (a, b, d) {
        var c = this, a = c.DP_choosePanel(c.$style_index || 1, a, d);
        $(a.close).on("click", function () {
            c.DP_closeInfoWindow(!0)
        });
        c.info ? c.info.setContent(a.window) : (a = new MPanel({pin: !0, zindex: 5, mousewheel: !1, content: a.window}), c.$panel = a, MPanel.enableDragMap(a.dom, !1), c.maplet.addPanel(a), b = maplet_getWindowInfoXY(f, a), a.setLocation({type: "xy", x: b.x, y: b.y, pt: null}));
        return c
    }, DP_openInfoWindowHtml: function (a, b) {
        var c = this, d = maplet_getWindowInfoXY(c, c.$panel);
        c.$panel && c.$panel.setLocation({type: "xy", x: d.x, y: d.y});
        setTimeout(function () {
            c.openInfoWindow()
        }, 500);
        b && (c.$ops = b)
    }, DP_closeInfoWindow: function (a) {
        var b = this.$ops;
        this.maplet &&
        this.maplet.hideBubble();
        this.$panel && this.$panel.hide();
        b && a && b.onCloseFn && b.onCloseFn.call(this)
    }, DP_showInfoWindow: function () {
        var a = this;
        setTimeout(function () {
            a.DP_openInfoWindowHtml()
        }, 500)
    }, DP_hide: function () {
        this.icon && this.icon.img && (this.icon.img.style.display = "none")
    }, DP_show: function () {
        this.icon && this.icon.img && (this.icon.img.style.display = "")
    }, DP_setImage: function (a) {
        img = $(this.icon.img).getElement("img");
        img.src = a
    }, DP_getIcon: function () {
        return{image: this.icon.$DP_oldImgUrl}
    }});
    return f
}
function DPLatLng(b, a, d) {
    b = new MPoint(a, b);
    b.y = b.lat;
    b.x = b.lon;
    b.maplet = d;
    DP.mix(b, {DP_distanceFrom: function (a) {
        return this.maplet ? this.maplet.measDistance([this, a]) : 0
    }});
    return b
}
function DPIcon(b, a, d) {
    var b = new MIcon(b, a || 20, d || 34), c = $(b.div);
    DP.mix(b, {DP_addListener: function (a, b) {
        c.setStyle("cursor", "pointer");
        c.addEvent(a, b)
    }});
    return b
}
var DPEvent = {addListener: function (b, a, d) {
    var c;
    b instanceof Maplet && (c = b.getCenter());
    switch (a) {
        case "dblclick":
            a = "dbclick";
            break;
        case "zoomend":
            a = "zoom"
    }
    "dragend" == a ? (MEvent.addListener(b, "pan", function (a) {
        if (!c || !(a.lat == c.lat && a.lon == c.lon))c = this.getCenter(), d.call(this)
    }), MEvent.addListener(b, "zoom", function () {
        c = this.getCenter()
    })) : MEvent.addListener(b, a, d)
}};
function DPLabel(b) {
    b = new MLabel(b);
    DP.mix(b, {DP_setDisplay: function (a) {
        this.setVisible(a)
    }, DP_redraw: function () {
        var a = $(this.div).getSize(), b = this.DP_marker, c = (b.pt ? b.pt.mapY : b.y) - 27 > a.y, b = (b.pt ? b.pt.mapX : b.x) - 20 > a.x;
        c && b ? (c = -a.x, b = -a.y + 27) : c ? (c = 10, b = -a.y + 27) : b ? (c = -a.x, b = 27) : (c = 5, b = -1);
        this.resetLabel({xoffset: c || -a.x - 20, yoffset: b || -a.y})
    }, DP_addListener: function (a, b) {
        $(this.div).addEvent(a, b)
    }});
    b.div.className = "";
    return b
}
DP.define && DP.define(function () {
    return Map
});