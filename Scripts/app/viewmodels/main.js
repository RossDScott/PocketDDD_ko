var PocketDDD;
(function (PocketDDD) {
    (function (VM) {
        var Main = (function () {
            function Main() {
                this.nav = new PocketDDD.VM.PageNav();
                this.intro = new PocketDDD.VM.IntroPage(this.nav);
                this.eventList = new PocketDDD.VM.EventListPage(this.nav);
                this.eventHome = new PocketDDD.VM.EventHomePage(this.nav);
                this.sessionList = new PocketDDD.VM.SessionListPage(this.nav);
                this.sessionHome = new PocketDDD.VM.SessionHomePage(this.nav);
                this.eventFeedback = new PocketDDD.VM.EventFeedbackPage(this.nav);

                ko.track(this);

                this.pickStartPage();

                ko.applyBindings(this);
            }
            Main.prototype.pickStartPage = function () {
                var eventMgr = new PocketDDD.Services.EventManagement();

                //var eventData = eventMgr.getEventData(appState.events[0])
                //var sessionData = new SessionDataVM(eventData, eventData.sessions[0]);
                //this.nav.navigateTo(PageType.eventList);
                var localDal = new PocketDDD.Services.LocalData();

                var hasSeenIntro = localDal.getHasSeenIntro();

                if (hasSeenIntro) {
                    var currentEventId = localDal.getCurrentEventId();
                    if (currentEventId) {
                        var event = _.find(PocketDDD.appState.events, { id: currentEventId });
                        PocketDDD.appState.currentEventId = event.id;
                        PocketDDD.appState.currentEventName = event.name;
                        this.nav.showEventTitle(event.name);
                        this.nav.navigateTo(2 /* eventHome */, event, false);
                    } else
                        this.nav.navigateTo(1 /* eventList */, null, false);
                } else
                    this.nav.navigateTo(0 /* intro */, null, false);
            };
            return Main;
        })();
        VM.Main = Main;
    })(PocketDDD.VM || (PocketDDD.VM = {}));
    var VM = PocketDDD.VM;
})(PocketDDD || (PocketDDD = {}));
//# sourceMappingURL=main.js.map
