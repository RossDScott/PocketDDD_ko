var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var PocketDDD;
(function (PocketDDD) {
    (function (VM) {
        var EventFeedbackPage = (function (_super) {
            __extends(EventFeedbackPage, _super);
            function EventFeedbackPage(nav) {
                _super.call(this, 5 /* eventFeedback */, nav);
                this.nav = nav;
                this.currentEventData = null;

                this.eventComments = new PocketDDD.VM.Comments();
                this.eventComments.defaultAdd = false;
                this.eventComments.title = "Event comments";

                this.mostLikeComments = new PocketDDD.VM.Comments();
                this.mostLikeComments.defaultAdd = false;
                this.mostLikeComments.title = "Most Like?";

                this.leastLikeComments = new PocketDDD.VM.Comments();
                this.leastLikeComments.defaultAdd = false;
                this.leastLikeComments.title = "Least Like?";

                this.pocketDDDComments = new PocketDDD.VM.Comments();
                this.pocketDDDComments.defaultAdd = false;
                this.pocketDDDComments.title = "Use of pocketDDD?";

                ko.track(this);
            }
            EventFeedbackPage.prototype.show = function (data) {
                if (data !== undefined) {
                    this.currentEventData = data;

                    this.eventComments.setData(this.currentEventData.userData.eventFeedback.comments);
                    this.mostLikeComments.setData(this.currentEventData.userData.eventFeedback.mostLike);
                    this.leastLikeComments.setData(this.currentEventData.userData.eventFeedback.leastLike);
                    this.pocketDDDComments.setData(this.currentEventData.userData.eventFeedback.pocketDDD);

                    this.isActive = true;
                }
            };
            return EventFeedbackPage;
        })(PocketDDD.VM.BasePage);
        VM.EventFeedbackPage = EventFeedbackPage;
    })(PocketDDD.VM || (PocketDDD.VM = {}));
    var VM = PocketDDD.VM;
})(PocketDDD || (PocketDDD = {}));
//# sourceMappingURL=event_feedback.js.map
