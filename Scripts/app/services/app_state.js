var PocketDDD;
(function (PocketDDD) {
    (function (Services) {
        (function (SyncStatus) {
            SyncStatus[SyncStatus["waiting"] = 0] = "waiting";
            SyncStatus[SyncStatus["success"] = 1] = "success";
            SyncStatus[SyncStatus["retrying"] = 2] = "retrying";
            SyncStatus[SyncStatus["failed"] = 3] = "failed";
        })(Services.SyncStatus || (Services.SyncStatus = {}));
        var SyncStatus = Services.SyncStatus;

        var AppState = (function () {
            function AppState() {
                this.events = [];
                this.isSyncing = false;
                this.syncStatus = null;
                this.currentEventName = "";
                this.newGameScore = null;
                this.currentSyncWaiting = null;
                this.retryCount = 0;
                this.eventMgr = new PocketDDD.Services.EventManagement();
                this.syncMgr = new PocketDDD.Services.SyncManagement();
                this.localData = new PocketDDD.Services.LocalData();
            }
            AppState.prototype.init = function () {
                this.loadEvents();
                ko.track(this);
                this.sync();
            };

            AppState.prototype.loadEvents = function () {
                var events = this.eventMgr.getEventList();
                events.forEach(function (x) {
                    return ko.track(x);
                });
                this.events = events;
            };

            AppState.prototype.setHasOutstandingSyncData = function () {
                var _this = this;
                if (this.currentSyncWaiting)
                    clearTimeout(this.currentSyncWaiting);

                var thisTimeout = setTimeout(function () {
                    _this.sync().then(function () {
                        if (_this.currentSyncWaiting === thisTimeout)
                            _this.currentSyncWaiting = null;
                    });
                }, 4000);
                this.currentSyncWaiting = thisTimeout;
            };

            AppState.prototype.sync = function () {
                var _this = this;
                this.isSyncing = true;
                this.syncStatus = 0 /* waiting */;
                return this.syncMgr.syncData().then(function () {
                    return _this.syncStatus = 1 /* success */;
                })["catch"](function () {
                    _this.retryCount++;
                    if (_this.retryCount < 5) {
                        _this.currentSyncWaiting = setTimeout(function () {
                            return _this.sync();
                        }, 1000 + (_this.retryCount * 500) + _.random(2000));
                        _this.syncStatus = 2 /* retrying */;
                    } else {
                        _this.retryCount = 0;
                        _this.syncStatus = 3 /* failed */;
                    }
                })["finally"](function () {
                    return _this.isSyncing = false;
                });
            };

            AppState.prototype.setNewGameScore = function (newScore) {
                var _this = this;
                this.newGameScore = newScore;
                var currentTimeout = setTimeout(function () {
                    if (_this.gameScoreTimeout == currentTimeout) {
                        _this.newGameScore = null;
                    }
                }, 7000);
                this.gameScoreTimeout = currentTimeout;
            };
            return AppState;
        })();
        Services.AppState = AppState;
    })(PocketDDD.Services || (PocketDDD.Services = {}));
    var Services = PocketDDD.Services;
})(PocketDDD || (PocketDDD = {}));
//# sourceMappingURL=app_state.js.map
