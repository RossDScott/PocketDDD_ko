var PocketDDD;
(function (PocketDDD) {
    (function (VM) {
        var EventDataVM = (function () {
            function EventDataVM(dddEvent) {
                var _this = this;
                this.dddEvent = dddEvent;
                this.dal = new PocketDDD.Services.LocalData();
                this.dddEventDetail = null;
                this.userData = null;
                this.sessionVMs = [];
                this.defaultToMyDay = false;
                this.suppressServerChanges = false;
                this.loadAndBuildData();

                this.loadOrInitialiseUserData();

                ko.track(this);

                //this.lastCleanStateHash = ko.toJSON(this.userData);
                ko.defineProperty(this, "currentStateHash", function () {
                    return ko.toJSON(_this.userData);
                });
                ko.defineProperty(this, "isRegistered", function () {
                    if (!_this.userData.userRegistration)
                        return false;

                    return true;
                });
                ko.getObservable(this, "currentStateHash").subscribe(function (newJSON) {
                    if (!_this.suppressServerChanges)
                        PocketDDD.appState.setHasOutstandingSyncData();

                    _this.dal.setUserEventDataJSON(newJSON, _this.dddEvent.id);
                });

                ko.defineProperty(this, "sessions", function () {
                    if (!_this.dddEventDetail)
                        return [];

                    return _this.dddEventDetail.sessions;
                });
                ko.defineProperty(this, "timeSlots", function () {
                    if (!_this.dddEventDetail)
                        return [];

                    return _.sortBy(_this.dddEventDetail.timeSlots, "from");
                });
                ko.defineProperty(this, "tracks", function () {
                    if (!_this.dddEventDetail)
                        return [];

                    return _.sortBy(_this.dddEventDetail.tracks, "name");
                });

                ko.defineProperty(this, "hasBookmarks", function () {
                    return _this.userData.sessionData.some(function (x) {
                        return x.bookmarked;
                    });
                });
                ko.defineProperty(this, "hasAttending", function () {
                    return _this.userData.sessionData.some(function (x) {
                        return x.attendingStatus === 0 /* yesIAmGoing */;
                    });
                });
            }
            EventDataVM.prototype.getSessionVM = function (session) {
                var vm = _.find(this.sessionVMs, function (x) {
                    return x.session.id === session.id;
                });
                if (!vm) {
                    vm = new SessionDataVM(this, session);
                    this.sessionVMs.push(vm);
                }

                return vm;
            };

            EventDataVM.prototype.refreshEventDetail = function (dddEventDetail) {
                this.loadAndBuildData(dddEventDetail);
                this.loadOrInitialiseUserData();
            };

            EventDataVM.prototype.loadOrInitialiseUserData = function () {
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
                    };
                }

                userData.sessionData.forEach(function (x) {
                    x.privateComments.forEach(function (c) {
                        return ko.track(c);
                    });
                    ko.track(x);
                });
                userData.eventFeedback.comments.forEach(function (x) {
                    ko.track(x);
                });
                userData.eventFeedback.mostLike.forEach(function (x) {
                    ko.track(x);
                });
                userData.eventFeedback.leastLike.forEach(function (x) {
                    ko.track(x);
                });
                userData.eventFeedback.pocketDDD.forEach(function (x) {
                    ko.track(x);
                });

                ko.track(userData.eventFeedback);
                ko.track(userData);

                this.userData = userData;
            };

            EventDataVM.prototype.getSessionsForTimeSlot = function (timeSlot) {
                return _.chain(this.dddEventDetail.sessions).filter(function (session) {
                    return session.timeSlotId === timeSlot.id;
                }).sortBy(function (session) {
                    return session.track.name;
                }).value();
            };

            EventDataVM.prototype.getSessionsForTrack = function (track) {
                return _.chain(this.dddEventDetail.sessions).filter(function (session) {
                    return session.trackId === track.id;
                }).sortBy(function (session) {
                    return session.track.name;
                }).value();
            };

            EventDataVM.prototype.getBookmarkedSessionsForTimeSlot = function (timeSlot) {
                var bookmarkedIds = this.userData.sessionData.filter(function (x) {
                    return x.bookmarked;
                }).map(function (x) {
                    return x.sessionId;
                });

                return _.chain(this.dddEventDetail.sessions).filter(function (session) {
                    return session.timeSlotId === timeSlot.id && _.contains(bookmarkedIds, session.id);
                }).sortBy(function (session) {
                    return session.track.name;
                }).value();
            };

            EventDataVM.prototype.getAttendingSessionsForTimeSlot = function (timeSlot) {
                var attendingIds = this.userData.sessionData.filter(function (x) {
                    return x.attendingStatus === 0 /* yesIAmGoing */;
                }).map(function (x) {
                    return x.sessionId;
                });

                return _.chain(this.dddEventDetail.sessions).filter(function (session) {
                    return session.timeSlotId === timeSlot.id && _.contains(attendingIds, session.id);
                }).sortBy(function (session) {
                    return session.track.name;
                }).value();
            };

            EventDataVM.prototype.loadAndBuildData = function (detail) {
                if (!detail)
                    detail = this.dal.getEventDetail(this.dddEvent.id);

                detail.sessions.forEach(function (session) {
                    session.track = _.find(detail.tracks, { id: session.trackId });
                    session.timeSlot = _.find(detail.timeSlots, { id: session.timeSlotId });
                });

                ko.track(detail);
                this.dddEventDetail = detail;
            };
            return EventDataVM;
        })();
        VM.EventDataVM = EventDataVM;

        var SessionDataVM = (function () {
            function SessionDataVM(eventData, session) {
                var _this = this;
                this.eventData = eventData;
                this.session = session;
                this.amIGoingChoiceOptions = [
                    { choiceType: 0 /* yesIAmGoing */, choiceText: "Yes I am going", selectedText: "Attending", icon: "glyphicon-ok-circle" },
                    { choiceType: 1 /* no */, choiceText: "No", selectedText: "Not Attending", icon: "glyphicon-ban-circle" },
                    { choiceType: 2 /* dontKnow */, choiceText: "Don't know yet", selectedText: "Are you attending?", icon: "" }
                ];
                ko.track(this);
                ko.track(session);

                ko.defineProperty(this, "fromToText", function () {
                    var from = moment(session.timeSlot.from), to = moment(session.timeSlot.to);

                    return from.format("HH:mm") + " to " + to.format("HH:mm");
                });
                ko.defineProperty(this, "trackAndRoom", function () {
                    return session.track.name + "(" + _this.session.track.roomName + ")";
                });

                ko.defineProperty(this, "attendanceSelectedChoice", function () {
                    var choice = _.find(_this.amIGoingChoiceOptions, { choiceType: _this.userSessionData.attendingStatus });
                    return choice.selectedText;
                });
                ko.defineProperty(this, "attendanceSelectedChoiceIcon", function () {
                    var choice = _.find(_this.amIGoingChoiceOptions, { choiceType: _this.userSessionData.attendingStatus });
                    return choice.icon;
                });
            }
            Object.defineProperty(SessionDataVM.prototype, "userSessionData", {
                get: function () {
                    var sessionData = _.find(this.eventData.userData.sessionData, { sessionId: this.session.id });
                    if (!sessionData) {
                        sessionData = {
                            sessionId: this.session.id,
                            bookmarked: false,
                            attendingStatus: 2 /* dontKnow */,
                            speakerKnowledgeRating: null,
                            speakerSkillsRating: null,
                            privateComments: []
                        };
                        ko.track(sessionData);
                        sessionData.privateComments.forEach(function (x) {
                            return ko.track(x);
                        });
                        this.eventData.userData.sessionData.push(sessionData);
                    } else {
                        ko.track(sessionData);
                        sessionData.privateComments.forEach(function (x) {
                            return ko.track(x);
                        });
                    }

                    return sessionData;
                },
                enumerable: true,
                configurable: true
            });
            return SessionDataVM;
        })();
        VM.SessionDataVM = SessionDataVM;
    })(PocketDDD.VM || (PocketDDD.VM = {}));
    var VM = PocketDDD.VM;
})(PocketDDD || (PocketDDD = {}));
//# sourceMappingURL=data.js.map
