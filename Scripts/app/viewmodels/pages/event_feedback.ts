module PocketDDD.VM {
    export class EventFeedbackPage extends BasePage {
        currentEventData: EventDataVM = null;

        eventComments: Comments;
        mostLikeComments: Comments;
        leastLikeComments: Comments;
        pocketDDDComments: Comments;

        constructor(private nav: PageNav) {
            super(PageType.eventFeedback, nav);

            this.eventComments = new Comments();
            this.eventComments.defaultAdd = false;
            this.eventComments.title = "Event comments";

            this.mostLikeComments = new Comments();
            this.mostLikeComments.defaultAdd = false;
            this.mostLikeComments.title = "Most Like?";

            this.leastLikeComments = new Comments();
            this.leastLikeComments.defaultAdd = false;
            this.leastLikeComments.title = "Least Like?";

            this.pocketDDDComments = new Comments();
            this.pocketDDDComments.defaultAdd = false;
            this.pocketDDDComments.title = "Use of pocketDDD?";


            ko.track(this);
        }

        show(data: EventDataVM) {
            if (data !== undefined) {
                this.currentEventData = data;

                this.eventComments.setData(this.currentEventData.userData.eventFeedback.comments);
                this.mostLikeComments.setData(this.currentEventData.userData.eventFeedback.mostLike);
                this.leastLikeComments.setData(this.currentEventData.userData.eventFeedback.leastLike);
                this.pocketDDDComments.setData(this.currentEventData.userData.eventFeedback.pocketDDD);
                
                this.isActive = true;
            }
        }
    }
} 