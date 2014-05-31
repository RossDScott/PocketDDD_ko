module PocketDDD.Services{
    export class SyncManagement{
        private localData = new LocalData();
        private eventMgr = new EventManagement();

        syncDelay = 4000;
        currentSessionSync: number = null;
        setHasOutstandingSessionDataToSync(data: DDDSessionUserGeneratedData) {
            if (this.currentSessionSync !== null) {
                this.currentSessionSync = setTimeout(() => {

                }, this.syncDelay);
            }
        }
       
        syncData() {
            //var eventsToSync = appState.events.filter(x=> x.isActive);

            ////should really wait for one to finish before doing the next
            //eventsToSync.forEach(event=> {
            //    this.syncEvent(event);
            //});

            //hack
            var event = appState.events[0];
            return this.syncEvent(event);
        }

        private syncEvent(dddEvent: DDDEvent) {
            var server = new Services.ServerData();

            var data: DTOs.SyncData;

            if (dddEvent) {
                var eventVM = this.eventMgr.getEventData(dddEvent);

                var sessionComments: DTOs.SyncUserComment[] = [];
                eventVM.userData.sessionData
                    .forEach(s=> s.privateComments
                        .filter(c=> !c.isSynched)
                        .forEach(c=> sessionComments.push({
                            id: c.id, sessionId: s.sessionId, comment: c.comment, date: c.date
                        })));

                var eventMostLikeComments = eventVM.userData.eventFeedback.mostLike
                    .filter(c=> !c.isSynched)
                    .map<DTOs.SyncUserComment>(c => <any>{
                        id: c.id, sessionId: null, comment: c.comment, date: c.date
                    })
                var eventLeastLikeComments = eventVM.userData.eventFeedback.leastLike
                    .filter(c=> !c.isSynched)
                    .map<DTOs.SyncUserComment>(c => <any>{
                        id: c.id, sessionId: null, comment: c.comment, date: c.date
                    })
                var pocketDDDComments = eventVM.userData.eventFeedback.pocketDDD
                    .filter(c=> !c.isSynched)
                    .map<DTOs.SyncUserComment>(c => <any>{
                        id: c.id, sessionId: null, comment: c.comment, date: c.date
                    })
                var eventComments = eventVM.userData.eventFeedback.comments
                    .filter(c=> !c.isSynched)
                    .map<DTOs.SyncUserComment>(c => <any>{
                        id: c.id, sessionId: null, comment: c.comment, date: c.date
                    })

                var sessionData = eventVM.userData.sessionData.map(x=> <DTOs.SyncSessionUserData>{
                    sessionId: x.sessionId,
                    attendingStatus: x.attendingStatus,
                    bookmarked: x.bookmarked,
                    speakerKnowledgeRating: x.speakerKnowledgeRating,
                    speakerSkillsRating: x.speakerSkillsRating
                });

                var userEventData: DTOs.SyncEventUserData = {
                    venue: eventVM.userData.eventFeedback.venue,
                    refreshments: eventVM.userData.eventFeedback.refreshments,
                    overall: eventVM.userData.eventFeedback.overall,
                    easterEggP: eventVM.userData.eventFeedback.easterEggP,
                    easterEggRR: eventVM.userData.eventFeedback.easterEggRR
                };

                var userToken = eventVM.userData.userRegistration ? eventVM.userData.userRegistration.token : null;
                data= {
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
                }
            }
            
            return server.sync(data)
                .then((data: DTOs.SyncResult) => {
                    var localData = new LocalData();
                    if (data) {
                        if (data.dddEvents) {
                            localData.setEvents(data.dddEvents);
                            this.localData.setDDDEventListVersion(data.dddEventListVersion);
                            this.refreshEvents(data.dddEvents);
                        }

                        if (data.dddEventDetail)
                            this.refreshEventDetail(data.dddEventDetail);

                        if (data.dddEventId === -1)
                            return;

                        if (data.acceptedSessionComments && data.acceptedSessionComments.length > 0) 
                            this.markUserSessionCommentsAsSynched(data.dddEventId, data.acceptedSessionComments);

                        if (data.acceptedEventMostLikeComments && data.acceptedEventMostLikeComments.length > 0)
                            this.markUserEventMostLikeCommentsAsSynched(data.dddEventId, data.acceptedEventMostLikeComments);

                        if (data.acceptedEventLeastLikeComments && data.acceptedEventLeastLikeComments.length > 0)
                            this.markUserEventLeastLikeCommentsAsSynched(data.dddEventId, data.acceptedEventLeastLikeComments);

                        if (data.acceptedEventComments && data.acceptedEventComments.length > 0)
                            this.markUserEventCommentsAsSynched(data.dddEventId, data.acceptedEventComments);

                        if (data.acceptedPocketDDDComments && data.acceptedPocketDDDComments.length > 0)
                            this.markUserPocketDDDCommentsAsSynched(data.dddEventId, data.acceptedPocketDDDComments);

                        this.updateGameScore(data.dddEventId, data.dddEventScore ? +data.dddEventScore : 0);
                    }

                    return data;
                });
        }

        private refreshEvents(events: DDDEvent[]) {
            appState.events.forEach(x=> ko.track(x));
            appState.events.removeAll();
            events.forEach(x=> appState.events.push(x));
        }

        private refreshEventDetail(eventDetail: DDDEventDetail) {
            var event: DDDEvent = <any> _.find(appState.events, <any>{ id: eventDetail.dddEventId });
            var localData = new LocalData();
            localData.setEventDetail(eventDetail);

            var eventDataVM = this.eventMgr.getEventData(event);
            eventDataVM.refreshEventDetail(eventDetail);
        }

        private markUserSessionCommentsAsSynched(dddEventId: number, userComments: DTOs.AcceptedUserComment[]) {
            var event: DDDEvent = <any> _.find(appState.events, <any>{ id: dddEventId });
            var eventDataVM = this.eventMgr.getEventData(event);
            eventDataVM.suppressServerChanges = true;
            userComments.forEach(x=> {
                
                var session: Session = <any>_.find(eventDataVM.sessions, <any>{ id: x.sessionId });
                var sessionVM = eventDataVM.getSessionVM(session)
                var comment: UserComment = <any> _.find(sessionVM.userSessionData.privateComments, { id: x.id });
                comment.isSynched = true;
            });
            eventDataVM.suppressServerChanges = false;
        }

        private markUserEventCommentsAsSynched(dddEventId: number, userComments: DTOs.AcceptedUserComment[]) {
            var event: DDDEvent = <any> _.find(appState.events, <any>{ id: dddEventId });
            var eventDataVM = this.eventMgr.getEventData(event);
            eventDataVM.suppressServerChanges = true;
            userComments.forEach(x=> {
                var comment: UserComment = <any> _.find(eventDataVM.userData.eventFeedback.comments, { id: x.id });
                comment.isSynched = true;
            });
            eventDataVM.suppressServerChanges = false;
        }
        private markUserEventLeastLikeCommentsAsSynched(dddEventId: number, userComments: DTOs.AcceptedUserComment[]) {
            var event: DDDEvent = <any> _.find(appState.events, <any>{ id: dddEventId });
            var eventDataVM = this.eventMgr.getEventData(event);
            eventDataVM.suppressServerChanges = true;
            userComments.forEach(x=> {
                var comment: UserComment = <any> _.find(eventDataVM.userData.eventFeedback.leastLike, { id: x.id });
                comment.isSynched = true;
            });
            eventDataVM.suppressServerChanges = false;
        }
        private markUserEventMostLikeCommentsAsSynched(dddEventId: number, userComments: DTOs.AcceptedUserComment[]) {
            var event: DDDEvent = <any> _.find(appState.events, <any>{ id: dddEventId });
            var eventDataVM = this.eventMgr.getEventData(event);
            eventDataVM.suppressServerChanges = true;
            userComments.forEach(x=> {
                var comment: UserComment = <any> _.find(eventDataVM.userData.eventFeedback.mostLike, { id: x.id });
                comment.isSynched = true;
            });
            eventDataVM.suppressServerChanges = false;
        }
        private markUserPocketDDDCommentsAsSynched(dddEventId: number, userComments: DTOs.AcceptedUserComment[]) {
            var event: DDDEvent = <any> _.find(appState.events, <any>{ id: dddEventId });
            var eventDataVM = this.eventMgr.getEventData(event);
            eventDataVM.suppressServerChanges = true;
            userComments.forEach(x=> {
                var comment: UserComment = <any> _.find(eventDataVM.userData.eventFeedback.pocketDDD, { id: x.id });
                comment.isSynched = true;
            });
            eventDataVM.suppressServerChanges = false;
        }
        private updateGameScore(dddEventId: number, score: number) {
            var event: DDDEvent = <any> _.find(appState.events, <any>{ id: dddEventId });
            var eventDataVM = this.eventMgr.getEventData(event);
            eventDataVM.suppressServerChanges = true;

            var currentScore = eventDataVM.userData.eventScore;
            eventDataVM.userData.eventScore = score;
            if (score > currentScore)
                appState.setNewGameScore(score - currentScore);

            eventDataVM.suppressServerChanges = false;
        }
    }
} 