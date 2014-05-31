var PocketDDD;
(function (PocketDDD) {
    (function (Services) {
        var ServerData = (function () {
            function ServerData() {
            }
            ServerData.prototype.register = function (eventbriteOrderNo, eventId, clientToken) {
                var jQProm = $.ajax("/api/RegisterEventbriteOrderNo", {
                    data: { eventbriteOrderNo: eventbriteOrderNo, dddEventId: eventId, clientToken: clientToken }
                });

                return Q(jQProm);
            };

            ServerData.prototype.sync = function (syncData) {
                var jQProm = $.ajax("/api/DDDEvents/Sync", {
                    data: JSON.stringify({ syncData: syncData }),
                    dataType: "json",
                    contentType: "application/json",
                    cache: false,
                    type: "post"
                });

                return Q(jQProm);
            };
            return ServerData;
        })();
        Services.ServerData = ServerData;
    })(PocketDDD.Services || (PocketDDD.Services = {}));
    var Services = PocketDDD.Services;
})(PocketDDD || (PocketDDD = {}));
//# sourceMappingURL=server_data.js.map
