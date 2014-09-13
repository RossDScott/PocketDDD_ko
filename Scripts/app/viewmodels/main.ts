module PocketDDD.VM {
    export class Main{
        nav: PageNav;
        intro: IntroPage;
        eventList: EventListPage;
        eventHome: EventHomePage;
        sessionList: SessionListPage;
        sessionHome: SessionHomePage;
        eventFeedback: EventFeedbackPage;

        constructor() {
            this.nav = new PageNav()
            this.intro = new IntroPage(this.nav);
            this.eventList = new EventListPage(this.nav);
            this.eventHome = new EventHomePage(this.nav);
            this.sessionList = new SessionListPage(this.nav);
            this.sessionHome = new SessionHomePage(this.nav);
            this.eventFeedback = new EventFeedbackPage(this.nav);

            ko.track(this);

            this.pickStartPage();
            

            ko.applyBindings(this);
        }

        private pickStartPage() {
            var eventMgr = new Services.EventManagement();

            //var eventData = eventMgr.getEventData(appState.events[0])
            //var sessionData = new SessionDataVM(eventData, eventData.sessions[0]);
            //this.nav.navigateTo(PageType.eventList);
            var localDal = new PocketDDD.Services.LocalData();

            var hasSeenIntro = localDal.getHasSeenIntro();

            if (hasSeenIntro) {
                var currentEventId = localDal.getCurrentEventId();
                if (currentEventId) {
                    var event = _.find<DDDEvent>(appState.events, <any> { id: currentEventId });
                    if (event) {
                        appState.currentEventId = event.id;
                        appState.currentEventName = event.name;
                        this.nav.showEventTitle(event.name);
                        this.nav.navigateTo(PageType.eventHome, event, false);
                    } else
                        this.nav.navigateTo(PageType.eventList, null, false);

                } else 
                    this.nav.navigateTo(PageType.eventList, null, false);
            }
                
            else
                this.nav.navigateTo(PageType.intro, null, false);
        }
    }
}