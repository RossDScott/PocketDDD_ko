module PocketDDD.Services {
    export class ServerData{

        register(eventbriteOrderNo: number, eventId: number, clientToken: string): Q.Promise<any> {
            var jQProm = $.ajax("/api/RegisterEventbriteOrderNo", {
                data: { eventbriteOrderNo: eventbriteOrderNo, dddEventId: eventId, clientToken: clientToken}
            });

            return Q(jQProm);
        }

        sync(syncData: DTOs.SyncData): Q.Promise<DTOs.SyncResult> {
            var jQProm = $.ajax("/api/DDDEvents/Sync", {
                data: JSON.stringify({ syncData: syncData }),
                dataType: "json",
                contentType: "application/json",
                cache: false,
                type: "post"
            });

            return Q(jQProm);
        }
    }
}