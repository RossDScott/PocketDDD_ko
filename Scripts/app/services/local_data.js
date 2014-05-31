var PocketDDD;
(function (PocketDDD) {
    (function (Services) {
        var LSItem;
        (function (LSItem) {
            LSItem[LSItem["hasSeenIntro"] = 0] = "hasSeenIntro";
            LSItem[LSItem["userGeneratedEventData"] = 1] = "userGeneratedEventData";
            LSItem[LSItem["eventDetail"] = 2] = "eventDetail";
            LSItem[LSItem["event"] = 3] = "event";
            LSItem[LSItem["dddEventListVersion"] = 4] = "dddEventListVersion";
            LSItem[LSItem["clientToken"] = 5] = "clientToken";
            LSItem[LSItem["currentEventId"] = 6] = "currentEventId";
        })(LSItem || (LSItem = {}));

        var LocalData = (function () {
            function LocalData() {
            }
            LocalData.prototype.getClientToken = function () {
                var token = this.getStringItem(5 /* clientToken */);
                if (!token) {
                    token = generateUUID();
                    this.setClientToken(token);
                }
                return token;
            };
            LocalData.prototype.setClientToken = function (token) {
                this.updateStringItem(token, 5 /* clientToken */);
            };

            LocalData.prototype.getHasSeenIntro = function () {
                return this.getItem(0 /* hasSeenIntro */) == true;
            };
            LocalData.prototype.setHasSeenIntro = function (hasSeen) {
                this.updateItem(hasSeen, 0 /* hasSeenIntro */);
            };

            LocalData.prototype.getCurrentEventId = function () {
                return +this.getItem(6 /* currentEventId */);
            };
            LocalData.prototype.setCurrentEventId = function (eventId) {
                this.updateItem(eventId, 6 /* currentEventId */);
            };

            LocalData.prototype.getDDDEventListVersion = function () {
                return +this.getItem(4 /* dddEventListVersion */);
            };
            LocalData.prototype.setDDDEventListVersion = function (val) {
                this.updateItem(val, 4 /* dddEventListVersion */);
            };

            LocalData.prototype.getUserEventData = function (dddEventId) {
                return this.getItem(1 /* userGeneratedEventData */, dddEventId.toString());
            };
            LocalData.prototype.setUserEventData = function (data) {
                this.updateItem(data, 1 /* userGeneratedEventData */, data.eventId.toString());
            };
            LocalData.prototype.setUserEventDataJSON = function (dataJSON, dddEventId) {
                console.log(dataJSON);
                this.updateStringItem(dataJSON, 1 /* userGeneratedEventData */, dddEventId.toString());
            };

            LocalData.prototype.getEventDetail = function (dddEventId) {
                return this.getItem(2 /* eventDetail */, dddEventId.toString());
            };
            LocalData.prototype.setEventDetail = function (eventDetail) {
                console.dir(eventDetail);
                this.updateItem(eventDetail, 2 /* eventDetail */, eventDetail.dddEventId.toString());
            };

            LocalData.prototype.getEvents = function () {
                return this.getList(3 /* event */);
            };
            LocalData.prototype.setEvents = function (dddEvents) {
                this.updateList(dddEvents, 3 /* event */);
            };

            LocalData.prototype.getItem = function (lsItem, itemId) {
                var storageKey = LSItem[lsItem] + (itemId ? "_" + itemId : "");
                var storageText = window.localStorage[storageKey];

                if (!storageText)
                    return null;

                var parsed = JSON.parse(storageText);
                return parsed;
            };

            LocalData.prototype.getStringItem = function (lsItem, itemId) {
                var storageKey = LSItem[lsItem] + (itemId ? "_" + itemId : "");
                var storageText = window.localStorage[storageKey];

                return storageText;
            };

            LocalData.prototype.getList = function (lsItem, itemId) {
                var storageKey = LSItem[lsItem] + (itemId ? "_" + itemId : "");
                var storageText = window.localStorage[storageKey];

                if (!storageText)
                    return [];

                var parsed = JSON.parse(storageText);
                return parsed;
            };

            LocalData.prototype.updateList = function (list, lsItem, itemId) {
                var storageKey = LSItem[lsItem] + (itemId ? "_" + itemId : "");
                var storageText = JSON.stringify(list);
                window.localStorage[storageKey] = storageText;
            };

            LocalData.prototype.updateItem = function (item, lsItem, itemId) {
                var storageKey = LSItem[lsItem] + (itemId ? "_" + itemId : "");
                var storageText = JSON.stringify(item);
                window.localStorage[storageKey] = storageText;
            };

            LocalData.prototype.updateStringItem = function (item, lsItem, itemId) {
                var storageKey = LSItem[lsItem] + (itemId ? "_" + itemId : "");
                window.localStorage[storageKey] = item;
            };
            return LocalData;
        })();
        Services.LocalData = LocalData;
    })(PocketDDD.Services || (PocketDDD.Services = {}));
    var Services = PocketDDD.Services;
})(PocketDDD || (PocketDDD = {}));
//# sourceMappingURL=local_data.js.map
