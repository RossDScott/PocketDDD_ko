var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var PocketDDD;
(function (PocketDDD) {
    (function (VM) {
        (function (SessionHomeDisplayType) {
            SessionHomeDisplayType[SessionHomeDisplayType["synopsis"] = 0] = "synopsis";
            SessionHomeDisplayType[SessionHomeDisplayType["detail"] = 1] = "detail";
            SessionHomeDisplayType[SessionHomeDisplayType["feedback"] = 2] = "feedback";
        })(VM.SessionHomeDisplayType || (VM.SessionHomeDisplayType = {}));
        var SessionHomeDisplayType = VM.SessionHomeDisplayType;

        var SessionHomePage = (function (_super) {
            __extends(SessionHomePage, _super);
            function SessionHomePage(nav) {
                var _this = this;
                _super.call(this, 4 /* sessionHome */, nav);
                this.nav = nav;
                this.currentSessionData = null;
                this.displayType = 0 /* synopsis */;
                this.showShortDescriptionClick = function () {
                    _this.displayType = 0 /* synopsis */;
                };
                this.showLongDescriptionClick = function () {
                    _this.displayType = 1 /* detail */;
                };
                this.showFeedbackClick = function () {
                    _this.displayType = 2 /* feedback */;
                };
                this.amIGoingChoiceOptionsClick = function (choice) {
                    _this.currentSessionData.userSessionData.attendingStatus = choice.choiceType;
                    _this.expandingAmIGoingChoiceSection.showHideExpand();
                };
                this.bookmarkThisClick = function () {
                    _this.currentSessionData.userSessionData.bookmarked = !_this.currentSessionData.userSessionData.bookmarked;
                };
                this.expandingAmIGoingChoiceSection = new PocketDDD.VM.ExpandingSection();
                this.privateComments = new PocketDDD.VM.Comments();
                this.privateComments.defaultAdd = true;

                ko.track(this);
            }
            SessionHomePage.prototype.show = function (currentSession) {
                if (currentSession !== undefined)
                    this.currentSessionData = currentSession;

                this.displayType = 0 /* synopsis */;
                this.privateComments.setData(this.currentSessionData.userSessionData.privateComments);
                this.isActive = true;
            };
            return SessionHomePage;
        })(PocketDDD.VM.BasePage);
        VM.SessionHomePage = SessionHomePage;
    })(PocketDDD.VM || (PocketDDD.VM = {}));
    var VM = PocketDDD.VM;
})(PocketDDD || (PocketDDD = {}));
//# sourceMappingURL=session_home.js.map
