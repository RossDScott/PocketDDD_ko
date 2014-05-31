var PocketDDD;
(function (PocketDDD) {
    (function (VM) {
        var EventBriteRegistration = (function () {
            function EventBriteRegistration() {
                var _this = this;
                this.visible = false;
                this.stage = 0;
                this.cardStatus = "";
                this.evenbriteOrderNo = null;
                this.registrationFailed = false;
                this.currentEventData = null;
                this.showHideExpand = function () {
                };
                this.yesEnterClick = function () {
                    _this.stage = 1;
                };
                this.submitNumberClick = function () {
                    if (!_this.evenbriteOrderNo)
                        return;

                    _this.stage = 2;
                    _this.registrationFailed = false;
                    var eventMgr = new PocketDDD.Services.EventManagement();

                    eventMgr.registrationFailureCount = 0;
                    eventMgr.register(_this.currentEventData, _this.evenbriteOrderNo).then(function (success) {
                        if (success)
                            _this.stage = 3;
                        else {
                            _this.registrationFailed = true;
                            _this.stage = 1;
                        }
                    }, function () {
                        _this.registrationFailed = true;
                        _this.stage = 1;
                    });
                };
                this.cancelAskClick = function () {
                    //this.cardStatus = "cardWarning";
                    _this.stage = -1;
                };
                this.closeClick = function () {
                    _this.visible = false;
                };
                this.visible = false; // !appState.currentEvent.isRegistered;
                this.cardStatus = "cardQuestion";

                //this.showingQuestion = true;
                ko.track(this);

                ko.defineProperty(this, "welcomeName", function () {
                    if (!_this.currentEventData || !_this.currentEventData.isRegistered)
                        return "";
                    return _this.currentEventData.userData.userRegistration.firstName;
                });
            }
            EventBriteRegistration.prototype.show = function (data) {
                this.currentEventData = data;
                this.visible = !data.isRegistered;
            };

            EventBriteRegistration.prototype.reset = function () {
                this.registrationFailed = false;
                this.stage = 0;
            };
            return EventBriteRegistration;
        })();
        VM.EventBriteRegistration = EventBriteRegistration;
    })(PocketDDD.VM || (PocketDDD.VM = {}));
    var VM = PocketDDD.VM;
})(PocketDDD || (PocketDDD = {}));
//# sourceMappingURL=eventbrite_registration.js.map
