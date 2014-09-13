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
        eventId: number;
        id: string;
        sessionId: number;
        date: Date;
        comment: string;
    }

    export interface SyncSessionUserData {
        eventId: number;
        sessionId: number;
        bookmarked: boolean;
        attendingStatus: AttendanceType;
        speakerKnowledgeRating?: number;
        speakerSkillsRating?: number;
    }

    export interface SyncEventUserData{
        eventId: number;
        refreshments?: number;
        venue?: number;
        overall?: number;
        easterEggRR: boolean;
        easterEggP: boolean;
    }

    export interface AcceptedUserComment {
        eventId: number;
        id: string;
        sessionId: number;
    }

    export interface DDDEventDataInfo {
        eventId: number;
        dataVersion: number;
        userToken: string;
    }

    export interface SyncData {
        clientToken: string;
        dddEventListVersion: number;
        dddEventDataInfo: DDDEventDataInfo[];
        sessionComments: SyncUserComment[];
        userSessionData: SyncSessionUserData[];
        userEventData: SyncEventUserData[];
        eventMostLikeComments: SyncUserComment[];
        eventLeastLikeComments: SyncUserComment[];
        pocketDDDComments: SyncUserComment[];
        eventComments: SyncUserComment[];
    }

    export interface DDDEventScoreInfo {
        eventId: number;
        score: number;
    }

    export interface SyncResult {
        dddEventListVersion: number;
        dddEvents: DDDEvent[];
        dddEventDetails: DDDEventDetail[];
        dddEventScores: DDDEventScoreInfo[];
        acceptedSessionComments: AcceptedUserComment[];
        acceptedEventComments: AcceptedUserComment[];
        acceptedEventMostLikeComments: AcceptedUserComment[];
        acceptedEventLeastLikeComments: AcceptedUserComment[];
        acceptedPocketDDDComments: AcceptedUserComment[];
    }
} 