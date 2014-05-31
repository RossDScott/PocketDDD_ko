//module PocketDDD.Services {
//    export class EventData {
//        dddEvent: DDDEvent = null;
//        dddEventDetail: DDDEventDetail = null;
//        userData: DDDEventUserGeneratedData = null;

//        isRegistered: boolean;

//        constructor() {

//            ko.track(this);

//            ko.defineProperty(this, "isRegistered", () => {
//                if (!this.userRegistration)
//                    return false;

//                return true;
//            });
//        }

//        setEvent(event: DDDEvent) {
//            this.dddEvent = event;

//            this.buildFakeDetail();

//            ko.track(this.dddEventDetail);
//        }



//        buildFakeDetail() {
//            var tracks: Track[] = [
//                { id: 1, name: "Track 1", roomName: "248" },
//                { id: 2, name: "Track 2", roomName: "249" },
//                { id: 3, name: "Track 3", roomName: "250" },
//                { id: 4, name: "Track 4", roomName: "252" },
//            ];

//            var timeSlots: TimeSlot[] = [
//                { id: 1, info: "Registraton", from: new Date(), to: new Date() },
//                { id: 2, info: "Housekeeping", from: new Date(), to: new Date() },
//                { id: 3, info: null, from: new Date(), to: new Date() },
//                { id: 4, info: "Break 1", from: new Date(), to: new Date() },
//                { id: 5, info: null, from: new Date(), to: new Date() },
//            ];

//            var sessions: Session[] = [
//                { id: 1, shortDescription: "Session 1", fullDescription: "Session 1 full description", title: "Architecting large Single Page Applications with Knockout.js", track: tracks[0], trackId: 1, timeSlot: timeSlots[2], timeSlotId: 3, speaker: "Steve Sanderson" },
//                { id: 2, shortDescription: "Session 2", fullDescription: "Session 2 full description", title: "​Real-time geospatial visualisation with SignalR and OpenLayers", track: tracks[1], trackId: 2, timeSlot: timeSlots[4], timeSlotId: 5, speaker: "Martin Thornalley" },
//                { id: 3, shortDescription: "Session 3", fullDescription: "Session 4 full description", title: "Designing for mobile (AKA Designing for Everything)", track: tracks[2], trackId: 3, timeSlot: timeSlots[4], timeSlotId: 5, speaker: "George Adamson" }
//            ];

//            //timeSlots[2].sessions = [sessions[0]];
//            //timeSlots[4].sessions = [sessions[2], sessions[1]];

//            var detail: DDDEventDetail = {
//                sessions: sessions,
//                timeSlots: timeSlots,
//                tracks: tracks
//            };

//            this.dddEventDetail = detail;
//        }
//    }
//}