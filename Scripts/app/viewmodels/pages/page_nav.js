var PocketDDD;
(function (PocketDDD) {
    (function (VM) {
        var PageNav = (function () {
            function PageNav() {
                var _this = this;
                this.currentPage = null;
                this.pageDir = {};
                this.isSyncing = false;
                this.deleteClickCount = 0;
                this.historyStack = [];
                this.backClick = function () {
                    if (_this.historyStack.length === 0)
                        return;

                    var backTo = _this.historyStack.pop();
                    _this.navigateTo(backTo, undefined, false);
                };
                this.syncClick = function () {
                    PocketDDD.appState.sync();
                };
                this.homeClick = function () {
                    _this.resetTitle();
                    _this.historyStack.removeAll();
                    _this.navigateTo(1 /* eventList */, null, false);
                };
                this.currentEventClick = function () {
                    _this.historyStack.removeAll();
                    var event = _.find(PocketDDD.appState.events, { id: PocketDDD.appState.currentEventId });
                    _this.navigateTo(2 /* eventHome */, event, false);
                };
                this.deleteAllDataClick = function () {
                    if (_this.deleteClickCount === 0)
                        alert("This will delete all data. If you are sure, then click the delete button three times");

                    _this.deleteClickCount++;
                };
                this.deleteAllDataConfirmClick = function () {
                    _this.deleteClickCount++;
                    if (_this.deleteClickCount >= 4) {
                        localStorage.clear();
                        alert("All data deleted");
                        _this.deleteClickCount = 0;
                    }
                };
                this.deleteAllDataCancelClick = function () {
                    if (_this.deleteClickCount == 3) {
                        var event = _.find(PocketDDD.appState.events, { id: PocketDDD.appState.currentEventId });
                        if (event && event.vmData && event.vmData.userData.userRegistration)
                            event.vmData.userData.eventFeedback.easterEggRR = true;
                    }
                    _this.deleteClickCount = 0;
                    _this.expandingSection.isExpanded = false;
                };
                this.expandingSection = new PocketDDD.VM.ExpandingSection();
                this.resetTitle();
                ko.track(this);

                ko.defineProperty(this, "showBack", function () {
                    return _this.historyStack.length > 0;
                });
                ko.getObservable(PocketDDD.appState, "isSyncing").subscribe(function (isSyncing) {
                    if (isSyncing) {
                        _this.isSyncing = true;
                        _this.testSyncStatus();
                    }
                });

                ko.defineProperty(this, "syncStatusClass", function () {
                    return PocketDDD.Services.SyncStatus[PocketDDD.appState.syncStatus];
                });

                ko.defineProperty(this, "currentEventTitle", function () {
                    return PocketDDD.appState.currentEventName;
                });

                ko.defineProperty(this, "newGameScore", function () {
                    return PocketDDD.appState.newGameScore;
                });

                this.isSyncing = PocketDDD.appState.isSyncing;
                if (this.isSyncing)
                    this.testSyncStatus();
            }
            PageNav.prototype.testSyncStatus = function () {
                var _this = this;
                if (!PocketDDD.appState.isSyncing && PocketDDD.appState.syncStatus !== 2 /* retrying */) {
                    setTimeout(function () {
                        return _this.isSyncing = false;
                    }, 3000);
                } else {
                    setTimeout(function () {
                        return _this.testSyncStatus();
                    }, 500);
                }
            };

            PageNav.prototype.resetTitle = function () {
                this.title = "PocketDDD";
                this.subTitle = "";
            };
            PageNav.prototype.showEventTitle = function (eventName) {
                this.title = eventName;
                this.subTitle = "pocket";
            };

            PageNav.prototype.navigateTo = function (pageType, data, includeInHistory) {
                if (typeof includeInHistory === "undefined") { includeInHistory = true; }
                this.expandingSection.isExpanded = false;

                if (this.currentPage) {
                    this.currentPage.isActive = false;
                    if (includeInHistory && this.historyStack[this.historyStack.length - 1] !== this.currentPage.pageType)
                        this.historyStack.push(this.currentPage.pageType);
                }

                this.currentPage = this.pageDir[PocketDDD.VM.PageType[pageType]];
                if (this.currentPage.show)
                    this.currentPage.show(data);

                this.currentPage.isActive = true;
            };
            return PageNav;
        })();
        VM.PageNav = PageNav;
    })(PocketDDD.VM || (PocketDDD.VM = {}));
    var VM = PocketDDD.VM;
})(PocketDDD || (PocketDDD = {}));
//# sourceMappingURL=page_nav.js.map
