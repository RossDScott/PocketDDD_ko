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
            return this.syncActiveEvents();
        }

        private syncActiveEvents() {
            var server = new Services.ServerData();
            var dddEvents = this.eventMgr.getEventsForSyncAndBuildVMData();

            var sessionComments: DTOs.SyncUserComment[] = [];
            var eventMostLikeComments: DTOs.SyncUserComment[] = [];
            var eventLeastLikeComments: DTOs.SyncUserComment[] = [];
            var pocketDDDComments: DTOs.SyncUserComment[] = [];
            var eventComments: DTOs.SyncUserComment[] = [];
            var dddEventDataInfo: DTOs.DDDEventDataInfo[] = [];
            var sessionData: DTOs.SyncSessionUserData[] = [];
            var userEventData: DTOs.SyncEventUserData[] = [];

            dddEvents.forEach(dddEvent => {
                dddEvent.vmData.userData.sessionData
                    .forEach(s=> s.privateComments
                        .filter(c=> !c.isSynched)
                        .forEach(c=> sessionComments.push({
                            eventId: dddEvent.id, id: c.id, sessionId: s.sessionId, comment: c.comment, date: c.date
                        })));

                dddEvent.vmData.userData.eventFeedback.mostLike
                    .filter(c=> !c.isSynched)
                    .forEach(c => eventMostLikeComments.push({
                        eventId: dddEvent.id, id: c.id, sessionId: null, comment: c.comment, date: c.date
                    }));

                dddEvent.vmData.userData.eventFeedback.leastLike
                    .filter(c=> !c.isSynched)
                    .forEach(c => eventLeastLikeComments.push({
                        eventId: dddEvent.id, id: c.id, sessionId: null, comment: c.comment, date: c.date
                    }));

                dddEvent.vmData.userData.eventFeedback.pocketDDD
                    .filter(c=> !c.isSynched)
                    .forEach(c=> pocketDDDComments.push({
                        eventId: dddEvent.id, id: c.id, sessionId: null, comment: c.comment, date: c.date
                    }));

                dddEvent.vmData.userData.eventFeedback.comments
                    .filter(c=> !c.isSynched)
                    .forEach(c => eventComments.push({
                        eventId: dddEvent.id, id: c.id, sessionId: null, comment: c.comment, date: c.date
                    }));

                dddEventDataInfo.push({
                    eventId: dddEvent.id,
                    dataVersion: dddEvent.vmData.dddEventDetail ? dddEvent.vmData.dddEventDetail.version : 0,
                    userToken: dddEvent.vmData.userData.userRegistration ? dddEvent.vmData.userData.userRegistration.token : null
                });

                dddEvent.vmData.userData.sessionData.forEach(x=> sessionData.push({
                    eventId: dddEvent.id,
                    sessionId: x.sessionId,
                    attendingStatus: x.attendingStatus,
                    bookmarked: x.bookmarked,
                    speakerKnowledgeRating: x.speakerKnowledgeRating,
                    speakerSkillsRating: x.speakerSkillsRating
                }));

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

            var data: DTOs.SyncData = {
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
            
            return server.sync(data)
                .then((data: DTOs.SyncResult) => {
                    var localData = new LocalData();
                    if (data) {
                        if (data.dddEvents) {
                            localData.setEvents(data.dddEvents);
                            this.localData.setDDDEventListVersion(data.dddEventListVersion);
                            this.refreshEvents(data.dddEvents);
                        }

                        if (data.dddEventDetails) 
                            data.dddEventDetails.forEach(eventDetail => this.refreshEventDetail(eventDetail));

                        if (data.acceptedSessionComments) 
                            this.markUserSessionCommentsAsSynched(data.acceptedSessionComments);

                        if (data.acceptedEventMostLikeComments)
                            this.markUserEventMostLikeCommentsAsSynched(data.acceptedEventMostLikeComments);

                        if (data.acceptedEventLeastLikeComments)
                            this.markUserEventLeastLikeCommentsAsSynched(data.acceptedEventLeastLikeComments);

                        if (data.acceptedEventComments)
                            this.markUserEventCommentsAsSynched(data.acceptedEventComments);

                        if (data.acceptedPocketDDDComments)
                            this.markUserPocketDDDCommentsAsSynched(data.acceptedPocketDDDComments);

                        if (data.dddEventScores)
                            this.updateGameScore(data.dddEventScores);
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

        private markUserSessionCommentsAsSynched(userComments: DTOs.AcceptedUserComment[]) {
            //could be optimised to group by eventId
            userComments.forEach(syncComment=> {
                var event: DDDEvent = <any> _.find(appState.events, <any>{ id: syncComment.eventId });
                var eventDataVM = this.eventMgr.getEventData(event);
                eventDataVM.suppressServerChanges = true;

                var session: Session = <any>_.find(eventDataVM.sessions, <any>{ id: syncComment.sessionId });
                var sessionVM = eventDataVM.getSessionVM(session)
                var comment: UserComment = <any> _.find(sessionVM.userSessionData.privateComments, { id: syncComment.id });
                comment.isSynched = true;

                eventDataVM.suppressServerChanges = false;
            });
        }

        private markUserEventCommentsAsSynched(userComments: DTOs.AcceptedUserComment[]) {
            userComments.forEach(x=> {
                var event: DDDEvent = <any> _.find(appState.events, <any>{ id: x.eventId });
                var eventDataVM = this.eventMgr.getEventData(event);
                eventDataVM.suppressServerChanges = true;

                var comment: UserComment = <any> _.find(eventDataVM.userData.eventFeedback.comments, { id: x.id });
                comment.isSynched = true;
                eventDataVM.suppressServerChanges = false;
            });
            
        }
        private markUserEventLeastLikeCommentsAsSynched(userComments: DTOs.AcceptedUserComment[]) {
            userComments.forEach(x=> {
                var event: DDDEvent = <any> _.find(appState.events, <any>{ id: x.eventId });
                var eventDataVM = this.eventMgr.getEventData(event);
                eventDataVM.suppressServerChanges = true;

                var comment: UserComment = <any> _.find(eventDataVM.userData.eventFeedback.leastLike, { id: x.id });
                comment.isSynched = true;
                eventDataVM.suppressServerChanges = false;
            });
        }
        private markUserEventMostLikeCommentsAsSynched(userComments: DTOs.AcceptedUserComment[]) {
            userComments.forEach(x=> {
                var event: DDDEvent = <any> _.find(appState.events, <any>{ id: x.eventId });
                var eventDataVM = this.eventMgr.getEventData(event);
                eventDataVM.suppressServerChanges = true;

                var comment: UserComment = <any> _.find(eventDataVM.userData.eventFeedback.mostLike, { id: x.id });
                comment.isSynched = true;
                eventDataVM.suppressServerChanges = false;
            });
        }
        private markUserPocketDDDCommentsAsSynched(userComments: DTOs.AcceptedUserComment[]) {
            userComments.forEach(x=> {
                var event: DDDEvent = <any> _.find(appState.events, <any>{ id: x.eventId });
                var eventDataVM = this.eventMgr.getEventData(event);
                eventDataVM.suppressServerChanges = true;

                var comment: UserComment = <any> _.find(eventDataVM.userData.eventFeedback.pocketDDD, { id: x.id });
                comment.isSynched = true;
                eventDataVM.suppressServerChanges = false;
            });
        }
        private updateGameScore(eventScores: DTOs.DDDEventScoreInfo[]) {
            eventScores.forEach(x=> {
                var event: DDDEvent = <any> _.find(appState.events, <any>{ id: x.eventId });
                var eventDataVM = this.eventMgr.getEventData(event);
                eventDataVM.suppressServerChanges = true;

                var currentScore = eventDataVM.userData.eventScore;
                var newScore = +x.score;
                eventDataVM.userData.eventScore = newScore;
                if (newScore > currentScore)
                    appState.setNewGameScore(newScore - currentScore);

                eventDataVM.suppressServerChanges = false;
            });
        }
    }
} 