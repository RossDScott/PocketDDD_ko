var PocketDDD;
(function (PocketDDD) {
    (function (VM) {
        var PageTransitionVM = (function () {
            function PageTransitionVM(page) {
                var _this = this;
                this.page = page;
                this.activeStatusCSS = "pageHidden";
                ko.track(this);

                ko.getObservable(page, "isActive").subscribe(function (isActive) {
                    if (isActive) {
                        _this.activeStatusCSS = "";
                        setTimeout(function () {
                            return _this.activeStatusCSS = "showing";
                        }, 50);
                        setTimeout(function () {
                            return _this.activeStatusCSS = "active";
                        }, 1000);
                    } else {
                        _this.activeStatusCSS = "active hiding";
                        setTimeout(function () {
                            return _this.activeStatusCSS = "pageHidden";
                        }, 1000);
                    }
                });
            }
            return PageTransitionVM;
        })();
        VM.PageTransitionVM = PageTransitionVM;
    })(PocketDDD.VM || (PocketDDD.VM = {}));
    var VM = PocketDDD.VM;
})(PocketDDD || (PocketDDD = {}));
//# sourceMappingURL=page_transtion.js.map
