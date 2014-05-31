var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var PocketDDD;
(function (PocketDDD) {
    (function (VM) {
        var SessionListPage = (function (_super) {
            __extends(SessionListPage, _super);
            function SessionListPage(nav) {
                var _this = this;
                _super.call(this, 3 /* sessionList */, nav);
                this.nav = nav;
                //dataVM = new DataVM();
                this.currentEventData = null;
                this.currentFilter = "Time Slot";
                this.filterOptions = ["Time Slot", "Session Name", "Speaker Name", "Track", "My Bookmarks", "Attending"];
                this.sessionItemCLick = function (session) {
                    var sessionData = _this.currentEventData.getSessionVM(session);
                    _this.nav.navigateTo(4 /* sessionHome */, sessionData);
                };
                this.filterByClick = function (option) {
                    _this.currentFilter = option;
                    _this.expandingFilterSection.showHideExpand();
                };

                this.expandingFilterSection = new PocketDDD.VM.ExpandingSection();
                ko.track(this);

                ko.defineProperty(this, "sessionsBySessionName", function () {
                    return _this.currentEventData ? _.sortBy(_this.currentEventData.sessions, "title") : [];
                });
                ko.defineProperty(this, "sessionsBySpeakerName", function () {
                    return _this.currentEventData ? _.sortBy(_this.currentEventData.sessions, "speaker") : [];
                });
                ko.defineProperty(this, "timeSlots", function () {
                    return _this.currentEventData ? _this.currentEventData.timeSlots : [];
                });
                ko.defineProperty(this, "tracks", function () {
                    return _this.currentEventData ? _this.currentEventData.tracks : [];
                });
            }
            SessionListPage.prototype.show = function (data) {
                if (data !== undefined) {
                    this.currentEventData = data;
                    if (this.currentEventData.defaultToMyDay) {
                        this.currentFilter = "Attending";
                        this.currentEventData.defaultToMyDay = false;
                    } else {
                        if (this.currentFilter == "Attending")
                            this.currentFilter = "Time Slot";
                    }
                }
                this.isActive = true;
            };

            SessionListPage.prototype.getListDateString = function (date) {
                return date ? date.format("ddd Do MMM YY") : "no date";
            };

            SessionListPage.prototype.formatTime = function (dt) {
                return moment(dt).format("h:mm a");
            };

            SessionListPage.prototype.orderSessionsByTrackName = function (sessions) {
                return sessions ? _.sortBy(sessions, function (session) {
                    return session.track.name;
                }) : [];
            };
            return SessionListPage;
        })(PocketDDD.VM.BasePage);
        VM.SessionListPage = SessionListPage;
    })(PocketDDD.VM || (PocketDDD.VM = {}));
    var VM = PocketDDD.VM;
})(PocketDDD || (PocketDDD = {}));
//# sourceMappingURL=session_list.js.map
