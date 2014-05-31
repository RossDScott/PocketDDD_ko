var PocketDDD;
(function (PocketDDD) {
    (function (Services) {
        var SyncManagement = (function () {
            function SyncManagement() {
                this.localData = new PocketDDD.Services.LocalData();
                this.eventMgr = new PocketDDD.Services.EventManagement();
                this.syncDelay = 4000;
                this.currentSessionSync = null;
            }
            SyncManagement.prototype.setHasOutstandingSessionDataToSync = function (data) {
                if (this.currentSessionSync !== null) {
                    this.currentSessionSync = setTimeout(function () {
                    }, this.syncDelay);
                }
            };

            SyncManagement.prototype.syncData = function () {
                //var eventsToSync = appState.events.filter(x=> x.isActive);
                ////should really wait for one to finish before doing the next
                //eventsToSync.forEach(event=> {
                //    this.syncEvent(event);
                //});
                //hack
                var event = PocketDDD.appState.events[0];
                return this.syncEvent(event);
            };

            SyncManagement.prototype.syncEvent = function (dddEvent) {
                var _this = this;
                var server = new PocketDDD.Services.ServerData();

                var data;

                if (dddEvent) {
                    var eventVM = this.eventMgr.getEventData(dddEvent);

                    var sessionComments = [];
                    eventVM.userData.sessionData.forEach(function (s) {
                        return s.privateComments.filter(function (c) {
                            return !c.isSynched;
                        }).forEach(function (c) {
                            return sessionComments.push({
                                id: c.id, sessionId: s.sessionId, comment: c.comment, date: c.date
                            });
                        });
                    });

                    var eventMostLikeComments = eventVM.userData.eventFeedback.mostLike.filter(function (c) {
                        return !c.isSynched;
                    }).map(function (c) {
                        return {
                            id: c.id, sessionId: null, comment: c.comment, date: c.date
                        };
                    });
                    var eventLeastLikeComments = eventVM.userData.eventFeedback.leastLike.filter(function (c) {
                        return !c.isSynched;
                    }).map(function (c) {
                        return {
                            id: c.id, sessionId: null, comment: c.comment, date: c.date
                        };
                    });
                    var pocketDDDComments = eventVM.userData.eventFeedback.pocketDDD.filter(function (c) {
                        return !c.isSynched;
                    }).map(function (c) {
                        return {
                            id: c.id, sessionId: null, comment: c.comment, date: c.date
                        };
                    });
                    var eventComments = eventVM.userData.eventFeedback.comments.filter(function (c) {
                        return !c.isSynched;
                    }).map(function (c) {
                        return {
                            id: c.id, sessionId: null, comment: c.comment, date: c.date
                        };
                    });

                    var sessionData = eventVM.userData.sessionData.map(function (x) {
                        return {
                            sessionId: x.sessionId,
                            attendingStatus: x.attendingStatus,
                            bookmarked: x.bookmarked,
                            speakerKnowledgeRating: x.speakerKnowledgeRating,
                            speakerSkillsRating: x.speakerSkillsRating
                        };
                    });

                    var userEventData = {
                        venue: eventVM.userData.eventFeedback.venue,
                        refreshments: eventVM.userData.eventFeedback.refreshments,
                        overall: eventVM.userData.eventFeedback.overall,
                        easterEggP: eventVM.userData.eventFeedback.easterEggP,
                        easterEggRR: eventVM.userData.eventFeedback.easterEggRR
                    };

                    var userToken = eventVM.userData.userRegistration ? eventVM.userData.userRegistration.token : null;
                    data = {
                        eventId: dddEvent.id,
                        userToken: userToken,
                        clientToken: this.localData.getClientToken(),
                        dddEventListVersion: this.localData.getDDDEventListVersion(),
                        dddEventDataVersion: dddEvent.version,
                        sessionComments: sessionComments,
                        eventLeastLikeComments: eventLeastLikeComments,
                        eventMostLikeComments: eventMostLikeComments,
                        eventComments: eventComments,
                        pocketDDDComments: pocketDDDComments,
                        userSessionData: sessionData,
                        userEventData: userEventData
                    };
                } else {
                    data = {
                        dddEventListVersion: 0,
                        dddEventDataVersion: 0,
                        eventId: -1,
                        clientToken: this.localData.getClientToken(),
                        userToken: null,
                        sessionComments: [],
                        eventLeastLikeComments: [],
                        eventMostLikeComments: [],
                        eventComments: [],
                        pocketDDDComments: [],
                        userSessionData: [],
                        userEventData: null
                    };
                }

                return server.sync(data).then(function (data) {
                    var localData = new PocketDDD.Services.LocalData();
                    if (data) {
                        if (data.dddEvents) {
                            localData.setEvents(data.dddEvents);
                            _this.localData.setDDDEventListVersion(data.dddEventListVersion);
                            _this.refreshEvents(data.dddEvents);
                        }

                        if (data.dddEventDetail)
                            _this.refreshEventDetail(data.dddEventDetail);

                        if (data.dddEventId === -1)
                            return;

                        if (data.acceptedSessionComments && data.acceptedSessionComments.length > 0)
                            _this.markUserSessionCommentsAsSynched(data.dddEventId, data.acceptedSessionComments);

                        if (data.acceptedEventMostLikeComments && data.acceptedEventMostLikeComments.length > 0)
                            _this.markUserEventMostLikeCommentsAsSynched(data.dddEventId, data.acceptedEventMostLikeComments);

                        if (data.acceptedEventLeastLikeComments && data.acceptedEventLeastLikeComments.length > 0)
                            _this.markUserEventLeastLikeCommentsAsSynched(data.dddEventId, data.acceptedEventLeastLikeComments);

                        if (data.acceptedEventComments && data.acceptedEventComments.length > 0)
                            _this.markUserEventCommentsAsSynched(data.dddEventId, data.acceptedEventComments);

                        if (data.acceptedPocketDDDComments && data.acceptedPocketDDDComments.length > 0)
                            _this.markUserPocketDDDCommentsAsSynched(data.dddEventId, data.acceptedPocketDDDComments);

                        _this.updateGameScore(data.dddEventId, data.dddEventScore ? +data.dddEventScore : 0);
                    }

                    return data;
                });
            };

            SyncManagement.prototype.refreshEvents = function (events) {
                PocketDDD.appState.events.forEach(function (x) {
                    return ko.track(x);
                });
                PocketDDD.appState.events.removeAll();
                events.forEach(function (x) {
                    return PocketDDD.appState.events.push(x);
                });
            };

            SyncManagement.prototype.refreshEventDetail = function (eventDetail) {
                var event = _.find(PocketDDD.appState.events, { id: eventDetail.dddEventId });
                var localData = new PocketDDD.Services.LocalData();
                localData.setEventDetail(eventDetail);

                var eventDataVM = this.eventMgr.getEventData(event);
                eventDataVM.refreshEventDetail(eventDetail);
            };

            SyncManagement.prototype.markUserSessionCommentsAsSynched = function (dddEventId, userComments) {
                var event = _.find(PocketDDD.appState.events, { id: dddEventId });
                var eventDataVM = this.eventMgr.getEventData(event);
                eventDataVM.suppressServerChanges = true;
                userComments.forEach(function (x) {
                    var session = _.find(eventDataVM.sessions, { id: x.sessionId });
                    var sessionVM = eventDataVM.getSessionVM(session);
                    var comment = _.find(sessionVM.userSessionData.privateComments, { id: x.id });
                    comment.isSynched = true;
                });
                eventDataVM.suppressServerChanges = false;
            };

            SyncManagement.prototype.markUserEventCommentsAsSynched = function (dddEventId, userComments) {
                var event = _.find(PocketDDD.appState.events, { id: dddEventId });
                var eventDataVM = this.eventMgr.getEventData(event);
                eventDataVM.suppressServerChanges = true;
                userComments.forEach(function (x) {
                    var comment = _.find(eventDataVM.userData.eventFeedback.comments, { id: x.id });
                    comment.isSynched = true;
                });
                eventDataVM.suppressServerChanges = false;
            };
            SyncManagement.prototype.markUserEventLeastLikeCommentsAsSynched = function (dddEventId, userComments) {
                var event = _.find(PocketDDD.appState.events, { id: dddEventId });
                var eventDataVM = this.eventMgr.getEventData(event);
                eventDataVM.suppressServerChanges = true;
                userComments.forEach(function (x) {
                    var comment = _.find(eventDataVM.userData.eventFeedback.leastLike, { id: x.id });
                    comment.isSynched = true;
                });
                eventDataVM.suppressServerChanges = false;
            };
            SyncManagement.prototype.markUserEventMostLikeCommentsAsSynched = function (dddEventId, userComments) {
                var event = _.find(PocketDDD.appState.events, { id: dddEventId });
                var eventDataVM = this.eventMgr.getEventData(event);
                eventDataVM.suppressServerChanges = true;
                userComments.forEach(function (x) {
                    var comment = _.find(eventDataVM.userData.eventFeedback.mostLike, { id: x.id });
                    comment.isSynched = true;
                });
                eventDataVM.suppressServerChanges = false;
            };
            SyncManagement.prototype.markUserPocketDDDCommentsAsSynched = function (dddEventId, userComments) {
                var event = _.find(PocketDDD.appState.events, { id: dddEventId });
                var eventDataVM = this.eventMgr.getEventData(event);
                eventDataVM.suppressServerChanges = true;
                userComments.forEach(function (x) {
                    var comment = _.find(eventDataVM.userData.eventFeedback.pocketDDD, { id: x.id });
                    comment.isSynched = true;
                });
                eventDataVM.suppressServerChanges = false;
            };
            SyncManagement.prototype.updateGameScore = function (dddEventId, score) {
                var event = _.find(PocketDDD.appState.events, { id: dddEventId });
                var eventDataVM = this.eventMgr.getEventData(event);
                eventDataVM.suppressServerChanges = true;

                var currentScore = eventDataVM.userData.eventScore;
                eventDataVM.userData.eventScore = score;
                if (score > currentScore)
                    PocketDDD.appState.setNewGameScore(score - currentScore);

                eventDataVM.suppressServerChanges = false;
            };
            return SyncManagement;
        })();
        Services.SyncManagement = SyncManagement;
    })(PocketDDD.Services || (PocketDDD.Services = {}));
    var Services = PocketDDD.Services;
})(PocketDDD || (PocketDDD = {}));
//# sourceMappingURL=sync_management.js.map
