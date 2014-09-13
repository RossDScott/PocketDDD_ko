module PocketDDD.VM{
    export class EventDataVM {
        dal = new Services.LocalData();
        dddEventDetail: DDDEventDetail = null;
        userData: DDDEventUserGeneratedData = null;

        sessions: Session[];
        timeSlots: TimeSlot[];
        tracks: Track[];

        isRegistered: boolean;
        hasBookmarks: boolean;

        //lastCleanStateHash: string = "";
        currentStateHash: string;

        sessionVMs: SessionDataVM[] = [];

        defaultToMyDay: boolean = false;

        suppressServerChanges = false;
        constructor(public dddEvent: DDDEvent) {
            this.loadAndBuildData();

            this.loadOrInitialiseUserData();

            ko.track(this);
            //this.lastCleanStateHash = ko.toJSON(this.userData);
            ko.defineProperty(this, "currentStateHash", () => {
                return ko.toJSON(this.userData);
            });
            ko.defineProperty(this, "isRegistered", () => {
                if (!this.userData.userRegistration)
                    return false;

                return true;
            });
            ko.getObservable(this, "currentStateHash").subscribe((newJSON) => {
                if(!this.suppressServerChanges)
                    appState.setHasOutstandingSyncData();

                this.dal.setUserEventDataJSON(newJSON, this.dddEvent.id);
            });

            ko.defineProperty(this, "sessions", () => {
                if (!this.dddEventDetail)
                    return [];

                return this.dddEventDetail.sessions;
            });
            ko.defineProperty(this, "timeSlots", () => {
                if (!this.dddEventDetail)
                    return [];

                return _.sortBy(this.dddEventDetail.timeSlots, "from");
            });
            ko.defineProperty(this, "tracks", () => {
                if (!this.dddEventDetail)
                    return [];

                return _.sortBy(this.dddEventDetail.tracks, "name");
            });

            ko.defineProperty(this, "hasBookmarks", () => this.userData.sessionData.some(x=> x.bookmarked));
            ko.defineProperty(this, "hasAttending", () => this.userData.sessionData.some(x=> x.attendingStatus === AttendanceType.yesIAmGoing));
        }

        getSessionVM(session: Session) {
            var vm: SessionDataVM = <any> _.find<SessionDataVM>(this.sessionVMs, (x)=> x.session.id === session.id);
            if (!vm) {
                vm = new SessionDataVM(this, session);
                this.sessionVMs.push(vm);
            }

            return vm;
        }

        refreshEventDetail(dddEventDetail: DDDEventDetail) {
            this.loadAndBuildData(dddEventDetail);
            this.loadOrInitialiseUserData();
        }

        private loadOrInitialiseUserData() {
            var userData = this.dal.getUserEventData(this.dddEvent.id);

            if (!userData) {
                userData = {
                    eventId: this.dddEvent.id,
                    eventScore: null,
                    userRegistration: null,
                    sessionData: [],
                    eventFeedback: {
                        refreshments: null,
                        venue: null,
                        overall: null,
                        comments: [],
                        leastLike: [],
                        mostLike: [],
                        pocketDDD: [],
                        easterEggP: false,
                        easterEggRR: false
                    }
                }
            }

            userData.sessionData.forEach((x) => {
                x.privateComments.forEach(c=> ko.track(c));
                ko.track(x);
            });
            userData.eventFeedback.comments.forEach((x) => {
                ko.track(x);
            });
            userData.eventFeedback.mostLike.forEach((x) => {
                ko.track(x);
            });
            userData.eventFeedback.leastLike.forEach((x) => {
                ko.track(x);
            });
            userData.eventFeedback.pocketDDD.forEach((x) => {
                ko.track(x);
            });

            ko.track(userData.eventFeedback);
            ko.track(userData);
            
            this.userData = userData;
        }

        getSessionsForTimeSlot(timeSlot: TimeSlot) {
            return (<any>_.chain(this.dddEventDetail.sessions))
                .filter((session: Session) => session.timeSlotId === timeSlot.id)
                .sortBy((session: Session) => session.track.name)
                .value();
        }

        getSessionsForTrack(track: Track) {
            return (<any>_.chain(this.dddEventDetail.sessions))
                .filter((session: Session) => session.trackId === track.id)
                .sortBy((session: Session) => session.track.name)
                .value();
        }

        getBookmarkedSessionsForTimeSlot(timeSlot: TimeSlot) {
            var bookmarkedIds = this.userData.sessionData.filter(x=> x.bookmarked).map(x=> x.sessionId);

            return (<any>_.chain(this.dddEventDetail.sessions))
                .filter((session: Session) => session.timeSlotId === timeSlot.id && _.contains(bookmarkedIds, session.id))
                .sortBy((session: Session) => session.track.name)
                .value();
        }

        getAttendingSessionsForTimeSlot(timeSlot: TimeSlot) {
            var attendingIds = this.userData.sessionData.filter(x=> x.attendingStatus === AttendanceType.yesIAmGoing).map(x=> x.sessionId);

            return (<any>_.chain(this.dddEventDetail.sessions))
                .filter((session: Session) => session.timeSlotId === timeSlot.id && _.contains(attendingIds, session.id))
                .sortBy((session: Session) => session.track.name)
                .value();
        }

        private loadAndBuildData(detail?: DDDEventDetail) {
            if (!detail)
                detail = this.dal.getEventDetail(this.dddEvent.id);

            if (detail) {
                detail.sessions.forEach(session => {
                    session.track = _.find<Track>(detail.tracks, <any> { id: session.trackId });
                    session.timeSlot = _.find<TimeSlot>(detail.timeSlots, <any> { id: session.timeSlotId });
                });
                ko.track(detail);

                if (detail.sessions)
                    detail.sessions.forEach(s=> ko.track(s));

                if (detail.timeSlots)
                    detail.timeSlots.forEach(ts=> ko.track(ts));

                if (detail.tracks)
                    detail.tracks.forEach(t=> ko.track(t));
            }
            
            this.dddEventDetail = detail;
        }
    }

    export interface AttendanceChoiceOption {
        choiceType: AttendanceType;
        choiceText: string;
        selectedText: string;
        icon: string;
    }

    export class SessionDataVM{
        fromToText: string;

        amIGoingChoiceOptions: AttendanceChoiceOption[] = [
            { choiceType: AttendanceType.yesIAmGoing, choiceText: "Yes I am going", selectedText: "Attending", icon: "glyphicon-ok-circle" },
            { choiceType: AttendanceType.no, choiceText: "No", selectedText: "Not Attending", icon: "glyphicon-ban-circle" },
            { choiceType: AttendanceType.dontKnow, choiceText: "Don't know yet", selectedText: "Are you attending?", icon: "" },
        ];

        constructor(public eventData: EventDataVM, public session: Session) {
            ko.track(this)
            ko.track(session);

            ko.defineProperty(this, "fromToText", () => {
                var from = moment(session.timeSlot.from),
                    to = moment(session.timeSlot.to);

                return from.format("HH:mm") + " to " + to.format("HH:mm");
            });
            ko.defineProperty(this, "trackAndRoom", ()=> session.track.name + "(" + this.session.track.roomName + ")");

            ko.defineProperty(this, "attendanceSelectedChoice", () => {
                var choice = <AttendanceChoiceOption> _.find(this.amIGoingChoiceOptions, { choiceType: this.userSessionData.attendingStatus });
                return choice.selectedText;
            });
            ko.defineProperty(this, "attendanceSelectedChoiceIcon", () => {
                var choice = <AttendanceChoiceOption> _.find(this.amIGoingChoiceOptions, { choiceType: this.userSessionData.attendingStatus });
                return choice.icon;
            });
        }

        get userSessionData(): DDDSessionUserGeneratedData{
            var sessionData: DDDSessionUserGeneratedData = <any> _.find(this.eventData.userData.sessionData, { sessionId: this.session.id });
            if (!sessionData) {
                sessionData = {
                    sessionId: this.session.id,
                    bookmarked: false,
                    attendingStatus: AttendanceType.dontKnow,
                    speakerKnowledgeRating: null,
                    speakerSkillsRating: null,
                    privateComments: []
                };
                ko.track(sessionData);
                sessionData.privateComments.forEach(x=> ko.track(x));
                this.eventData.userData.sessionData.push(sessionData);
            } else {
                ko.track(sessionData);
                sessionData.privateComments.forEach(x=> ko.track(x));
            }

            return sessionData;
        }
    }
} 