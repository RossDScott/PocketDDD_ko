var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var PocketDDD;
(function (PocketDDD) {
    (function (VM) {
        var EventHomePage = (function (_super) {
            __extends(EventHomePage, _super);
            function EventHomePage(nav) {
                var _this = this;
                _super.call(this, 2 /* eventHome */, nav);
                this.nav = nav;
                this.currentEventData = null;
                this.eventScoreClickTimes = 0;
                this.viewSessionsClick = function () {
                    _this.nav.navigateTo(3 /* sessionList */, _this.currentEventData);
                };
                this.viewMyDayClick = function () {
                    _this.currentEventData.defaultToMyDay = true;
                    _this.nav.navigateTo(3 /* sessionList */, _this.currentEventData);
                };
                this.viewFeedbackClick = function () {
                    _this.nav.navigateTo(5 /* eventFeedback */, _this.currentEventData);
                };
                this.eventScoreClick = function () {
                    _this.eventScoreClickTimes++;
                    if (_this.eventScoreClickTimes >= 5) {
                        if (!_this.currentEventData.userData.eventFeedback.easterEggP) {
                            _this.currentEventData.userData.eventFeedback.easterEggP = true;
                        }
                    }
                    setTimeout(function () {
                        return _this.eventScoreClickTimes = 0;
                    }, 3000);
                };

                this.eventBriteRegistration = new PocketDDD.VM.EventBriteRegistration();

                ko.track(this);

                ko.defineProperty(this, "isRegistered", function () {
                    return _this.currentEventData ? _this.currentEventData.isRegistered : false;
                });
            }
            EventHomePage.prototype.show = function (dddEvent) {
                if (dddEvent === undefined)
                    return;

                var eventMgr = new PocketDDD.Services.EventManagement();

                var eventData = eventMgr.getEventData(dddEvent);

                this.currentEventData = eventData;
                this.eventBriteRegistration.show(eventData);
            };

            EventHomePage.prototype.getListDateString = function (date) {
                return date ? date.format("ddd Do MMM YY") : "no date";
            };
            return EventHomePage;
        })(PocketDDD.VM.BasePage);
        VM.EventHomePage = EventHomePage;
    })(PocketDDD.VM || (PocketDDD.VM = {}));
    var VM = PocketDDD.VM;
})(PocketDDD || (PocketDDD = {}));
//# sourceMappingURL=event_home.js.map
