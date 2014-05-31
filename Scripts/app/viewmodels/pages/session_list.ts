module PocketDDD.VM {
    export class SessionListPage extends BasePage {
        expandingFilterSection: ExpandingSection;

        //dataVM = new DataVM();
        currentEventData: EventDataVM = null;
        sessionsBySessionName: Session[];
        sessionsBySpeakerName: Session[];

        currentFilter: string = "Time Slot";
        filterOptions = ["Time Slot", "Session Name", "Speaker Name", "Track", "My Bookmarks", "Attending"];

        constructor(private nav: PageNav) {
            super(PageType.sessionList, nav);

            this.expandingFilterSection = new ExpandingSection();
            ko.track(this);

            ko.defineProperty(this, "sessionsBySessionName", () => this.currentEventData ? _.sortBy(this.currentEventData.sessions, "title") : []);
            ko.defineProperty(this, "sessionsBySpeakerName", () => this.currentEventData ? _.sortBy(this.currentEventData.sessions, "speaker") : []);
            ko.defineProperty(this, "timeSlots", () => this.currentEventData ? this.currentEventData.timeSlots : []);
            ko.defineProperty(this, "tracks", () => this.currentEventData ? this.currentEventData.tracks : []);
        }

        show(data: EventDataVM) { 
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
        }

        getListDateString(date: Moment) {
            return date ? date.format("ddd Do MMM YY") : "no date";
        }

        sessionItemCLick = (session: Session) => {
            var sessionData = this.currentEventData.getSessionVM(session); // new SessionDataVM(this.currentEventData, session);
            this.nav.navigateTo(PageType.sessionHome, sessionData);
        }

        formatTime(dt: Date): string {
            return moment(dt).format("h:mm a");
        }

        filterByClick = (option: string) => {
            this.currentFilter = option;
            this.expandingFilterSection.showHideExpand();
        }

        orderSessionsByTrackName(sessions: Session[]) {
            return sessions ? _.sortBy(sessions, (session) => session.track.name) : [];
        }
    }
}