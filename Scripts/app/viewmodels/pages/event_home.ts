module PocketDDD.VM {
    export class EventHomePage extends BasePage {
        eventBriteRegistration: EventBriteRegistration;
        isRegistered: boolean;
        currentEventData: EventDataVM = null;
        private eventScoreClickTimes = 0;

        constructor(private nav: PageNav) {
            super(PageType.eventHome, nav);

            this.eventBriteRegistration = new EventBriteRegistration();

            
            ko.track(this);

            ko.defineProperty(this, "isRegistered", () => this.currentEventData ? this.currentEventData.isRegistered : false);

        }

        show(dddEvent: DDDEvent) {
            if (dddEvent === undefined)
                return;

            var eventMgr = new Services.EventManagement();

            var eventData = eventMgr.getEventData(dddEvent)

            this.currentEventData = eventData;
            this.eventBriteRegistration.show(eventData);
        }
        viewSessionsClick = () => {
            this.nav.navigateTo(PageType.sessionList, this.currentEventData);
        }
        viewMyDayClick = () => {
            this.currentEventData.defaultToMyDay = true;
            this.nav.navigateTo(PageType.sessionList, this.currentEventData);
        }
        viewFeedbackClick = () => {
            this.nav.navigateTo(PageType.eventFeedback, this.currentEventData);
        }
        getListDateString(date: Moment) {
            return date ? date.format("ddd Do MMM YY") : "no date";
        }

        eventScoreClick = () => {
            this.eventScoreClickTimes++;
            if (this.eventScoreClickTimes >= 5) {
                if (!this.currentEventData.userData.eventFeedback.easterEggP) {
                    this.currentEventData.userData.eventFeedback.easterEggP = true;
                }
            }
            setTimeout(() => this.eventScoreClickTimes = 0, 3000);
        }
    }
}