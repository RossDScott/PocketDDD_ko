module PocketDDD.VM {
    export class PageNav {
        showBack: boolean;
        expandingSection: ExpandingSection;

        currentPage: IPage = null;
        pageDir: HashTable<IPage> = {};

        title: string;
        subTitle: string;
        isSyncing = false;
        deleteClickCount = 0;

        private historyStack: PageType[] = [];

        constructor() {
            this.expandingSection = new ExpandingSection();
            this.resetTitle();
            ko.track(this);

            ko.defineProperty(this, "showBack", () => this.historyStack.length > 0);
            ko.getObservable(appState, "isSyncing").subscribe((isSyncing) => {
                if (isSyncing) {
                    this.isSyncing = true;
                    this.testSyncStatus();
                }  
            });

            ko.defineProperty(this, "syncStatusClass", () => Services.SyncStatus[appState.syncStatus]);

            ko.defineProperty(this, "currentEventTitle", () => appState.currentEventName);

            ko.defineProperty(this, "newGameScore", () => appState.newGameScore);

            this.isSyncing = appState.isSyncing;
            if (this.isSyncing)
                this.testSyncStatus();
        }

        testSyncStatus() {
            if (!appState.isSyncing && appState.syncStatus !== Services.SyncStatus.retrying) {
                setTimeout(() => this.isSyncing = false, 3000);
            } else {
                setTimeout(() => this.testSyncStatus(), 500);
            }
        }

        resetTitle() {
            this.title = "PocketDDD";
            this.subTitle = "";
        }
        showEventTitle(eventName: string) {
            this.title = eventName;
            this.subTitle = "pocket";
        }

        backClick = () => {
            if (this.historyStack.length === 0)
                return;

            var backTo = this.historyStack.pop();
            this.navigateTo(backTo, undefined, false);
        }

        navigateTo(pageType: PageType, data?: any, includeInHistory = true) {
            this.expandingSection.isExpanded = false;

            if (this.currentPage) {
                this.currentPage.isActive = false;
                if (includeInHistory && this.historyStack[this.historyStack.length - 1] !== this.currentPage.pageType)
                    this.historyStack.push(this.currentPage.pageType);
            }

            this.currentPage = this.pageDir[PageType[pageType]];
            if (this.currentPage.show)
                this.currentPage.show(data);

            this.currentPage.isActive = true;
        }

        syncClick = () => {
            appState.sync();
        }

        homeClick = () => {
            this.resetTitle();
            this.historyStack.removeAll();
            this.navigateTo(PageType.eventList, null, false);
        }

        currentEventClick = () => {
            this.historyStack.removeAll();
            var event = _.find<DDDEvent>(appState.events, <any> { id: appState.currentEventId });
            this.navigateTo(PageType.eventHome, event, false);
        }

        
        deleteAllDataClick = () => {
            if (this.deleteClickCount === 0)
                alert("This will delete all data. If you are sure, then click the delete button three times");

            this.deleteClickCount++;
        }
        deleteAllDataConfirmClick = () => {
            this.deleteClickCount++;
            if (this.deleteClickCount >= 4) {
                localStorage.clear();
                alert("All data deleted");
                this.deleteClickCount = 0;
            }
        }
        deleteAllDataCancelClick = () => {
            if (this.deleteClickCount == 3) {
                var event = _.find<DDDEvent>(appState.events, <any> { id: appState.currentEventId });
                if (event && event.vmData && event.vmData.userData.userRegistration)
                    event.vmData.userData.eventFeedback.easterEggRR = true;
            }
            this.deleteClickCount = 0;
            this.expandingSection.isExpanded = false;
        }
    }


} 