var Map = new Class({Implements: [Events, Options], options: {css: null, zoom: 0, scale: 0, overview: 0, hold: !0, drag: !0, click: !0, flow: !1, wheel: !0, scaleLevel: null, contains: !1, settings: {digi: 16, add: 10, plus: 7, cha: 36, center: {lat: 34.957995, lng: 107.050781, isDef: !0}}, imgPath: "http://i1.dpfile.com/s/img/gmap/", draggerIcon: "dragger", draggerText: "\u62d6\u52a8\u6b64\u56fe\u6807\u5728\u5730\u56fe\u4e0a\u6807\u6ce8\u4f4d\u7f6e"}, initialize: function (a, b, c) {
    if (a = $(a))if (this.setOptions(c), this.ele = a, "array" != $type(b) && (b = [b]),
        this.options.css && a.setStyles(this.options.css), c = this.getMap(a, this.options.hold))this.options.zoom && c.addControl(1 == this.options.zoom ? new GLargeMapControl3D : 2 == this.options.zoom ? new GSmallMapControl : new GSmallZoomControl3D), this.options.scale && c.addControl(new GScaleControl, void 0 != this.options.logo && !this.options.logo ? new GControlPosition(G_ANCHOR_BOTTOM_LEFT, new GSize(5, 5)) : null), this.options.overview && c.addControl(new GOverviewMapControl), this.options.drag || c.disableDragging(), this.options.click &&
        c.enableDoubleClickZoom(), this.options.flow && c.enableContinuousZoom(), this.options.wheel && c.enableScrollWheelZoom(), this.init(a, b, c)
}, init: function (a, b, c) {
    if (a) {
        var b = this.checkPOI(b, this.options.settings.center), d = b[0];
        this.options.scaleLevel = d.isDef ? 4 : null != this.options.scaleLevel ? this.options.scaleLevel : 15;
        c.setCenter(new GLatLng(d.lat, d.lng), this.options.scaleLevel);
        (d.isCenter || d.isDef) && b.shift();
        0 < b.length && (this.initPoint = this.addPoint(a, b))
    }
}, checkPOI: function (a, b) {
    a || (a = Array(b));
    "array" !=
        $type(a) && (a = Array(a));
    for (var c = a.length, d = 0; d < c; d++) {
        var e = a[d] || "";
        if (e.poi) {
            var g = this.decode(e.poi);
            e.lat = g.lat;
            e.lng = g.lng;
            delete e.poi
        }
        if (!e.lat || !e.lng)if (b)for (var f in b)e[f] = b[f]; else a.splice(d, 1), c--
    }
    b && 1 > a.length && (a = Array(b));
    return a
}, decode: function (a) {
    var b = -1, c = 0, d = "", e = a.length, g = a.charCodeAt(e - 1), a = a.substring(0, e - 1);
    e--;
    for (var f = 0; f < e; f++) {
        var h = parseInt(a.charAt(f), this.options.settings.cha) - this.options.settings.add;
        h >= this.options.settings.add && (h -= this.options.settings.plus);
        d += h.toString(this.options.settings.cha);
        h > c && (b = f, c = h)
    }
    a = parseInt(d.substring(0, b), this.options.settings.digi);
    b = parseInt(d.substring(b + 1), this.options.settings.digi);
    g = (a + b - parseInt(g)) / 2;
    b = (b - g) / 1E5;
    return{lat: b, lng: g / 1E5}
}, getMap: function (a, b) {
    var c, d = a.retrieve("map");
    try {
        c = GBrowserIsCompatible
    } catch (e) {
    }
    if (!d || !b) {
        if (void 0 == c || !c())return;
        d = new GMap2(a);
        a.store("map", d)
    }
    return d
}, addPoint: function (a, b, c) {
    var a = this.getMap(a, !0), d = null;
    this.options.contains && (d = new GLatLngBounds);
    var e = [];
    if (a && !(1 > b.length)) {
        "array" != $type(b) && (b = Array(b));
        for (var g = 0; g < b.length; g++) {
            var f = b[g], h = null, j, f = this.checkPOI(f, (j = "function" == $type(f.dFn)) ? {lat: a.getCenter().lat(), lng: a.getCenter().lng()} : null)[0];
            j && (h = this.options.imgPath + this.options.draggerIcon + ".png");
            f.ico && (h = this.options.imgPath + f.ico + ".png");
            var h = f.GIcon ? f.GIcon : new GIcon(G_DEFAULT_ICON, h), k = new GLatLng(f.lat, f.lng), i = new GMarker(k, {icon: h, draggable: j});
            a.addOverlay(i);
            this.options.contains && d.extend(k);
            if (f.msg || j)j ? f.msg = {html: f.msg ||
                this.options.draggerText, open: 1} : f.msg = {html: f.msg || "", open: f.open}, i.bindInfoWindowHtml(f.msg.html), f.msg.open && i.openInfoWindowHtml(f.msg.html, c || {}), j && (GEvent.addListener(i, "dragstart", function () {
                f.dsFn && f.dsFn.call(this);
                i.closeInfoWindow()
            }), GEvent.addListener(i, "dragend", f.dFn)), "function" == typeof f.overFn && f.id && GEvent.addListener(i, "mouseover", f.overFn.bind(this, [a, i, f.msg.html, f.id])), "function" == typeof f.outFn && f.id && GEvent.addListener(i, "mouseout", f.outFn.bind(this, [a, i, f.msg.html, f.id])),
                "function" == typeof f.poiCallback && f.id && f.poiCallback(a, i, f.msg.html, f.id);
            e.push(i)
        }
        this.options.contains && a.setCenter(d.getCenter(), a.getBoundsZoomLevel(d));
        return 1 < e.length ? e : e[0]
    }
}}), SearchMap = new Class({Extends: Map, initialize: function (a, b, c) {
    this.wraper = $("searchBody");
    this.mapResult = $("map_result");
    this.mapLock = $("map_lock").getElement("input");
    this.mapLoading = $("map_loading");
    this.mapBody = $("map_body");
    this.mapCanvas = $("map_canvas");
    this.sKeyword = $("s_keyword");
    this.sChannel = $("s_channel");
    this.sDistance = $("s_distance");
    this.sButton = $("s_button");
    this.imgPath = "/s/img/gmap/";
    this.defaultKeyWord = "\u8bf7\u8f93\u5165\u5730\u6807or\u8def\u540d";
    this.mapLockStatus = !1;
    this.ajaxQueue = null;
    this.iconArray = "a,b,c,d,e,f,g,h,i,j".split(",");
    this.cityName = page.data.cEnName;
    this.resize();
    this.buildUI();
    this.parent(a, b, c);
    this.bindEvents();
    this.dragSearch(1, 1)
}, buildUI: function () {
    this.sKeyword.value = this.defaultKeyWord;
    this.mapLock.setProperty("checked", "");
    this.toggleDis(!1)
}, toggleDis: function (a) {
    this.sDistance.setStyle("display",
        a ? "" : "none")
}, toggleLock: function (a) {
    this.mapLock.setProperty("checked", a ? "checked" : "");
    this.mapLockStatus = a ? !0 : !1;
    this.toggleDis(a);
    a || this.dragSearch(1, 1)
}, checkKeyWord: function () {
    var a = this.sKeyword.value.trim();
    return"" == a || a == this.defaultKeyWord ? !1 : !0
}, resize: function () {
    var a = this.wraper, b = this.mapCanvas, c = this, d = function () {
        var d = window.getSize(), g = c.mapResult.getElement(".dl");
        960 > d.x ? a.setStyle("width", "960px") : a.setStyle("width", "auto");
        600 > d.y ? b.setStyle("height", "480px") : b.setStyle("height",
            d.y - 120);
        g && (600 > d.y ? g.setStyle("height", "380px") : g.setStyle("height", d.y - 220))
    };
    window.addEvent("resize", d);
    d()
}, rendHTML: function (a) {
    var b = a.sc, c = a.st, d = [], e = [], g = [];
    return a && b ? (g.push('<p class="map_count">\u5f53\u524d\u6709<strong>' + b + "</strong>\u4e2a\u641c\u7d22\u7ed3\u679c</p>"), "array" == $type(a.sl) && (d.push('<p class="dt">\u6392\u5e8f:<a href="#" class="' + (1 == c ? "on" : "") + '" id="order_1">\u4eba\u6c14</a>' + (a.poi ? '<a href="#" class="' + (2 == c ? "on" : "") + '" id="order_2">\u8ddd\u79bb</a>' : "") + '<a href="#" class="' +
        (3 == c ? "on" : "") + '" id="order_3">\u603b\u4f53\u8bc4\u4ef7</a></p>'), d.push('<div class="dl">'), a.sl.each(function (a, b) {
        d.push('<div id="Map_I_' + a.id + '"><ul class="s_item"><li class="s_item_title"><img class="mapMark" src="' + this.imgPath + (b + 1) + '.gif" oSrc="' + this.imgPath + (b + 1) + '.gif" /><a  class="BL" href="#">' + a.nm + '</a></li><li><span class="msstar' + a.pw + '"></span></li><li class="addr"><span>\u5730\u5740:&nbsp;</span><p>' + a.ad + "</p></li><li>" + (a.ds ? '<span class="Right">' + a.ds + "\u7c73</span>" : "") + "\u6807\u7b7e:&nbsp;" +
            a.tg + "</li></ul></div>")
    }, this), d.push("</div>")), g.push(d.join("")), e.push('<div class="map_pager"><ul class="box"><li><a href="#" title="' + (1 < a.pg ? a.pg - 1 : 1) + '" class="pageMovePre">\u4e0a\u4e00\u9875</a></li><li><strong>' + a.pg + "</strong>/<span>" + a.pc + '</span></li><li><a href="#" title="' + (a.pg < a.pc ? a.pg + 1 : a.pc) + '" class="pageMoveNext">\u4e0b\u4e00\u9875</a></li></ul></div>'), g.push(e.join("")), g.join("")) : '<p class="map_count">\u5f53\u524d\u6ca1\u6709\u641c\u7d22\u7ed3\u679c</p>'
}, bindEvents: function () {
    var a =
        this, b = this.getMap(this.ele, this.options.hold), c = function (b) {
        a.checkKeyWord() ? (a.toggleLock(!0), a.keywordSearch(b ? b : 1, 1)) : alert(a.defaultKeyWord)
    }, d = function () {
        $clear(a.ajaxQueue);
        a.ajaxQueue = setTimeout(function () {
            a.mapLockStatus || a.dragSearch(1, 1)
        }, 1E3)
    };
    this.sKeyword.addEvent("focus", function () {
        this.value.trim() == a.defaultKeyWord && (this.value = "")
    });
    this.sButton.addEvent("click", c);
    this.sChannel.addEvent("change", function () {
        a.checkKeyWord() ? (a.toggleLock(!0), a.keywordSearch(1, 1)) : a.toggleLock(!1)
    });
    this.sDistance.addEvent("change", function () {
        c(2)
    });
    GEvent.addListener(b, "dragend", d);
    GEvent.addListener(b, "dblclick", d);
    this.mapLock.addEvent("click", function () {
        $(this).getProperty("checked") ? a.toggleLock(!0) : a.toggleLock(!1)
    })
}, keywordSearch: function (a, b) {
    var c = this.sKeyword.value, d = this.sChannel.value;
    this.getSearchData({"do": "gsl", kw: c, gid: d, ds: this.sDistance.value, st: a, pg: b, bx1: 0, bx2: 0, by1: 0, by2: 0});
    pageTracker._trackPageview("dp_searchmap_" + this.cityName + "_" + d + "_" + c)
}, dragSearch: function (a, b) {
    var c =
        this.getMap(this.ele, this.options.hold).getBounds(), d = this.sChannel.value, e = c.getSouthWest().lng(), g = c.getNorthEast().lng(), f = c.getSouthWest().lat(), c = c.getNorthEast().lat();
    this.getSearchData({"do": "gsl", kw: "", gid: d, ds: "", st: a, pg: b, bx1: e, bx2: g, by1: f, by2: c})
}, getSearchData: function (a) {
    var b = this.getMap(this.ele, this.options.hold);
    (new AjaxReq({url: "/map.v", data: a, method: "post", onRequest: function () {
        this.mapLoading.setStyle("visibility", "visible")
    }.bind(this), onSuccess: function (c) {
        this.mapLoading.setStyle("visibility",
            "hidden");
        if (c && 200 == c.code) {
            var d, e, g, f, h = Browser.Engine.gecko;
            g = this.imgPath + "over.png";
            f = this.imgPath + "over.gif";
            e = new GIcon(G_DEFAULT_ICON);
            e.image = this.imgPath + "poi.png";
            e.iconSize = new GSize(35, 35);
            e.iconAnchor = new GPoint(17, 17);
            this.mapLockStatus ? d = [
                {poi: c.poi, msg: a.kw, GIcon: e}
            ] : d = [];
            var j = function (a, b, d, c) {
                a = $("Map_I_" + c);
                a.addEvent(h ? "mouseover" : "mouseenter", function () {
                    var a = $(this);
                    a.addClass("on");
                    a.getElement(".s_item_title a").addEvent("click", function () {
                        b.openInfoWindowHtml(d)
                    });
                    a.getElement(".mapMark").setProperty("src",
                        f);
                    b.setImage(g)
                });
                a.addEvent(h ? "mouseout" : "mouseleave", function () {
                    var a = $(this);
                    a.removeClass("on");
                    a.getElement(".s_item_title a").removeEvents("click");
                    a = a.getElement(".mapMark");
                    a.setProperty("src", a.getProperty("oSrc"));
                    b.setImage(b.getIcon().image)
                })
            }, k = function (a, b, d, c) {
                b && c && (b.setImage(g), $("Map_I_" + c).fireEvent(h ? "mouseover" : "mouseenter"))
            }, i = function (a, b, d, c) {
                b && c && (b.setImage(b.getIcon().image), $("Map_I_" + c).fireEvent(h ? "mouseout" : "mouseleave"))
            };
            c.sl && c.sl.each(function (a, b) {
                d.push({poiCallback: j,
                    overFn: k, outFn: i, id: a.id, poi: a.poi, ico: b + 1, msg: '<div class="map_item"><h1><a href="/shop/' + a.id + '" class="BL">' + a.nm + '</a></h1><div class="map_item_cont"><a href="/upload/shop/' + a.id + '"><img src="' + a.pi + '" /></a><span class="msstar' + a.pw + '"></span><div class="addr"><span>\u5730\u5740:</span><div>' + a.ad + "</div></div>" + (a.ph ? "<p>\u7535\u8bdd:" + a.ph + "</p>" : "") + "<p>" + ("0" == a.rc ? "" : '<a class="BL" href="/shop/' + a.id + '#ur">' + a.rc + "\u5c01\u70b9\u8bc4</a>") + ("0" == a.pc ? "" : '<a style="margin-left:15px" class="BL" href="/shop/' +
                        a.id + '/photos">' + a.pc + "\u5f20\u56fe\u7247</a>") + "</p></div></div>"})
            }, this);
            this.mapResult.empty().set("html", this.rendHTML(c));
            e = this.mapResult.getElement(".dl");
            var l = window.getSize();
            e && (600 > l.y ? e.setStyle("height", "380px") : e.setStyle("height", l.y - 220));
            this.mapResult.getElements(".dt a").each(function (a) {
                var b = this;
                a.addEvent("click", function () {
                    b[b.mapLockStatus ? "keywordSearch" : "dragSearch"]($(this).getProperty("id").split("_")[1].toInt(), 1)
                })
            }, this);
            this.mapResult.getElements(".map_pager a").each(function (a) {
                var b =
                    this;
                a.addEvent("click", function () {
                    b[b.mapLockStatus ? "keywordSearch" : "dragSearch"](c.st, $(this).getProperty("title").toInt())
                })
            }, this);
            b.clearOverlays();
            this.mapLockStatus ? this.init(this.ele, d, b) : this.addPoint(this.ele, d)
        }
    }.bind(this), onError: function () {
        this.mapLoading.setStyle("visibility", "hidden");
        alert("\u6570\u636e\u83b7\u53d6\u8d85\u65f6,\u8bf7\u91cd\u8bd5")
    }.bind(this)})).send()
}}), LocMap = new Class({Implements: [Events, Options], options: {selectWrapEle: "locMapSel", setLocBtn: "locMapSet", mapWrapEle: "locMapCanvas",
    setOkBtn: "locMapOk", citySwitchEle: "locCitySwitch", icoPath: "/s/css/img/g.comm.png", onCallback: $empty}, initialize: function (a) {
    this.setOptions(a);
    this.status = 0;
    this.liveList = [];
    this.livePoi = "";
    this.liveCity = [];
    this.workList = [];
    this.workPoi = "";
    this.workCity = [];
    this.headCity = [];
    this.selCity = null;
    this.getDefLoc()
}, getDefLoc: function () {
    (new AjaxReq({url: "/location.v", method: "post", callType: "json", data: {"do": "getDefLoc"}, onSuccess: function (a) {
        200 == a.code ? (this.status = 1, this.setDefData(a.msg)) : 100 == a.code ?
            DP.authBox(a.msg) : alert("\u6570\u636e\u52a0\u8f7d\u5931\u8d25\uff0c\u8bf7\u91cd\u8bd5!")
    }.bind(this)})).send()
}, getRegion: function (a, b) {
    var c;
    (new AjaxReq({url: "/location.v", method: "post", callType: "json", async: !1, data: {"do": "getRegion", a: a, b: b}, onSuccess: function (a) {
        200 == a.code ? c = a.msg.data : 100 == a.code ? DP.authBox(a.msg) : alert("\u6570\u636e\u52a0\u8f7d\u5931\u8d25\uff0c\u8bf7\u91cd\u8bd5!")
    }.bind(this)})).send();
    return c
}, setLoc: function (a, b, c, d) {
    (new AjaxReq({url: "/location.v", method: "post", callType: "json",
        data: {"do": "setLoc", a: a, b: b, c: c, d: d}, onSuccess: function (b) {
            200 == b.code ? (this.setDefData(b.msg, a), this.fireEvent("callback")) : 100 == b.code ? DP.authBox(b.msg) : alert("\u6570\u636e\u8bbe\u7f6e\u5931\u8d25\uff0c\u8bf7\u91cd\u8bd5!")
        }.bind(this)})).send()
}, setDefData: function (a, b) {
    if (a)switch (b) {
        case 1:
            this.liveList = a.live_list || [];
            this.livePoi = a.live_poi || "";
            this.liveCity = a.live_city || [];
            break;
        case 2:
            this.workList = a.work_list || [];
            this.workPoi = a.work_poi || "";
            this.workCity = a.work_city || [];
            break;
        default:
            this.liveList =
                a.live_list || [], this.livePoi = a.live_poi || "", this.liveCity = a.live_city || [], this.workList = a.work_list || [], this.workPoi = a.work_poi || "", this.workCity = a.work_city || [], this.headCity = a.head_city || []
    }
}, getData: function (a) {
    var b = [];
    switch (a) {
        case 1:
            b.push(this.liveList);
            b.push(this.livePoi);
            b.push(this.liveCity);
            break;
        case 2:
            b.push(this.workList), b.push(this.workPoi), b.push(this.workCity)
    }
    return b
}, getSelPoi: function (a) {
    if (a && a.length) {
        var b = a[a.length - 1], c;
        b.list.each(function (a) {
            a.id == b.sid && (c = a.poi)
        });
        return c
    }
    return""
}, rendSelect: function (a) {
    var b = [];
    a && a.each(function (a, d) {
        var e = [];
        e.push('<select id="loc_' + d + '" style="margin-left:12px">');
        a.list.each(function (b) {
            e.push('<option value="' + b.id + '" p="' + b.poi + '" ' + (a.sid == b.id ? "selected=selected" : "") + ">" + b.name + "</option>")
        });
        e.push("</select>");
        b.push(e.join(""))
    });
    return b
}, rendMap: function (a, b) {
    if (a)return new Map(a, [b], {zoom: 1})
}, moveMap: function (a) {
    var b = this.mapCanvas, c = b.checkPOI({poi: a}), a = b.getMap(this.mapEle, !0), c = new DPLatLng(c[0].lat,
        c[0].lng);
    a.DP_setCenter(c, b.options.scaleLevel)
}, bindSelEvent: function (a) {
    for (var b = this, c = this.options, d = 0, e; d < a; d++)(e = $("loc_" + d)) && d != a - 1 ? e.addEvent("change", function () {
        var a = $(this.options[this.selectedIndex]).value, d, e, a = b.getRegion(a, b.selCity[0]);
        d = b.rendSelect(a);
        b.selectCount = e = d.length;
        $(c.selectWrapEle) && $(c.selectWrapEle).empty().set("html", d.join(""));
        b.bindSelEvent(e);
        b.moveMap(b.getSelPoi(a))
    }) : e.addEvent("change", function () {
        var a = $(this.options[this.selectedIndex]);
        b.moveMap(a.getProperty("p"))
    })
},
    open: function (a) {
        if (this.status) {
            var b = this, c = this.options, d = [], e = this.getData(a), g = this.rendSelect(e[0]), f = g.length, h, j, k, i, l = [], n, m;
            this.selectCount = f;
            this.selCity = e[2];
            d.push('<div class="DialogTitle">\u9009\u62e9\u7ecf\u5e38\u6d3b\u52a8\u7684\u533a\u57df</div>');
            this.selCity[0] !== this.headCity[0] && d.push('<div id="' + c.citySwitchEle + '" style="line-height:25px;padding:5px 12px;margin:20px 20px 0;background:#ffffcb;color:#d37724;border:1px solid #d0cfbd;"><span class="Warning"></span>\u63d0\u9192\uff1a \u60a8\u5f53\u524d\u662f\u5728\u5927\u4f17\u70b9\u8bc4\u7f51' +
                this.headCity[1] + "\u7ad9\uff0c\u662f\u5426\u9700\u8981\u5207\u6362\u5230" + this.headCity[1] + '\u5730\u56fe&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a href="#" class="B" data="1">\u5207\u6362</a>&nbsp;&nbsp;&nbsp;&nbsp;<a href="#" class="B" data="0">\u4e0d\u5207\u6362</a></div>');
            d.push('<div class="DialogContent" style="line-height:21px;font-size:12px;padding:0 10px">');
            d.push('<div style="padding-top:10px"><span style="color:#FF0000;margin-right:5px">*</span>\u9009\u62e9\u5546\u533a:<span id="' +
                c.selectWrapEle + '">' + g.join("") + "</span></div>");
            d.push('<p style="padding:10px 0 0 10px">\u7cbe\u786e\u4f4d\u7f6e:&nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#CC0000">\u6807\u6ce8\u7cbe\u786e\u4f4d\u7f6e\uff0c\u80fd\u4f7f\u5339\u914d\u7ed9\u60a8\u7684\u5185\u5bb9\u66f4\u52a0\u51c6\u786e\u3002</span></p>');
            d.push('<p style="padding-left:73px" class="box"><span style="float:left;color:#999999;padding-right:10px">\u5728\u5730\u56fe\u4e0a\u627e\u5230\u7cbe\u786e\u4f4d\u7f6e\u540e\uff0c\u70b9\u51fb\u201c\u6807\u6ce8\u4f4d\u7f6e\u201d\u6309\u94ae\u6807\u6ce8</span><span id="' +
                c.setLocBtn + '" style="cursor:pointer;float:left;width:89px;height:21px;background:url(' + c.icoPath + ') 0 -1940px no-repeat"></span></p>');
            d.push("</div>");
            d.push('<div id="' + c.mapWrapEle + '" style="width:800px;height:400px;"></div>');
            d.push('<div class="DialogButtons">');
            d.push('<button type="button" id="' + c.setOkBtn + '">\u786e\u5b9a</button><button type="button" onclick="Mbox.close()">\u53d6\u6d88</button>');
            d.push("</div>");
            Mbox.open({type: "string", size: {x: 800, y: this.selCity[0] !== this.headCity[0] ? 640 :
                590}, url: d.join("")});
            (i = $(c.citySwitchEle)) && i.getElements("a").addEvent("click", function () {
                $(this).getProperty("data").toInt() && (b.selCity = b.headCity, b.selectCount && $("loc_0").fireEvent("change"));
                Mbox && Mbox.win.setStyle("height", "590px");
                i.dispose()
            });
            this.mapEle = j = $(c.mapWrapEle);
            d = e[1] ? {poi: e[1]} : {poi: this.getSelPoi(e[0]), isCenter: !0};
            this.mapCanvas = h = this.rendMap(j, d);
            this.bindSelEvent(f);
            (f = $(c.setLocBtn)) && f.addEvent("click", function () {
                h.getMap(j, !0).DP_clearOverlays(!0);
                this.$markerEdit &&
                this.$markerEdit.DP_closeInfoWindow();
                this.$markerEdit = h.addPoint(j, {id: $random(1, 1E3), dFn: function () {
                    var a = this.DP_getLatLng();
                    n = a.y;
                    m = a.x
                }, poiCallback: function (a, b) {
                    var d;
                    b && (d = b.DP_getLatLng(), n = d.y, m = d.x)
                }})
            });
            (k = $(c.setOkBtn)) && k.addEvent("click", function () {
                l.push(this.selCity[0]);
                for (var b = 0, d; b < this.selectCount; b++)(d = $("loc_" + b)) && l.push(d.value);
                this.setLoc(a, l.join(","), n, m)
            }.bind(this))
        } else alert("\u6b63\u5728\u52a0\u8f7d\u6570\u636e,\u8bf7\u7a0d\u540e")
    }}), $Favorite = function (a, b, c, d) {
    if ("number" ==
        $type(a)) {
        var e = "referId=" + a + "&favorType=" + b;
        1 != b ? $FavoriteOther(a, b, c, d) : (new DP.JSONP({url: "/member/jsonp/loadFavorTag", method: "get", data: e, onRequest: function () {
            Mbox.openLite('<p class="Doing">\u6b63\u5728\u5904\u7406\uff0c\u8bf7\u7a0d\u5019....</p>', 200, 30)
        }, onSuccess: function (e) {
            Mbox.close();
            if (e && 200 == e.code) {
                var f = (new Element("div")).setStyles({margin: "10px 10px 30px 15px"}), h = e.msg.shopTagNameList || [], j = e.msg.personTagNameList || [], k = [], i = "<p>\u3000\u3000\u5546\u6237: " + d + "</p>", i = i + ('<p>\u6536\u85cf\u6807\u7b7e: <input id="dp_favTags" type="text" maxlength="100" style="width:280px" value="' +
                    (e.msg.hasSelectedTags ? decodeURIComponent(e.msg.hasSelectedTags) : "") + '" /></p>');
                f.appendHTML(i + '<div id="dp_favList"></div>');
                var i = (new Element("div")).setStyles({margin: "10px 0", textAlign: "center", zoom: 1, position: "relative"}), l = (new Element("div")).addClass("Hide").setStyles({color: "#c00", position: "absolute", left: 0}).inject(i), n = (new Element("button")).setStyles({margin: "0 5px"}).set("html", "\u63d0\u4ea4").addEvent("click", function () {
                    var d = $("dp_favTags").get("value") || "", c = d.trim().split(" ");
                    if (5 < c.length)return l.removeClass("Hide").set("html", "\u6807\u7b7e\u4e0d\u80fd\u591a\u4e8e5\u4e2a"), !1;
                    if (c.some(function (a) {
                        return 10 < a.length
                    }))return l.removeClass("Hide").set("html", "\u6807\u7b7e\u6700\u591a10\u5b57"), !1;
                    Mbox.close();
                    $Favorite.submit(a, b, d, e.msg.favored ? "update" : "add")
                });
                i.adopt(n);
                if (e.msg.favored) {
                    var m = (new Element("button")).setStyles({margin: "0 5px"}).set("html", "\u5220\u9664").addEvent("click", function () {
                        Mbox.close();
                        $Favorite.del(a, b, c)
                    });
                    i.adopt(m)
                }
                m = (new Element("button")).setStyles({margin: "0 5px"}).set("html",
                        "\u53d6\u6d88").addEvent("click", function () {
                        Mbox.close()
                    });
                i.adopt(m);
                f.adopt(i);
                h && "array" == $type(h) && k.push({name: "\u70ed\u95e8\u6807\u7b7e", tags: h});
                j && "array" == $type(j) && k.push({name: "\u6211\u7684\u6807\u7b7e", tags: j});
                Mbox.open({url: $dialog((e.msg.favored ? "\u4fee\u6539" : "\u6dfb\u52a0") + "\u6536\u85cf", [f]), size: {x: 400, y: "auto"}, closable: !0});
                "class" == $type(TagSelector) && new TagSelector("dp_favTags", "dp_favList", {data: k});
                n.focus()
            } else 100 == e.code ? DP.authBox("\u6536\u85cf\u5546\u6237", "", "shoucang") :
                (Mbox.openLite('<p class="Doing">' + e.msg || "\u53d1\u751f\u672a\u77e5\u9519\u8bef\uff0c\u8bf7\u7a0d\u5019\u518d\u8bd5\uff01</p>", 280, "auto"), setTimeout(function () {
                    Mbox.close()
                }, 1500))
        }, onError: function () {
            Mbox.openLite('<p class="Doing">\u64cd\u4f5c\u5931\u8d25\uff0c\u8bf7<a href="#" onclick="Mbox.close()">\u8fd4\u56de</a></p>', 200, 30)
        }})).send()
    }
}, $FavoriteOther = function (a, b, c, d) {
    "number" == $type(a) && (new DP.JSONP({url: "/member/jsonp/isFavored", method: "get", data: "referId=" + a + "&favorType=" + b, onSuccess: function (e) {
        Mbox.close();
        var g = {2: "\u70b9\u8bc4", 3: "\u699c\u5355", 4: "\u5e16\u5b50"};
        if (e && 200 == e.code) {
            var f = g[b], g = [], h = [];
            g.push('<div class="favoriteBox">');
            g.push("<p>\u3000" + f + ": " + d + "</p>");
            g.push("</div>");
            f = e.msg.favored ? (new Element("button")).set("html", "\u5220\u9664").addEvent("click", function () {
                Mbox.close();
                $Favorite.del(a, b, c)
            }) : (new Element("button")).set("html", "\u63d0\u4ea4").addEvent("click", function () {
                Mbox.close();
                $Favorite.submit(a, b, "", "add")
            });
            h.push(f);
            f = (new Element("button")).set("html", "\u53d6\u6d88").addEvent("click",
                function () {
                    Mbox.close()
                });
            h.push(f);
            Mbox.openLite($dialog((e.msg.favored ? "\u5220\u9664" : "\u6dfb\u52a0") + "\u6536\u85cf", g.join(""), h), 300, "auto", {closable: !0})
        } else 100 == e.code ? DP.authBox("\u6536\u85cf" + g[b], "", "shoucang") : (Mbox.openLite('<p class="Doing">' + e.msg || "\u53d1\u751f\u672a\u77e5\u9519\u8bef\uff0c\u8bf7\u7a0d\u5019\u518d\u8bd5\uff01</p>", 280, "auto"), setTimeout(function () {
            Mbox.close()
        }, 1500))
    }, onError: function () {
        Mbox.openLite('<p class="Doing">\u64cd\u4f5c\u5931\u8d25\uff0c\u8bf7<a href="#" onclick="Mbox.close()">\u8fd4\u56de</a></p>',
            200, 30)
    }})).send()
};
$Favorite.submit = function (a, b, c, d) {
    Mbox.openLite('<p class="Doing">\u6b63\u5728\u6536\u85cf\uff0c\u8bf7\u7a0d\u5019......</p>', 280, 30);
    (new DP.JSONP({url: "/member/jsonp/" + d + "Favor", data: {referId: a, favorType: b, favorTags: encodeURIComponent(encodeURIComponent(c.trim().split(" ").join("|")))}, method: "post", onSuccess: function (a) {
        Mbox.close();
        a && 200 == a.code ? 1 == b ? (a = "<div class='DialogContent'><div class='collect-succeed'><i class='suc-icon'></i><p>\u6536\u85cf\u6210\u529f\uff0c\u53bb\u770b\u770b<a href='/member/" + DP.data("userID") +
            "/wishlists' target='_blank' onclick='pageTracker._trackPageview(&quot;dp_shop_caozuo_shoucang_sucess&quot;);'>\u6211\u7684\u6536\u85cf</a>\u5427\uff01</p><p class='tips'>\u65b0\u6536\u85cf\u5546\u6237\u7684\u663e\u793a\u4f1a\u6709\u4e00\u70b9\u5ef6\u8fdf\u54e6</p></div><div class='succ-btn'><input type='button' value='\u5173\u95ed' name='' class='closeMboxBtn' onclick='DP.mbox.close()'></div></div>", DP.mbox.open({winCls: "pop-win  win-collect", type: "string", size: {x: 400, y: 144}, url: a})) : (Mbox.openLite('<p class="Doing">' +
            (a && 200 == a.code ? "\u6536\u85cf\u6210\u529f" : "\u53d1\u751f\u672a\u77e5\u9519\u8bef\uff0c\u8bf7\u7a0d\u5019\u518d\u8bd5\uff01") + "</p>", 280, 30), setTimeout(function () {
            Mbox.close()
        }, 1500)) : (Mbox.openLite('<p class="Doing">\u53d1\u751f\u672a\u77e5\u9519\u8bef\uff0c\u8bf7\u7a0d\u5019\u518d\u8bd5\uff01</p>', 280, 30), setTimeout(function () {
            Mbox.close()
        }, 1500))
    }, onError: function () {
        Mbox.openLite('<p class="Doing">\u64cd\u4f5c\u5931\u8d25\uff0c\u8bf7<a href="#" onclick="Mbox.close()">\u8fd4\u56de</a></p>', 200, 30)
    }})).send()
};
$Favorite.del = function (a, b, c) {
    (new Prompt).confirm(["\u5220\u9664\u6536\u85cf", "\u786e\u5b9a\u8981\u5220\u9664\u6b64\u6536\u85cf\u8bb0\u5f55\u5417\uff1f"], {onReturn: function (d) {
        d && (Mbox.openLite('<p class="Doing">\u6b63\u5728\u5220\u9664\uff0c\u8bf7\u7a0d\u5019......</p>', 280, 30), (new DP.JSONP({url: "/member/jsonp/deleteFavor?referId=" + a + "&favorType=" + b, onSuccess: function (a) {
            Mbox.openLite('<p class="Doing">' + (a && 200 == a.code ? "\u5220\u9664\u6210\u529f" : "\u53d1\u751f\u672a\u77e5\u9519\u8bef\uff0c\u8bf7\u7a0d\u5019\u518d\u8bd5\uff01") +
                "</p>", 280, 30);
            c ? window.setTimeout("location.reload();", 1E3) : setTimeout(function () {
                Mbox.close()
            }, 1500)
        }, onError: function () {
            Mbox.openLite('<p class="Doing">\u64cd\u4f5c\u5931\u8d25\uff0c\u8bf7<a href="#" onclick="Mbox.close()">\u8fd4\u56de</a></p>', 200, 30)
        }})).send())
    }})
};
(function (a) {
    var b = new Class({Implements: Options, options: {wrapId: null, btnCls: ["normal", "active", "diabled"], event: "click"}, initialize: function (a) {
        this.setOptions(a)
    }, zan: function (a, b) {
        this.preSubmit(a, b)
    }, preSubmit: function (a, b) {
        var c = a.get("data-zaned");
        this._clickedData = c;
        0 == c ? this.add(a, b) : 1 == c ? this.del(a, b) : 2 == c && this.openLite("\u4e0d\u80fd\u7ed9\u81ea\u5df1\u8d5e\uff01")
    }, getClickedData: function () {
        return this._clickedData
    }, submit: function (d, c, g, f) {
        var h = this;
        (new AjaxReq({method: "post", url: "/ajax/json/shoppic/picture/flower",
            noCache: !0, data: {i: c, "do": g}, onRequest: function () {
            }, onError: function () {
                b.openLite("\u5f88\u62b1\u6b49\uff0c\u60a8\u7684\u8d5e\u63d0\u4ea4\u5931\u8d25\uff01")
            }, onSuccess: function (j) {
                var j = j || !1, k = j.code || !1, i = j.msg || !1;
                j && 100 == k ? i = j.msg || !1 : 403 == k || 302 == k ? b.openLite(j.msg, !0, !0, !0) : 401 == k ? a.authBox(j.msg, function () {
                    h.submit(d, c, g, b.refresh)
                }) : b.openLite(j.msg || "\u53d1\u751f\u672a\u77e5\u9519\u8bef\uff0c\u8bf7\u7a0d\u5019\u518d\u8bd5\uff01");
                i && (f && f() || h.update(i.c, d, i.z || void 0))
            }})).send()
    }, add: add =
        function (a, b, c) {
            this.submit(a, b, "aa", c)
        }, del: function (a, b, c) {
        this.submit(a, b, "dd", c, {title: "\u8d5e\u4e00\u4e2a", content: "\u4f60\u8fd8\u6ca1\u6709\u8d5e\u8fc7\uff0c\u8d5e\u4e00\u4e2a\uff1f"})
    }, update: function (a, b, c) {
        var f = this;
        if (void 0 !== a && b && void 0 !== c) {
            f.getClickedData();
            var h = document.id(b.get("data-refer")) || !1;
            h ? [h, b].forEach(function (b) {
                f.updateView(a, b, c, void 0)
            }) : f.updateView(a, b, c, void 0)
        }
    }, updateView: function (a, b, c) {
        var f = f || "Hide", h = h || b.getNext(".digg-count");
        b.set("data-zaned", c);
        b.className =
            this.options.btnCls[c];
        h.hasClass(f) && h.removeClass(f);
        h.getElement("strong").set("html", a)
    }});
    a.mix(b, {refresh: function () {
        location.reload()
    }, openLite: function (c, e, g, f) {
        var e = e || !0, f = f || !1, h = null, j = j || a.mbox;
        j.openLite('<div style="visibility: visible;" class="ele-wrap wrap pop-msg-item"><div class="dialog-cont">' + c + ' <a href="#" class="close-txt" id="closeBtn">[\u5173\u95ed]</a> </div></div>', 289, 58);
        $("closeBtn").addEvent("click", function () {
            f ? b.refresh() : b.close();
            clearTimeout(h);
            return!1
        });
        e &&
            f && setTimeout(b.refresh, 1500) || (h = setTimeout(b.close, 1500))
    }, close: function () {
        a.mbox.close()
    }});
    var c = new b({btnCls: ["digg-btn", "digg-btn on", "digg-btn diabled"]});
    window.$Zan = function (a, b) {
        c.zan(a, b)
    }
})(DP);
function $PicReport(a, b, c) {
    $PicReport.dialog(a, b, c)
}
$PicReport.hasDper = function () {
    return!!Cookie.read("dper")
};
(function (a) {
    var b = DP.mbox;
    a.mix($PicReport, {netError: function () {
        $PicReport.openLite("\u7f51\u7edc\u9519\u8bef\uff0c\u8bf7\u91cd\u8bd5")
    }, refresh: function () {
        location.reload()
    }, openLite: function (b, d, e, g) {
        var d = d || !0, g = g || !1, f = null, h = h || a.mbox;
        h.openLite('<div style="visibility: visible;" class="ele-wrap wrap pop-msg-item"><div class="dialog-cont">' + b + ' <a href="#" class="close-txt" id="closeBtn">[\u5173\u95ed]</a> </div></div>', 295, 58);
        $("closeBtn").addEvent("click", function () {
            g ? $PicReport.refresh() :
                $PicReport.close();
            clearTimeout(f);
            return!1
        });
        d && g && setTimeout($PicReport.refresh, 1500) || (f = setTimeout($PicReport.close, 1500))
    }, close: function () {
        a.mbox.close()
    }, dialog: function (c, d, e) {
        var g = b.dialog("\u56fe\u7247\u4e3e\u62a5", ""), f = g.getElement(".dialog-cont"), h, j, k = null, i = null, l = null;
        hideCls = "Hide";
        bind_event = function (b, c) {
            (b = a.isString(b) ? f.getElement(b) : b) && b.addEvent("click", c)
        };
        showError = function (a) {
            h ? h.set("text", a).removeClass(hideCls) : (h = new Element("div", {"class": "pop-msg-box pmb-error",
                text: a})).inject(f, "top")
        };
        hideError = function () {
            h && h.addClass(hideCls)
        };
        reportDetail = function () {
            var b;
            return function (c, d, f) {
                b ? b.removeClass(hideCls) : (d.getParent().grab(b = c, "bottom"), new a.Form.PlaceHolder(c.getElement(f)))
            }
        };
        hideDetail = function (a) {
            a.addClass(hideCls)
        };
        repeatReport = function (a) {
            var b = reportDetail();
            bind_event(a, function () {
                b(new Element("div", {"class": "form-block", html: '<input type="text" placeholder="\u8bf7\u9644\u4e0a\u91cd\u590d\u4e0a\u4f20\u56fe\u7247\u7684\u94fe\u63a5" rows="" cols="" class="form-txt" maxlength="300">'}),
                    a, "input");
                k = a
            })
        };
        customReport = function (a) {
            var b = reportDetail();
            bind_event(a, function () {
                b(new Element("div", {"class": "form-block", html: '<textarea placeholder="\u8bf7\u5728\u8f93\u5165\u6846\u5185\u586b\u5199\u6216\u91cd\u65b0\u9009\u62e9\u539f\u56e0" class="form-textarea" rows="" cols=""></textarea>'}), a, "textarea");
                k = a
            })
        };
        selectReport = function () {
            (j = $$(".chk-list")).getElements("input[type=radio]").forEach(function (a) {
                a.addEvent("click", function (a) {
                    a = a.target;
                    k && "radio" == a.get("type") && a != k && (hideDetail(k.getParent().getLast()),
                        k = null);
                    hideError()
                })
            })
        };
        checkReport = function () {
            if (i = j[0].getElement("input:checked")) {
                var a = i.getNext("div.form-block");
                if (a && "none" != a.getStyle("display")) {
                    var b = a.getChildren()[0], c, a = b.get("value"), b = b.get("placeholder");
                    l = a;
                    if (a != b && 0 < (c = a.length))return 300 < c ? (showError("\u4e3e\u62a5\u4e0d\u80fd\u8d85\u8fc7300\u4e2a\u5b57"), !1) : !0;
                    showError(b);
                    return!1
                }
                l = i.getNext("label").get("text");
                return!0
            }
            showError("\u8bf7\u9009\u62e9\u4e3e\u62a5\u539f\u56e0!");
            return!1
        };
        bindMboxClose = function (a) {
            $$(".close-txt").addEvent("click",
                function () {
                    a && a() || b.close();
                    return!1
                })
        };
        resultPopUp = function () {
            return{success: function () {
                $PicReport.openLite("\u63d0\u4ea4\u6210\u529f\uff01\u611f\u8c22\u60a8\u5bf9\u5927\u4f17\u70b9\u8bc4\u7f51\u7684\u652f\u6301\u3002", !0, !0, $PicReport.needRefresh)
            }, fail: function (a) {
                $PicReport.openLite(a || "\u5f88\u62b1\u6b49\uff0c\u60a8\u7684\u62a5\u9519\u7533\u8bf7\u63d0\u4ea4\u5931\u8d25\uff01")
            }}
        };
        sendReport = function (c, d, f, e) {
            var h = a.data("reportSetting"), g = h.feedPrefix + "[" + i.getNext("label").get("text") + "]-" +
                f + h.feedSuffix;
            (new AjaxReq({url: "/newfeedbackforpoi", method: "post", noCache: !0, data: {referID: c, causeType: k && k.value || i && i.value, feedComments: l, feedType: h.feedType, feedTitle: g, referShopID: h.referShopID, cityID: h.cityID, referUserID: d}, onRequest: function () {
            }, onSuccess: function (h) {
                200 == h.code ? (resultPopUp().success(), l = i = k = null) : 401 == h.code ? (b.close(), a.authBox("\u672a\u767b\u5f55", function () {
                    sendReport(c, d, f);
                    $PicReport.needRefresh = !0
                })) : resultPopUp().fail(h.msg || void 0);
                e && e()
            }, onError: function () {
                resultPopUp().fail()
            }})).send()
        };
        f.set("html", '<div class="pop-win-inner"><p class="form-intro">\u8bf7\u9009\u62e9\u4e00\u9879\u4e3e\u62a5\u539f\u56e0\u518d\u63d0\u4ea4\uff1a</p><fieldset><ul class="chk-list"><li><input type="radio" class="chk-item" id="r-a" name="report-radio" value="100"><label for="r-a">\u65e0\u5173\u56fe\u7247</label></li><li><input type="radio" class="chk-item" id="r-b" name="report-radio" value="101"><label for="r-b">\u91cd\u590d\u4e0a\u4f20</label></li><li><input type="radio" class="chk-item" id="r-c" name="report-radio" value="102"><label for="r-c">\u76d7\u56fe</label></li><li><input type="radio" class="chk-item" id="r-d" name="report-radio" value="103"><label for="r-d">\u8272\u60c5\u8fdd\u89c4</label></li><li><input type="radio" class="chk-item" id="r-e" name="report-radio" value="104"><label for="r-e">\u64b0\u5199\u81ea\u5df1\u7684\u539f\u56e0</label></li></ul></fieldset><div class="pop-btn-wrapper"> <span class="btn-type-a btn-fn-a"><a href="#" class="form-btn" id="pr_submit">\u63d0\u4ea4</a></span> <span class="btn-type-a btn-fn-b"><a href="#" class="form-btn" id="pr_cancel">\u53d6\u6d88</a></span> </div></div>');
        bind_event("#pr_cancel", function () {
            var a = $PicReport;
            a.needRefresh ? a.refresh() : b.close();
            return!1
        });
        bind_event("#pr_submit", function (a) {
            a.stop();
            checkReport() && (hideError(), sendReport(c, d, e))
        });
        b.open({url: g, size: {x: 300}});
        selectReport();
        repeatReport($("r-b"));
        customReport($("r-e"))
    }})
})(DP);
function getAjaxAddr(a) {
    return 2 == a ? "/ajax/json/pic/flower" : 1 == a ? DP.data("ajaxSwitch") && 1 == DP.data("ajaxSwitch") ? "/ajax/json/shop/reviewflower" : "/rate.v" : "/rate.v"
}
var $Praise = function (a, b, c, d) {
    if ("number" == $type(b)) {
        var e = "do=a&i=" + b + "&t=" + c;
        (new Request.JSON({method: "get", url: getAjaxAddr(c), data: e, noCache: !0, onRequest: function () {
            Mbox.openLite('<p class="Doing">\u6b63\u5728\u5904\u7406\uff0c\u8bf7\u7a0d\u5019....</p>', 200, 30)
        }, onSuccess: function (e) {
            Mbox.close();
            if (e && 100 == e.code) {
                var e = e.msg.r || [], f = (new Element("ul")).addClass("rateBox");
                e.each(function (e) {
                    (new Element("li")).set("html", '<a href="javascript:void(0)" class="send" style="background-image: url(' +
                            e.m + ')">' + e.t + "</a>").addEvent("click",function () {
                            $Praise.submit(a, b, c, e.i, d)
                        }).inject(f)
                });
                Mbox.openLite($dialog("\u9009\u4e00\u6735\u9c9c\u82b1\u5427", [f], []), 430, 120, {closable: !0})
            } else 302 == e.code ? (new Prompt).confirm(["\u5220\u9664\u9c9c\u82b1", "\u60a8\u5df2\u9001\u8fc7\u9c9c\u82b1\u3002\u662f\u5426\u8981\u5220\u9664\uff1f"], {onReturn: function (e) {
                e && $Praise.del(a, b, c, d)
            }}) : 401 == e.code ? DP.authBox("\u9c9c\u82b1\u652f\u6301", "", "xianhua") : (Mbox.openLite('<p class="Doing">' + e.msg || "\u53d1\u751f\u672a\u77e5\u9519\u8bef\uff0c\u8bf7\u7a0d\u5019\u518d\u8bd5\uff01</p>",
                280, "auto"), setTimeout(function () {
                Mbox.close()
            }, 1500))
        }, onError: function () {
            Mbox.openLite('<p class="Doing">\u64cd\u4f5c\u5931\u8d25\uff0c\u8bf7<a href="#" onclick="Mbox.close()">\u8fd4\u56de</a></p>', 200, 30)
        }})).send()
    }
};
$Praise.submit = function (a, b, c, d, e) {
    Mbox.openLite('<p class="Doing">\u6b63\u5728\u9001\u82b1\uff0c\u8bf7\u7a0d\u5019......</p>', 280, 30);
    (new Request.JSON({method: "get", url: getAjaxAddr(c) + "?do=aa&i=" + b + "&t=" + c + "&s=" + d, noCache: !0, onSuccess: function (b) {
        Mbox.close();
        b && 900 == b.code && $Praise.update(b.msg, a, e)
    }, onError: function () {
        Mbox.openLite('<p class="Doing">\u64cd\u4f5c\u5931\u8d25\uff0c\u8bf7<a href="#" onclick="Mbox.close()">\u8fd4\u56de</a></p>', 200, 30)
    }})).send()
};
$Praise.del = function (a, b, c, d) {
    Mbox.openLite('<p class="Doing">\u6b63\u5728\u5220\u9664\uff0c\u8bf7\u7a0d\u5019......</p>', 280, 30);
    (new Request.JSON({method: "get", url: getAjaxAddr(c) + "?do=dd&i=" + b + "&t=" + c, noCache: !0, onSuccess: function (b) {
        Mbox.close();
        b && 900 == b.code && $Praise.update(b.msg, a, d)
    }, onError: function () {
        Mbox.openLite('<p class="Doing">\u64cd\u4f5c\u5931\u8d25\uff0c\u8bf7<a href="#" onclick="Mbox.close()">\u8fd4\u56de</a></p>', 200, 30)
    }})).send()
};
$Praise.update = function (a, b, c) {
    b = $(b);
    if (!a || !a.c && 0 != a.c || !a.u || !a.n)alert("\u83b7\u53d6\u9c9c\u82b1\u603b\u6570\u9519\u8bef\uff0c\u8bf7\u7a0d\u5019\u518d\u8bd5\uff01"); else {
        if (b)switch (b.get("tag")) {
            case "span":
                b.innerHTML = "(" + (a.c || "0") + ")";
                break;
            default:
                b.innerHTML = (a.c || "0") + "\u9c9c\u82b1"
        }
        c && c.call(null, a.c, a.u, a.n, a.t)
    }
};
var $Report = function (a, b) {
    if ("number" == $type(a)) {
        7 == b && pageTracker._trackPageview("dp_report");
        var c = (new Element("div")).addClass("report-panel");
        (new AjaxReq({url: "/feedback.v", method: "post", data: {"do": "getreportcausetype", d: b}, onRequest: function () {
            Mbox.openLite('<p class="Doing">\u6b63\u5728\u5904\u7406\uff0c\u8bf7\u7a0d\u5019....</p>', 200, 30)
        }, onSuccess: function (d) {
            Mbox.close();
            if (d && 100 == d.code)DP.authBox("\u63d0\u4ea4\u4e0d\u5f53\u5185\u5bb9"); else if (200 == d.code && d.msg) {
                var e = (new Element("div")).addClass("box"),
                    g = (new Element("select")).addEvent("change", function () {
                        h.set("html", "");
                        "0" == this.value ? (Mbox.openLite($dialog("\u63d0\u4ea4\u4e0d\u5f53\u5185\u5bb9", [c], [j, k]), 305, 170, {closable: !0}), f.setStyle("display", ""), f.set("value", ""), f.setStyle("color", "#000")) : "3" == this.value ? (Mbox.openLite($dialog("\u63d0\u4ea4\u4e0d\u5f53\u5185\u5bb9", [c], [j, k]), 305, 170, {closable: !0}), f.setStyle("display", ""), $Report.setPlaceHoler(f, "\u8bf7\u63d2\u5165\u6284\u88ad\u96f7\u540c\u70b9\u8bc4\u94fe\u63a5", "#999")) : (Mbox.openLite($dialog("\u63d0\u4ea4\u4e0d\u5f53\u5185\u5bb9",
                            [c], [j, k]), 305, 170, {closable: !0}), f.setStyle("display", "none"))
                    });
                (new Element("option")).set({html: "-\u9009\u62e9\u4e0d\u5f53\u539f\u56e0-", value: "00"}).inject(g);
                d.msg.msg.each(function (a) {
                    0 == a.v && (a.c = "--" + a.c + "--");
                    (new Element("option")).set({html: a.c, value: a.v}).inject(g)
                }, this);
                d = (new Element("a")).set({href: "/help/0102", target: "_blank"}).addClass("report-help");
                e.adopt([g, d]);
                var f = (new Element("input")).setStyle("display", "none"), h = (new Element("p")).addClass("report-err");
                c.adopt([e, (new Element("div")).grab(f),
                    h]);
                var j = (new Element("button", {html: "\u63d0\u4ea4", type: "button"})).addEvent("click", function () {
                    var c = g.selectedIndex, d = g.options[c].value, e = "0" == d || "3" == d ? f.get("value").trim() : g.options[c].get("text");
                    "3" == d && "" == e && (e = g.options[c].get("text"));
                    "00" == d ? h.set("html", "\u8bf7\u5148\u9009\u62e9\u539f\u56e0") : "0" == d && ("" == e || "\u8bf7\u63d2\u5165\u6284\u88ad\u96f7\u540c\u70b9\u8bc4\u94fe\u63a5" == e) ? h.set("html", "\u8bf7\u5728\u8f93\u5165\u6846\u586b\u5199\u6216\u901a\u8fc7\u4e0b\u62c9\u9009\u62e9\u539f\u56e0") :
                        (h.set("html", ""), $Report.submit(a, b, e, d))
                }), k = (new Element("button", {html: "\u53d6\u6d88", type: "button"})).addEvent("click", function () {
                    Mbox.close()
                });
                Mbox.openLite($dialog("\u63d0\u4ea4\u4e0d\u5f53\u5185\u5bb9", [c], [j, k]), 305, 170, {closable: !0})
            }
        }, onError: function () {
            Mbox.openLite('<p class="Doing">\u64cd\u4f5c\u5931\u8d25\uff0c\u8bf7<a href="#" onclick="Mbox.close()">\u8fd4\u56de</a></p>', 200, 30)
        }})).send()
    }
};
$Report.submit = function (a, b, c, d) {
    var e = (new Element("div")).addClass("report-panel").setStyle("padding", "0"), g = (new Element("button", {html: "\u5173\u95ed", type: "button"})).addEvent("click", function () {
        Mbox.close()
    });
    (new AjaxReq({url: "/feedback.v", method: "post", data: {"do": "submitreport", i: a, d: b, c: c, v: d}, onRequest: function () {
    }, onSuccess: function (a) {
        a && 200 == a.code ? e.set("html", '<div style="margin:18px 0 18px;"><p class="report-succ">\u63d0\u4ea4\u6210\u529f\uff01</p><p class="report-succ">\u611f\u8c22\u60a8\u5bf9\u5927\u4f17\u70b9\u8bc4\u7684\u652f\u6301\u3002</p></div>') :
            500 == a.code && e.set("html", '<div style="margin:18px 0 18px;"><p class="report-succ">\u63d0\u4ea4\u5931\u8d25\uff01</p><p class="report-succ">\u8bf7\u91cd\u65b0\u63d0\u4ea4\u3002</p></div>');
        Mbox.openLite($dialog("\u63d0\u4ea4\u4e0d\u5f53\u5185\u5bb9", [e], [g]), 305, 170, {closable: !0});
        setTimeout(function () {
            Mbox.isOpen && Mbox.close()
        }, 3E3)
    }, onError: function () {
        Mbox.openLite('<p class="Doing">\u64cd\u4f5c\u5931\u8d25\uff0c\u8bf7<a href="#" onclick="Mbox.close()">\u8fd4\u56de</a></p>', 200, 30)
    }})).send()
};
$Report.setPlaceHoler = function (a, b, c) {
    a.get("value");
    a.set("value", b);
    a.setStyle("color", c);
    a.addEvents({focus: function () {
        a.get("value") === b && (a.set("value", ""), a.setStyle("color", "#000"))
    }, blur: function () {
        "" === a.get("value") && (a.set("value", b), a.setStyle("color", c))
    }})
};
var loginAgreement_login = '<input type="checkbox" id="agreeprovision_login" checked="checked"/><label for="agreeprovision_login">\u6211\u5df2\u770b\u8fc7\u5e76\u540c\u610f<a href="http://www.dianping.com/aboutus/useragreement" target="_blank">\u300a\u5927\u4f17\u70b9\u8bc4\u7f51\u7528\u6237\u6ce8\u518c\u534f\u8bae\u300b</a></label>', loginAgreement_reg = '<input type="checkbox" id="agreeprovision_reg" checked="checked"/><label for="agreeprovision_reg">\u6211\u5df2\u770b\u8fc7\u5e76\u540c\u610f<a href="http://www.dianping.com/aboutus/useragreement" target="_blank">\u300a\u5927\u4f17\u70b9\u8bc4\u7f51\u7528\u6237\u6ce8\u518c\u534f\u8bae\u300b</a></label>',
    RegLoginDialog = new Class({Implements: [Options, Events], options: {isLogin: !1, singleton: $empty}, dialogHTML: '<div class="DialogTitle"><div class="TitleText">\u6ce8\u518c/\u767b\u5f55</div></div><div class="DialogContent regLoginContent"><div class="rlTip">\u5927\u4f17\u70b9\u8bc4\u7f51\u4f1a\u5458\u8bf7\u767b\u5f55        \u4e0d\u662f\u4f1a\u5458? 20\u79d2\u5feb\u901f\u5b8c\u6210\u6ce8\u518c</div><div class="tabs"><ul class="tabNavigation"><li><a class="nosel selected" href="javascript:void(0)" data="0">\u767b\u5f55</a></li><li><a class="nosel" href="javascript:void(0)" data="1">\u6ce8\u518c</a></li></ul><div id="login"><br/><br/><table class="tbLogin"><tr><td class="tbt">\u7528\u6237\u540d\uff1a</td><td><input type="text" value="" maxlength="40" tabindex="1" size="30" id="loginaccount"/></td></tr><tr class="vali"><td class="tbt"></td><td><span class="regvaliinfo" id="loginaccountvalidator"></span></td></tr><tr><td class="tbt">\u5bc6\u7801\uff1a</td><td><input type="password" maxlength="40" tabindex="1" size="30" id="loginpwd"/></td></tr><tr class="vali"><td class="tbt"></td><td><span class="regvaliinfo" id="loginpwdvalidator"></span></td></tr><tr><td class="tbt vcenter">\u9a8c\u8bc1\u7801\uff1a</td><td><div class="inpwp"><input type="text" tabindex="5" size="10" id="logincaptchacode"/></div><div class="inpimgwp"><img alt="\u770b\u4e0d\u6e05\u695a?\u8bf7\u70b9\u51fb!" style="cursor: pointer;" onclick="this.src=\'/JValidateCode.jpg?xx=\' + Math.floor(Math.random()*1001) ;" src="/JValidateCode.jpg?xx=515" id="loginimg"/><br/><a onclick="document.getElementById(\'loginimg\').src=\'/JValidateCode.jpg?xx=\' + Math.floor(Math.random()*1001) ;return false;" href="#" class="BL">\u770b\u4e0d\u6e05\uff1f\u6362\u4e00\u5f20</a></div></td></tr><tr class="vali"><td class="tbt"></td><td><span class="regvaliinfo" id="loginccvalidator"></span></td></tr><tr><td class="tbt"><td>' +
        loginAgreement_login + '</td></tr><tr><td class="tbt"></td><td><input type="submit" tabindex="6" value="\u767b\u5f55" class="btn" id="loginsubmit"/></td></tr></table></div><div id="reg" style="display:none;"><br/><table class="tbReg"><tr><td class="tbt">Email\uff1a</td><td><input type="text" value="" maxlength="40" tabindex="1" size="30" id="regmail"/></td></tr><tr><td class="tbt"></td><td><span class="valiinfo" id="regmailvalidator"></span></td></tr><tr><td class="tbt">\u6635\u79f0\uff1a</td><td><input type="text" maxlength="40" tabindex="1" size="30" id="regnickname"/></td></tr><tr class="vali"><td class="tbt"></td><td><span class="valiinfo" id="regnicknamevalidator"></span></td></tr><tr><td class="tbt">\u5bc6\u7801\uff1a</td><td><input type="password" maxlength="40" tabindex="1" size="30" id="regpwd"/></td></tr><tr class="vali"><td class="tbt"></td><td><span class="valiinfo" id="regpwdvalidator"></span></td></tr><tr><td class="tbt vcenter">\u9a8c\u8bc1\u7801\uff1a</td><td><div class="inpwp"><input type="text" tabindex="5" size="10" id="regcaptchacode"/></div><div class="inpimgwp"><img alt="\u770b\u4e0d\u6e05\u695a?\u8bf7\u70b9\u51fb!" style="cursor: pointer;" onclick="this.src=\'/JValidateCode.jpg?xx=\' + Math.floor(Math.random()*1001) ;" src="/JValidateCode.jpg" id="regimg"/><br/><a onclick="document.getElementById(\'regimg\').src=\'/JValidateCode.jpg?xx=\' + Math.floor(Math.random()*1001) ;return false;" href="#" class="BL">\u770b\u4e0d\u6e05\uff1f\u6362\u4e00\u5f20</a></div></td></tr><tr class="vali"><td class="tbt"></td><td><span id="regccvalidator"/></span></td></tr><tr><td class="tbt"><td>' +
        loginAgreement_reg + '</td></tr><tr><td class="tbt"></td><td><input type="submit" value="\u63d0\u4ea4\u6ce8\u518c" tabindex="6" class="btn" id="regsubmit"/></td></tr></table></div><div id="rlLoading" class="loadingmsg" style="display: none;">\u6b63\u5728\u53d1\u9001\u8bf7\u6c42,\u8bf7\u7a0d\u5019...</div></div></div>', initialize: function () {
        this.openDialog = this.openDialog.bind(this)
    }, openDialog: function (a, b) {
        null != a && (this.successMethod = a);
        this.options.singleton = b || $empty;
        this.options.isLogin ? this.successMethod.bind(this.options.singleton)() :
            (Mbox.open({type: "string", url: this.dialogHTML, closable: 1, overlay: !0, size: {x: 480, y: 550}}), this.enableTab(), this.initEvent(), this.agreeLogin(), this.agreeReg())
    }, successMethod: function () {
        Mbox.hide();
        Mbox.open({type: "string", url: '<div style="line-height:30px;text-align:center;" class="Color4">\u9a8c\u8bc1\u6210\u529f,\u8bf7\u7a0d\u5019...</div>', closable: 0, overlay: 1});
        setTimeout("window.location.reload(true);", 1E3)
    }, enableTab: function () {
        var a = $$("div.tabs > div");
        a.setStyle("display", "none");
        a[0].setStyle("display",
            "block");
        $$("div.tabs ul.tabNavigation li a").addEvent("mouseover", function () {
            a.setStyle("display", "none");
            a[$(this).get("data")].setStyle("display", "block");
            0 == $(this).get("data") && !$(this).hasClass("selected") && $("regimg").set("src", "/JValidateCode.jpg?xx=" + Math.floor(1001 * Math.random()));
            1 == $(this).get("data") && !$(this).hasClass("selected") && $("loginimg").set("src", "/JValidateCode.jpg?xx=" + Math.floor(1001 * Math.random()));
            $$("div.tabs ul.tabNavigation li a").removeClass("selected");
            $(this).addClass("selected");
            return!1
        });
        $$("div.tabs ul.tabNavigation li a")[0].addClass("selected")
    }, reloadRegImg: function () {
        $("regimg").set("src", "/JValidateCode.jpg?xx=" + Math.floor(1001 * Math.random()))
    }, reloadLoginImg: function () {
        $("loginimg").set("src", "/JValidateCode.jpg?xx=" + Math.floor(1001 * Math.random()))
    }, loginValidCollection: $empty, regValidCollection: $empty, initEvent: function () {
        var a = new Fvalid.Base({vid: "loginaccount", criterias: ['$isMatch("loginaccount",$isMatch.MORE, 0, 1)'], errMsg: ["*\u8bf7\u8f93\u5165\u767b\u5f55\u5e10\u53f7\uff01"],
            msgHolder: "loginaccountvalidator"}), b = new Fvalid.Base({vid: "loginpwd", criterias: ['$isMatch("loginpwd",$isMatch.MORE, 0, 1)'], errMsg: ["*\u8bf7\u8f93\u5165\u767b\u5f55\u5bc6\u7801\uff01"], msgHolder: "loginpwdvalidator"}), c = new Fvalid.Base({vid: "logincaptchacode", criterias: ['$isRegex("logincaptchacode","^.+$")'], errMsg: ["*\u8bf7\u8f93\u5165\u9a8c\u8bc1\u7801\uff01"], msgHolder: "loginccvalidator"});
        this.loginValidCollection = (new Fvalidator).add({u: a, p: b, v: c});
        var a = new Fvalid.Base({vid: "regmail", criterias: ['$isRegex("regmail",$isRegex.EMAIL)|$isRegex("regmail",$isRegex.MOBILE)'],
            errMsg: ["*\u8bf7\u8f93\u5165\u6709\u6548\u7684Email!"], msgHolder: "regmailvalidator"}), c = new Fvalid.Base({vid: "regnickname", criterias: ['$isMatch("regnickname",$isMatch.MORE, 0, 1)', '$isRegex("regnickname","^[0-9a-zA-Z_\u4e00-\u9fa5\uf900-\ufa2d]{1,12}$")', 'RegLoginDialog.noPureNumber("regnickname")'], errMsg: ["*\u8bf7\u8f93\u5165\u60a8\u7684\u6635\u79f0\uff0c\u6635\u79f0\u5fc5\u987b\u5c0f\u4e8e12\u4f4d!", "*\u53ea\u80fd\u4f7f\u752812\u4e2a\u4ee5\u5185\u7684\u5b57\u6bcd\u3001\u6570\u5b57\u3001\u4e2d\u6587\u3001\u4e0b\u5212\u7ebf!",
            "*\u6635\u79f0\u4e0d\u80fd\u5168\u4e3a\u6570\u5b57"], msgHolder: "regnicknamevalidator"}), b = new Fvalid.Base({vid: "regpwd", criterias: ['$isRegex("regpwd","^.{6,12}$")'], errMsg: ["*\u5bc6\u7801\u5fc5\u987b\u5927\u4e8e6\u4f4d\u5c0f\u4e8e12\u4f4d!"], msgHolder: "regpwdvalidator"}), d = new Fvalid.Base({vid: "regcaptchacode", criterias: ['$isRegex("regcaptchacode","^.+$")'], errMsg: ["*\u8bf7\u8f93\u5165\u9a8c\u8bc1\u7801\uff01"], msgHolder: "regccvalidator"});
        this.regValidCollection = (new Fvalidator).add({e: a, n: c, p: b,
            v: d});
        $("loginsubmit").addEvent("click", this.submitLogin.bind(this));
        $("regsubmit").addEvent("click", this.submitReg.bind(this));
        this.reloadLoginImg()
    }, agree: function (a, b) {
        a.addEvent("click", function () {
            b.set("disabled", !a.get("checked"))
        })
    }, agreeLogin: function () {
        this.agree($("agreeprovision_login"), $("loginsubmit"))
    }, agreeReg: function () {
        this.agree($("agreeprovision_reg"), $("regsubmit"))
    }, submitLogin: function () {
        this.loginValidCollection && this.loginValidCollection.checkAll() && ($$("div.tabs").setStyle("display",
            "none"), $("rlLoading").setStyle("display", "block"), (new AjaxReq({url: "/ajax/json/account/login", method: "post", callType: "json", data: {ua: $("loginaccount").get("value").trim(), pwd: $("loginpwd").get("value").trim(), mc: $("logincaptchacode").get("value").trim()}, onSuccess: function (a) {
            if (200 == a.code)Mbox.hide(), this.options.isLogin = !0, this.successMethod.bind(this.options.singleton)(); else if (100 == a.code) {
                switch (a.msg) {
                    case "nameerror":
                        $("loginaccountvalidator").set("html", "*\u586b\u5199\u6b63\u786e\u7684\u5e10\u53f7\u540d ").set("style",
                            "display:block").set("class", "fv-err");
                        break;
                    case "passworderror":
                        $("loginpwdvalidator").set("html", "*\u586b\u5199\u6b63\u786e\u7684\u5bc6\u7801 ").set("style", "display:block").set("class", "fv-err");
                        break;
                    case "matchcodeerror":
                        $("loginccvalidator").set("html", "*\u586b\u5199\u6b63\u786e\u7684\u9a8c\u8bc1\u7801 ").set("style", "display:block").set("class", "fv-err");
                        break;
                    case "nomanapower":
                        $("rlLoading").set("html", "*\u60a8\u6ca1\u6709\u8db3\u591f\u7684\u8d21\u732e\u503c\u8fdb\u884c\u767b\u5f55").set("style",
                            "display:block").set("class", "fv-err");
                        break;
                    case "blacklist":
                        $("loginaccountvalidator").set("html", "*\u5bf9\u4e0d\u8d77\uff0c\u60a8\u6ca1\u6709\u6743\u9650\u767b\u5f55").set("style", "display:block").set("class", "fv-err");
                        break;
                    case "Unknow exception happend!":
                        $("rlLoading").set("html", "*\u53d1\u751f\u672a\u77e5\u9519\u8bef\uff0c\u8bf7\u7a0d\u5019\u518d\u8bd5").set("style", "display:block").set("class", "fv-err")
                }
                $("logincaptchacode").value = "";
                "nomanapower" != a.msg && "Unknow exception happend!" != a.msg &&
                ($$("div.tabs").setStyle("display", "block"), $("rlLoading").setStyle("display", "none"), this.reloadLoginImg())
            }
        }.bind(this)})).send())
    }, submitReg: function () {
        this.regValidCollection && this.regValidCollection.checkAll() && ($$("div.tabs").setStyle("display", "none"), $("rlLoading").setStyle("display", "block"), (new AjaxReq({url: "/ajax/json/account/reg", method: "post", callType: "json", data: {email: $("regmail").get("value").trim(), una: $("regnickname").get("value").trim(), upwd: $("regpwd").get("value").trim(), cmcode: $("regcaptchacode").get("value").trim()},
            onSuccess: function (a) {
                if (200 == a.code)Mbox.hide(), this.options.isLogin = !0, this.successMethod.bind(this.options.singleton)(); else if (100 == a.code) {
                    switch (a.msg) {
                        case "accounterror":
                            $("regmailvalidator").set("html", "*\u586b\u5199\u6b63\u786e\u683c\u5f0f\u7684Email").set("style", "display:block").set("class", "fv-err");
                            break;
                        case "userpassworderror":
                            $("regpwdvalidator").set("html", "*\u586b\u51996-12\u4f4d\u957f\u5ea6\u7684\u5bc6\u7801").set("style", "display:block").set("class", "fv-err");
                            break;
                        case "usernicknameerror":
                            $("regnicknamevalidator").set("html",
                                "*\u8bf7\u4f7f\u752812\u4e2a\u4ee5\u5185\u7684\u5b57\u6bcd\u3001\u6570\u5b57\u3001\u4e2d\u6587\u3001\u4e0b\u5212\u7ebf").set("style", "display:block").set("class", "fv-err");
                            break;
                        case "dangerwordsinusernickname":
                            $("regnicknamevalidator").set("html", "*\u7528\u6237\u540d\u4e2d\u542b\u6709\u7cfb\u7edf\u7981\u6b62\u5b57\u7b26\uff01\u8bf7\u91cd\u65b0\u586b\u5199").set("style", "display:block").set("class", "fv-err");
                            break;
                        case "badwordsinusernickname":
                            $("regnicknamevalidator").set("html", "*\u7528\u6237\u540d\u4e2d\u542b\u6709\u7cfb\u7edf\u7981\u6b62\u5b57\u7b26\uff01\u8bf7\u91cd\u65b0\u586b\u5199").set("style",
                                "display:block").set("class", "fv-err");
                            break;
                        case "namenopurenumber":
                            $("regnicknamevalidator").set("html", "*\u6635\u79f0\u4e0d\u80fd\u5168\u4e3a\u6570\u5b57").set("style", "display:block").set("class", "fv-err");
                            break;
                        case "captchacodeerror":
                            $("regccvalidator").set("html", "*\u586b\u5199\u6b63\u786e\u7684\u9a8c\u8bc1\u7801").set("style", "display:block").set("class", "fv-err");
                            break;
                        case "duplicateusername":
                            $("regnicknamevalidator").set("html", "*\u53d6\u4e00\u4e2a\u72ec\u4e00\u65e0\u4e8c\u7684\u6635\u79f0").set("style",
                                "display:block").set("class", "fv-err");
                            break;
                        case "duplicateemail":
                            $("regmailvalidator").set("html", "*\u8be5Email\u5df2\u7ecf\u5b58\u5728\uff0c\u8bf7\u91cd\u65b0\u586b\u5199").set("style", "display:block").set("class", "fv-err");
                            break;
                        case "unknownexception":
                            $("rlLoading").set("html", "*\u51fa\u73b0\u672a\u77e5\u9519\u8bef\uff0c\u8bf7\u7a0d\u5019\u518d\u8bd5").set("style", "display:block").set("class", "fv-err")
                    }
                    $("regcaptchacode").value = "";
                    "nomanapower" != a.msg && "Unknow exception happend!" != a.msg && ($$("div.tabs").setStyle("display",
                        "block"), $("rlLoading").setStyle("display", "none"), this.reloadRegImg())
                }
            }.bind(this)})).send())
    }});
