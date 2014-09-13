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
                return this.syncActiveEvents();
            };

            SyncManagement.prototype.syncActiveEvents = function () {
                var _this = this;
                var server = new PocketDDD.Services.ServerData();
                var dddEvents = this.eventMgr.getEventsForSyncAndBuildVMData();

                var sessionComments = [];
                var eventMostLikeComments = [];
                var eventLeastLikeComments = [];
                var pocketDDDComments = [];
                var eventComments = [];
                var dddEventDataInfo = [];
                var sessionData = [];
                var userEventData = [];

                dddEvents.forEach(function (dddEvent) {
                    dddEvent.vmData.userData.sessionData.forEach(function (s) {
                        return s.privateComments.filter(function (c) {
                            return !c.isSynched;
                        }).forEach(function (c) {
                            return sessionComments.push({
                                eventId: dddEvent.id, id: c.id, sessionId: s.sessionId, comment: c.comment, date: c.date
                            });
                        });
                    });

                    dddEvent.vmData.userData.eventFeedback.mostLike.filter(function (c) {
                        return !c.isSynched;
                    }).forEach(function (c) {
                        return eventMostLikeComments.push({
                            eventId: dddEvent.id, id: c.id, sessionId: null, comment: c.comment, date: c.date
                        });
                    });

                    dddEvent.vmData.userData.eventFeedback.leastLike.filter(function (c) {
                        return !c.isSynched;
                    }).forEach(function (c) {
                        return eventLeastLikeComments.push({
                            eventId: dddEvent.id, id: c.id, sessionId: null, comment: c.comment, date: c.date
                        });
                    });

                    dddEvent.vmData.userData.eventFeedback.pocketDDD.filter(function (c) {
                        return !c.isSynched;
                    }).forEach(function (c) {
                        return pocketDDDComments.push({
                            eventId: dddEvent.id, id: c.id, sessionId: null, comment: c.comment, date: c.date
                        });
                    });

                    dddEvent.vmData.userData.eventFeedback.comments.filter(function (c) {
                        return !c.isSynched;
                    }).forEach(function (c) {
                        return eventComments.push({
                            eventId: dddEvent.id, id: c.id, sessionId: null, comment: c.comment, date: c.date
                        });
                    });

                    dddEventDataInfo.push({
                        eventId: dddEvent.id,
                        dataVersion: dddEvent.vmData.dddEventDetail ? dddEvent.vmData.dddEventDetail.version : 0,
                        userToken: dddEvent.vmData.userData.userRegistration ? dddEvent.vmData.userData.userRegistration.token : null
                    });

                    dddEvent.vmData.userData.sessionData.forEach(function (x) {
                        return sessionData.push({
                            eventId: dddEvent.id,
                            sessionId: x.sessionId,
                            attendingStatus: x.attendingStatus,
                            bookmarked: x.bookmarked,
                            speakerKnowledgeRating: x.speakerKnowledgeRating,
                            speakerSkillsRating: x.speakerSkillsRating
                        });
                    });

                    userEventData.push({
                        eventId: dddEvent.id,
                        venue: dddEvent.vmData.userData.eventFeedback.venue,
                        refreshments: dddEvent.vmData.userData.eventFeedback.refreshments,
                        overall: dddEvent.vmData.userData.eventFeedback.overall,
                        easterEggP: dddEvent.vmData.userData.eventFeedback.easterEggP,
                        easterEggRR: dddEvent.vmData.userData.eventFeedback.easterEggRR
                    });
                });

                var eventListVersion = (dddEvents && dddEvents.length > 0) ? this.localData.getDDDEventListVersion() : 0;

                var data = {
                    clientToken: this.localData.getClientToken(),
                    dddEventListVersion: eventListVersion,
                    dddEventDataInfo: dddEventDataInfo,
                    sessionComments: sessionComments,
                    eventLeastLikeComments: eventLeastLikeComments,
                    eventMostLikeComments: eventMostLikeComments,
                    eventComments: eventComments,
                    pocketDDDComments: pocketDDDComments,
                    userSessionData: sessionData,
                    userEventData: userEventData
                };

                return server.sync(data).then(function (data) {
                    var localData = new PocketDDD.Services.LocalData();
                    if (data) {
                        if (data.dddEvents) {
                            localData.setEvents(data.dddEvents);
                            _this.localData.setDDDEventListVersion(data.dddEventListVersion);
                            _this.refreshEvents(data.dddEvents);
                        }

                        if (data.dddEventDetails)
                            data.dddEventDetails.forEach(function (eventDetail) {
                                return _this.refreshEventDetail(eventDetail);
                            });

                        if (data.acceptedSessionComments)
                            _this.markUserSessionCommentsAsSynched(data.acceptedSessionComments);

                        if (data.acceptedEventMostLikeComments)
                            _this.markUserEventMostLikeCommentsAsSynched(data.acceptedEventMostLikeComments);

                        if (data.acceptedEventLeastLikeComments)
                            _this.markUserEventLeastLikeCommentsAsSynched(data.acceptedEventLeastLikeComments);

                        if (data.acceptedEventComments)
                            _this.markUserEventCommentsAsSynched(data.acceptedEventComments);

                        if (data.acceptedPocketDDDComments)
                            _this.markUserPocketDDDCommentsAsSynched(data.acceptedPocketDDDComments);

                        if (data.dddEventScores)
                            _this.updateGameScore(data.dddEventScores);
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

            SyncManagement.prototype.markUserSessionCommentsAsSynched = function (userComments) {
                var _this = this;
                //could be optimised to group by eventId
                userComments.forEach(function (syncComment) {
                    var event = _.find(PocketDDD.appState.events, { id: syncComment.eventId });
                    var eventDataVM = _this.eventMgr.getEventData(event);
                    eventDataVM.suppressServerChanges = true;

                    var session = _.find(eventDataVM.sessions, { id: syncComment.sessionId });
                    var sessionVM = eventDataVM.getSessionVM(session);
                    var comment = _.find(sessionVM.userSessionData.privateComments, { id: syncComment.id });
                    comment.isSynched = true;

                    eventDataVM.suppressServerChanges = false;
                });
            };

            SyncManagement.prototype.markUserEventCommentsAsSynched = function (userComments) {
                var _this = this;
                userComments.forEach(function (x) {
                    var event = _.find(PocketDDD.appState.events, { id: x.eventId });
                    var eventDataVM = _this.eventMgr.getEventData(event);
                    eventDataVM.suppressServerChanges = true;

                    var comment = _.find(eventDataVM.userData.eventFeedback.comments, { id: x.id });
                    comment.isSynched = true;
                    eventDataVM.suppressServerChanges = false;
                });
            };
            SyncManagement.prototype.markUserEventLeastLikeCommentsAsSynched = function (userComments) {
                var _this = this;
                userComments.forEach(function (x) {
                    var event = _.find(PocketDDD.appState.events, { id: x.eventId });
                    var eventDataVM = _this.eventMgr.getEventData(event);
                    eventDataVM.suppressServerChanges = true;

                    var comment = _.find(eventDataVM.userData.eventFeedback.leastLike, { id: x.id });
                    comment.isSynched = true;
                    eventDataVM.suppressServerChanges = false;
                });
            };
            SyncManagement.prototype.markUserEventMostLikeCommentsAsSynched = function (userComments) {
                var _this = this;
                userComments.forEach(function (x) {
                    var event = _.find(PocketDDD.appState.events, { id: x.eventId });
                    var eventDataVM = _this.eventMgr.getEventData(event);
                    eventDataVM.suppressServerChanges = true;

                    var comment = _.find(eventDataVM.userData.eventFeedback.mostLike, { id: x.id });
                    comment.isSynched = true;
                    eventDataVM.suppressServerChanges = false;
                });
            };
            SyncManagement.prototype.markUserPocketDDDCommentsAsSynched = function (userComments) {
                var _this = this;
                userComments.forEach(function (x) {
                    var event = _.find(PocketDDD.appState.events, { id: x.eventId });
                    var eventDataVM = _this.eventMgr.getEventData(event);
                    eventDataVM.suppressServerChanges = true;

                    var comment = _.find(eventDataVM.userData.eventFeedback.pocketDDD, { id: x.id });
                    comment.isSynched = true;
                    eventDataVM.suppressServerChanges = false;
                });
            };
            SyncManagement.prototype.updateGameScore = function (eventScores) {
                var _this = this;
                eventScores.forEach(function (x) {
                    var event = _.find(PocketDDD.appState.events, { id: x.eventId });
                    var eventDataVM = _this.eventMgr.getEventData(event);
                    eventDataVM.suppressServerChanges = true;

                    var currentScore = eventDataVM.userData.eventScore;
                    var newScore = +x.score;
                    eventDataVM.userData.eventScore = newScore;
                    if (newScore > currentScore)
                        PocketDDD.appState.setNewGameScore(newScore - currentScore);

                    eventDataVM.suppressServerChanges = false;
                });
            };
            return SyncManagement;
        })();
        Services.SyncManagement = SyncManagement;
    })(PocketDDD.Services || (PocketDDD.Services = {}));
    var Services = PocketDDD.Services;
})(PocketDDD || (PocketDDD = {}));
//# sourceMappingURL=sync_management.js.map
