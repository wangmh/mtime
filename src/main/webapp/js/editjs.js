page && Object.extend.call(page, {start: function () {
    var B = null;
    page.map = new Map(page.m, [
        {poi: page.p, msg: page.msg, open: page.ClickScript ? 0 : 1, styles: {width: 280}, popOnly: true}
    ], {scaleLevel: 16, zoom: 1, scale: 1});
    page.gmap = page.map.getMap(page.m, true);
    page.mma = [];
    var A = $("ShopMapDragger");
    if (A) {
        A.addEvent("click", function (D) {
            page.map.initPoint && page.map.initPoint.DP_closeInfoWindow();
            page.mma.each(function (E) {
                page.gmap.DP_removeOverlay(E);
                E.DP_closeInfoWindow();
                page.mma.erase(E)
            });
            var C = page.map.addPoint(page.m, {dFn: page.dragFn});
            page.mma.push(C);
            return false
        });
        if (page.ClickScript) {
            A.fireEvent("click")
        }
    }
}, dragFn: function () {
    var G = this, B = page.map, H = page.gmap, F = page.mma, I = G.DP_getLatLng(), D = I.y, E = I.x, A = B.initPoint;
    if (G) {
        var C = new Element("div").setStyles({fontSize: "12px", textAlign: "center", width: "240px"});
        new Element("p").setStyles({textAlign: "left", margin: "0 0 0 10px"}).set("html", "是否将新位置设置为此商户的默认位置？<br />(可以继续拖动图标标注)<br /><br />").inject(C);
        new Element("input").set({value: "确定", type: "button"}).setStyle("margin-right", "5px").addEvent("click",function () {
            new AjaxReq({url: "/ajax_map.aspx", method: "post", data: {"do": "g", s: page.shopId, a: D, n: E}, onSuccess: function (J) {
                if (J.code === 200) {
                    A && A.DP_setLatLng(G.DP_getLatLng());
                    F.each(function (K) {
                        H.DP_removeOverlay(K);
                        K.DP_closeInfoWindow();
                        F.erase(K)
                    });
                    A && A.DP_bindInfoWindowHtml(page.msg, null, {width: 280});
                    A && A.DP_openInfoWindowHtml(page.msg);
                    Mbox.openLite('<p class="Doing">' + J.msg.string + '，<a href="javascript:void(0);" onclick="Mbox.hide();" class="BL">关闭</a>。</p>', 350, 30);
                    setTimeout(function () {
                        Mbox.close()
                    }, 1500)
                } else {
                    if (J.code === 300) {
                        Mbox.openLite('<p class="Doing">' + J.msg.string + '，<a href="javascript:void(0);" onclick="Mbox.hide();" class="BL">关闭</a>。</p>', 300, 30)
                    } else {
                        Mbox.openLite('<p class="Doing">修改失败，请稍后再试，<a href="javascript:void(0);" onclick="Mbox.hide();" class="BL">关闭</a>。</p>', 300, 30)
                    }
                }
            }}).send()
        }).inject(C);
        new Element("input").set({value: "取消", type: "button"}).addEvent("click",function () {
            G.DP_closeInfoWindow();
            G.DP_hide()
        }).inject(C);
        G.DP_bindInfoWindowHtml(C, null, {width: 240});
        G.DP_openInfoWindowHtml(C)
    }
}});
window.addEvent("domready", page.start);