RegLoginDialog.noPureNumber = function (a) {
    a = $(a);
    return!/^\d+$/.test(a.get("value"))
};
(function () {
    function a(a, b) {
        function c() {
            e.destroy();
            return!1
        }

        var d = a.getParent(), e = (new Element("div")).set("html", g).getChildren()[0], f = e.getElement(".J_sure"), m = e.getElement(".J_cancel");
        (over = 0 < d.getPosition().y - (window.getScrollTop() + 75)) ? e.getElement(".icon-arow").addClass("icon-arow-bottom") : (e.getElement(".icon-arow").addClass("icon-arow-top"), e.setStyle("top", 25));
        f.addEvent("click", function () {
            e.destroy();
            document.body.removeEvent("click", c);
            b();
            return!1
        });
        e.addEvent("click", function (a) {
            a.stop()
        });
        document.body.addEvent("click", c);
        m.addEvent("click", c);
        e.inject(d)
    }

    function b(a, b, d, e, g) {
        (new AjaxReq({url: f + "?do=dd&i=" + b + "&t=" + d, onSuccess: function (b) {
            Mbox.close();
            b && 900 == b.code && (g ? window.location.reload(!0) : c(b.msg, a, e))
        }, onError: function () {
            Mbox.openLite('<p class="Doing">\u64cd\u4f5c\u5931\u8d25\uff0c\u8bf7<a href="#" onclick="Mbox.close()">\u8fd4\u56de</a></p>', 200, 30)
        }})).send()
    }

    function c(a, b, c) {
        var d = b.getParent(), f = (new Element("div")).set("html", e).getChildren()[0];
        if (!a || !a.c && 0 != a.c || !a.u || !a.n)alert("\u83b7\u53d6\u9c9c\u82b1\u603b\u6570\u9519\u8bef\uff0c\u8bf7\u7a0d\u5019\u518d\u8bd5\uff01"); else {
            if (b)switch ($(b).get("tag")) {
                case "span":
                    $(b).set("html", "(" + (a.c || "0") + ")");
                    break;
                default:
                    $(b).set("html", (a.c || "") + "\u9c9c\u82b1")
            }
            c && c.call(null, a.c, a.u, a.n, a.t);
            0 != a.t && (f.inject(d), (new Fx.Morph(f, {duration: 500, onComplete: function () {
                f.destroy()
            }})).start({top: -35, opacity: 0}))
        }
    }

    function d(a, b, d, e, g, n) {
        (new AjaxReq({url: f + "?do=aa&i=" + b + "&t=" + d + "&s=" + g, onSuccess: function (b) {
            b && 900 ==
                b.code && (n ? window.location.reload(!0) : c(b.msg, a, e))
        }, onError: function () {
            Mbox.openLite('<p class="Doing">\u64cd\u4f5c\u5931\u8d25\uff0c\u8bf7<a href="#" onclick="Mbox.close()">\u8fd4\u56de</a></p>', 200, 30)
        }})).send()
    }

    var e = '<sub class="add-flowr">+1<em></em></sub>', g = '<div id="pop-send-flowrs"><p class="send-flowrw">\u60a8\u5df2\u8d60\u9001\u8fc7\u9c9c\u82b1\uff0c\u662f\u5426\u8981\u5220\u9664\uff1f</p><p class="send-butn-flowr"><span class="micro-btn-shallow"><a href="#" title="\u5220\u9664" class="btn-txt J_sure">\u5220\u9664</a></span> <span class="micro-btn-shallow"><a href="#" title="\u53d6\u6d88" class="btn-txt J_cancel">\u53d6\u6d88</a></span></p><i class="icon-arow"></i></div>',
        f = "/ajax/json/shop/reviewflower";
    window.$newPraise = function (c, e, g, i) {
        "number" == $type(e) && (new AjaxReq({url: f, method: "get", data: "do=a&i=" + e + "&t=" + g, onSuccess: function (f) {
            Mbox.close();
            f && 100 == f.code ? d(c, e, g, i, 2) : 302 == f.code ? a(c, function () {
                b(c, e, g, i)
            }) : 401 == f.code ? DP.authBox(f.msg) : (Mbox.openLite('<p class="Doing">' + f.msg || "\u53d1\u751f\u672a\u77e5\u9519\u8bef\uff0c\u8bf7\u7a0d\u5019\u518d\u8bd5\uff01</p>", 280, "auto"), setTimeout(function () {
                Mbox.close()
            }, 1500))
        }, onError: function () {
            Mbox.openLite('<p class="Doing">\u64cd\u4f5c\u5931\u8d25\uff0c\u8bf7<a href="#" onclick="Mbox.close()">\u8fd4\u56de</a></p>',
                200, 30)
        }})).send()
    }
})();
(function (a) {
    var b = window.TipMessage = function (b) {
        var d = this, e, g, f = function () {
        };
        e = d.options = a.mix({wrapCS: "", closeCS: "", onClose: f, onBeforeShow: f, destroy: !0}, b) || {};
        if (b = d.wrap = $$(e.wrapCS)[0])b.setStyle("overflow", "hidden"), (g = $$(e.closeCS)) && g.addEvent("click", function (a) {
            a.stop();
            d.close();
            e.onClose.call(d)
        })
    };
    b.prototype = {hide: function (a) {
        var b = this, e = b.wrap;
        (new Fx.Tween(e, {duration: 50, property: "opacity", onComplete: function () {
            a && a.call(b);
            e.setStyle("display", "none")
        }})).start(1, 0)
    }, show: function (a) {
        var b =
            this.wrap, e = new Fx.Tween(b, {duration: 10, property: "opacity", onComplete: function () {
            b.setStyle("display", "")
        }});
        a && b.setStyles({left: a.x, top: a.y});
        this.options.onBeforeShow.call(b);
        e.start(0, 1)
    }, destroy: function () {
        this.wrap.destroy()
    }, close: function () {
        this.hide(this.destroy)
    }, constructor: b}
})(DP);