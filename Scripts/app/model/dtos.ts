module PocketDDD.DTOs{
    export interface DDDEventUserRegisteredInfo {
        firstName: string;
        lastName: string;
        token: string;
        eventScore: number;
    }

    export interface DDDEventUserData{
        eventId: number;
        eventScore: number;
    }

    export interface SyncUserComment {
        id: string;
        sessionId: number;
        date: Date;
        comment: string;
    }

    export interface SyncSessionUserData {
        sessionId: number;
        bookmarked: boolean;
        attendingStatus: AttendanceType;
        speakerKnowledgeRating?: number;
        speakerSkillsRating?: number;
    }

    export interface SyncEventUserData{
        refreshments?: number;
        venue?: number;
        overall?: number;
        easterEggRR: boolean;
        easterEggP: boolean;
    }

    export interface AcceptedUserComment {
        id: string;
        sessionId: number;
    }

    export interface SyncData {
        eventId: number;
        clientToken: string;
        userToken: string;
        dddEventListVersion: number;
        dddEventDataVersion: number;
        sessionComments: SyncUserComment[];
        userSessionData: SyncSessionUserData[];
        userEventData: SyncEventUserData;
        eventMostLikeComments: SyncUserComment[];
        eventLeastLikeComments: SyncUserComment[];
        pocketDDDComments: SyncUserComment[];
        eventComments: SyncUserComment[];
    }

    export interface SyncResult {
        dddEventId: number
        dddEventListVersion: number;
        dddEvents: DDDEvent[];
        dddEventDetail: DDDEventDetail;
        dddEventScore: number;
        acceptedSessionComments: AcceptedUserComment[];
        acceptedEventComments: AcceptedUserComment[];
        acceptedEventMostLikeComments: AcceptedUserComment[];
        acceptedEventLeastLikeComments: AcceptedUserComment[];
        acceptedPocketDDDComments: AcceptedUserComment[];
    }
} 