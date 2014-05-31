var PocketDDD;
(function (PocketDDD) {
    (function (VM) {
        (function (PageType) {
            PageType[PageType["intro"] = 0] = "intro";
            PageType[PageType["eventList"] = 1] = "eventList";
            PageType[PageType["eventHome"] = 2] = "eventHome";
            PageType[PageType["sessionList"] = 3] = "sessionList";
            PageType[PageType["sessionHome"] = 4] = "sessionHome";
            PageType[PageType["eventFeedback"] = 5] = "eventFeedback";
        })(VM.PageType || (VM.PageType = {}));
        var PageType = VM.PageType;

        var BasePage = (function () {
            function BasePage(pageType, nav) {
                this.pageType = pageType;
                this.isActive = false;
                nav.pageDir[PageType[pageType]] = this;
                ko.track(this);

                this.pageTransitionVM = new PocketDDD.VM.PageTransitionVM(this);
            }
            return BasePage;
        })();
        VM.BasePage = BasePage;
    })(PocketDDD.VM || (PocketDDD.VM = {}));
    var VM = PocketDDD.VM;
})(PocketDDD || (PocketDDD = {}));
//# sourceMappingURL=page.js.map
