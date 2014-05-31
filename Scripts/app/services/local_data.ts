module PocketDDD.Services{
    enum LSItem {
        hasSeenIntro,
        userGeneratedEventData,
        eventDetail,
        event,
        dddEventListVersion,
        clientToken,
        currentEventId
    }

    export class LocalData{
        getClientToken(): string {
            var token = this.getStringItem(LSItem.clientToken);
            if (!token) {
                token = generateUUID();
                this.setClientToken(token);
            }
            return token;
        }
        setClientToken(token: string) { this.updateStringItem(token, LSItem.clientToken) }

        getHasSeenIntro(): boolean{return this.getItem(LSItem.hasSeenIntro) == true}
        setHasSeenIntro(hasSeen: boolean){this.updateItem<boolean>(hasSeen,LSItem.hasSeenIntro)}

        getCurrentEventId(): number {return +this.getItem(LSItem.currentEventId) }
        setCurrentEventId(eventId: number) { this.updateItem<number>(eventId, LSItem.currentEventId) }

        getDDDEventListVersion(): number {return +this.getItem(LSItem.dddEventListVersion)}
        setDDDEventListVersion(val: number){this.updateItem(val,LSItem.dddEventListVersion)}

        getUserEventData(dddEventId: number): DDDEventUserGeneratedData {
            return this.getItem(LSItem.userGeneratedEventData, dddEventId.toString());
        }
        setUserEventData(data: DDDEventUserGeneratedData) {
            this.updateItem(data, LSItem.userGeneratedEventData, data.eventId.toString());
        }
        setUserEventDataJSON(dataJSON: string, dddEventId) {
            console.log(dataJSON);
            this.updateStringItem(dataJSON, LSItem.userGeneratedEventData, dddEventId.toString());
        }

        getEventDetail(dddEventId: number): DDDEventDetail {
            return this.getItem(LSItem.eventDetail, dddEventId.toString());
        }
        setEventDetail(eventDetail:DDDEventDetail) {
            console.dir(eventDetail);
            this.updateItem(eventDetail, LSItem.eventDetail, eventDetail.dddEventId.toString());
        }

        getEvents(): DDDEvent[]{
            return this.getList<DDDEvent>(LSItem.event);
        }
        setEvents(dddEvents: DDDEvent[]) {
            this.updateList(dddEvents, LSItem.event);
        }

        private getItem(lsItem: LSItem, itemId?: string): any {
            var storageKey = LSItem[lsItem] + (itemId ? "_" + itemId : "");
            var storageText = window.localStorage[storageKey];

            if (!storageText)
                return null;

            var parsed = JSON.parse(storageText);
            return parsed;
        }

        private getStringItem(lsItem: LSItem, itemId?: string): any {
            var storageKey = LSItem[lsItem] + (itemId ? "_" + itemId : "");
            var storageText = window.localStorage[storageKey];

            return storageText;
        }

        private getList<T>(lsItem: LSItem, itemId?: string): T[] {
            var storageKey = LSItem[lsItem] + (itemId ? "_" + itemId : "");
            var storageText = window.localStorage[storageKey];

            if (!storageText)
                return [];

            var parsed = JSON.parse(storageText);
            return parsed;
        }

        private updateList<T>(list: T[], lsItem: LSItem, itemId?: string): void {
            var storageKey = LSItem[lsItem] + (itemId ? "_" + itemId : "");
            var storageText = JSON.stringify(list);
            window.localStorage[storageKey] = storageText;
        }

        private updateItem<T>(item: T, lsItem: LSItem, itemId?: string): void {
            var storageKey = LSItem[lsItem] + (itemId ? "_" + itemId : "");
            var storageText = JSON.stringify(item);
            window.localStorage[storageKey] = storageText;
        }

        private updateStringItem(item: string, lsItem: LSItem, itemId?: string): void {
            var storageKey = LSItem[lsItem] + (itemId ? "_" + itemId : "");
            window.localStorage[storageKey] = item;
        }

    }
}