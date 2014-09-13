module PocketDDD {
    export interface DDDEvent {
        id: number;
        name: string;
        date: Date;
        city: string;
        vmData?: VM.EventDataVM;
        version: number;
        isActive: boolean;
        address: string;
        requiresEventbriteLogin: boolean;
        requiresEventFeedback: boolean;
        requiresSessionFeedback: boolean;
    }

    export interface DDDEventDetail {
        dddEventId: number;
        version: number;
        sessions: Session[];
        tracks: Track[];
        timeSlots: TimeSlot[]
    }

    export interface Track {
        dddEventId: number;
        id: number;
        name: string;
        roomName: string;
    }

    export interface TimeSlot {
        dddEventId: number;
        id: number;
        from: Date;
        to: Date;

        //sessions?: Session[];
        info?: string;
    }

    export interface Session {
        id: number;
        dddEventId: number;
        title: string;
        shortDescription: string;
        fullDescription: string;
        speaker: string;
        trackId: number;
        track: Track;
        timeSlotId: number;
        timeSlot: TimeSlot;
    }

    export enum AttendanceType {
        yesIAmGoing,
        no,
        dontKnow
    }
    
    export interface DDDEventUserGeneratedData{
        eventId: number;
        userRegistration: DDDEventUserRegisteredInfo;
        eventScore?: number;
        sessionData: DDDSessionUserGeneratedData[];
        eventFeedback: DDDEventUserFeeback;
    }
    
    export interface DDDEventUserFeeback{
        refreshments: number;
        venue: number;
        overall: number;
        
        easterEggRR: boolean;
        easterEggP: boolean;

        mostLike: UserComment[];
        leastLike: UserComment[];
        pocketDDD: UserComment[];
        comments: UserComment[];
    }

    export interface DDDEventUserRegisteredInfo{
        firstName: string;
        lastName: string;
        token: string;
    }

    export interface DDDSessionUserGeneratedData{
        sessionId: number;
        bookmarked: boolean;
        attendingStatus: AttendanceType;
        speakerKnowledgeRating?: number;
        speakerSkillsRating?: number;
        privateComments: UserComment[];
    }

    export interface UserComment{
        id: string;
        name?: string;
        date: Date;
        comment: string;
        isSynched: boolean;
    }
} 