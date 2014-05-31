module PocketDDD.Services {
    export enum SyncStatus{
        waiting,
        success,
        retrying,
        failed
    }

    export class AppState{
        private eventMgr: EventManagement;
        private syncMgr: SyncManagement;
        private localData: LocalData;

        events: DDDEvent[] = [];
        isSyncing = false;
        syncStatus: SyncStatus = null;
        currentEventName: string = "";
        currentEventId: number;
        newGameScore: number = null;

        constructor() {
            this.eventMgr = new EventManagement();
            this.syncMgr = new SyncManagement();
            this.localData = new LocalData();
        }

        init() {
            this.loadEvents();
            ko.track(this);
            this.sync();
        }

        loadEvents() {
            var events = this.eventMgr.getEventList();
            events.forEach(x=> ko.track(x));
            this.events = events;
        }

        currentSyncWaiting: number = null;
        setHasOutstandingSyncData() {
            if (this.currentSyncWaiting)
                clearTimeout(this.currentSyncWaiting); 

            var thisTimeout = setTimeout(() => {
                this.sync()
                    .then(() => {
                        if (this.currentSyncWaiting === thisTimeout)
                            this.currentSyncWaiting = null;
                    });
            }, 4000);
            this.currentSyncWaiting = thisTimeout;
        }

        retryCount = 0;
        sync() {
            this.isSyncing = true;
            this.syncStatus = SyncStatus.waiting;
            return this.syncMgr.syncData()
                .then(() => this.syncStatus = SyncStatus.success)
                ["catch"](() => {
                    this.retryCount++;
                    if (this.retryCount < 5) {
                        this.currentSyncWaiting = setTimeout(() => this.sync(), 1000 + (this.retryCount * 500) + _.random(2000));
                        this.syncStatus = SyncStatus.retrying;
                    } else {
                        this.retryCount = 0;
                        this.syncStatus = SyncStatus.failed;
                    }
                })
                ["finally"](() => this.isSyncing = false)
        }

        gameScoreTimeout: number;
        setNewGameScore(newScore: number) {
            this.newGameScore = newScore;
            var currentTimeout = setTimeout(() => {
                if (this.gameScoreTimeout == currentTimeout) {
                    this.newGameScore = null;
                }

            }, 7000);
            this.gameScoreTimeout = currentTimeout;
        }
    }
}