module PocketDDD.VM {
    export class EventListPage extends BasePage {
        expandingFilterSection: ExpandingSection;

        dddEvents: DDDEvent[];

        constructor(private nav: PageNav) {
            super(PageType.eventList, nav);
            //this.buildFakeData();
            this.dddEvents = appState.events;
            this.expandingFilterSection = new ExpandingSection();
            ko.track(this);
        }

        eventItemCLick = (eventItem: DDDEvent) => {
            //this.nav.showingMenu = false;
            //appState.currentEvent.setEvent(eventItem);
            var localDal = new PocketDDD.Services.LocalData();
            localDal.setCurrentEventId(eventItem.id);
            appState.currentEventId = eventItem.id;
            appState.currentEventName = eventItem.name;

            this.nav.showEventTitle(eventItem.name);
            this.nav.navigateTo(PageType.eventHome, eventItem, false);
        }

        transitionClick = () => {
            //this.nav.showingMenu = false;
            //this.nav.navigateTo("two");
        }

        getListDateString(date: Date) {
            if (!date)
                return "no date";

            var m = moment(date);
            return m.format("ddd Do MMM YY");
        }

        //buildFakeData() {
        //    this.dddEvents = [
        //        { id: 1, name: "DDDSW 5", date: moment("2014-05-17"), city: "Bristol", version:1 },
        //        { id: 2, name: "DDDNorth", date: null, city: "The North", version:2}
        //    ];

        //}
    }
}