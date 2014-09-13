module PocketDDD.VM {
    export class EventBriteRegistration {
        visible = false;
        stage = 0;
        cardStatus: string = "";
        evenbriteOrderNo: number = null;
        registrationFailed = false;

        welcomeName: string;

        currentEventData: EventDataVM = null;

        constructor() {
            this.visible = false; // !appState.currentEvent.isRegistered;
            this.cardStatus = "cardQuestion";
            //this.showingQuestion = true;

            ko.track(this);

            ko.defineProperty(this, "welcomeName", () => {
                if (!this.currentEventData || !this.currentEventData.isRegistered)
                    return "";
                return this.currentEventData.userData.userRegistration.firstName;
            });
        }

        show(data: EventDataVM) {
            this.reset();
            this.currentEventData = data;
            this.visible = !data.isRegistered;
        }

        reset() {
            this.registrationFailed = false;
            this.stage = 0;
        }

        showHideExpand = () => {
            
        }

        yesEnterClick = () => {
            this.stage = 1;
        }

        submitNumberClick = () => {
            if (!this.evenbriteOrderNo)
                return;

            this.stage = 2;
            this.registrationFailed = false;
            var eventMgr = new Services.EventManagement();

            eventMgr.registrationFailureCount = 0;
            eventMgr.register(this.currentEventData, this.evenbriteOrderNo)
                .then((success) => {
                    if(success)
                        this.stage = 3;
                    else {
                        this.registrationFailed = true;
                        this.stage = 1;
                    }
                }, () => {
                    this.registrationFailed = true;
                    this.stage = 1;
                });
        }

        cancelAskClick = () => {
            //this.cardStatus = "cardWarning";
            this.stage = -1;
        }

        closeClick = () => {
            this.visible = false;
        }
    }
}