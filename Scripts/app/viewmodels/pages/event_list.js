var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var PocketDDD;
(function (PocketDDD) {
    (function (VM) {
        var EventListPage = (function (_super) {
            __extends(EventListPage, _super);
            function EventListPage(nav) {
                var _this = this;
                _super.call(this, 1 /* eventList */, nav);
                this.nav = nav;
                this.eventItemCLick = function (eventItem) {
                    //this.nav.showingMenu = false;
                    //appState.currentEvent.setEvent(eventItem);
                    var localDal = new PocketDDD.Services.LocalData();
                    localDal.setCurrentEventId(eventItem.id);
                    PocketDDD.appState.currentEventId = eventItem.id;
                    PocketDDD.appState.currentEventName = eventItem.name;

                    _this.nav.showEventTitle(eventItem.name);
                    _this.nav.navigateTo(2 /* eventHome */, eventItem, false);
                };
                this.transitionClick = function () {
                    //this.nav.showingMenu = false;
                    //this.nav.navigateTo("two");
                };

                //this.buildFakeData();
                this.dddEvents = PocketDDD.appState.events;
                this.expandingFilterSection = new PocketDDD.VM.ExpandingSection();
                ko.track(this);
            }
            EventListPage.prototype.getListDateString = function (date) {
                if (!date)
                    return "no date";

                var m = moment(date);
                return m.format("ddd Do MMM YY");
            };
            return EventListPage;
        })(PocketDDD.VM.BasePage);
        VM.EventListPage = EventListPage;
    })(PocketDDD.VM || (PocketDDD.VM = {}));
    var VM = PocketDDD.VM;
})(PocketDDD || (PocketDDD = {}));
//# sourceMappingURL=event_list.js.map
