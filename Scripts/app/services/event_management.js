var PocketDDD;
(function (PocketDDD) {
    (function (Services) {
        var EventManagement = (function () {
            function EventManagement() {
                var _this = this;
                this.localData = new PocketDDD.Services.LocalData();
                this.serverData = new PocketDDD.Services.ServerData();
                this.registrationFailureCount = 0;
                this.register = function (eventData, eventbriteOrderNo) {
                    var clientToken = _this.localData.getClientToken();
                    return _this.serverData.register(eventbriteOrderNo, eventData.dddEvent.id, clientToken).then(function (registrationData) {
                        if (!registrationData)
                            return false;

                        var data = registrationData;
                        var userRegistration = {
                            firstName: data.firstName,
                            lastName: data.lastName,
                            token: data.token
                        };
                        ko.track(userRegistration);
                        eventData.userData.userRegistration = userRegistration;
                        eventData.userData.eventScore = registrationData.eventScore;

                        return true;
                    }, function () {
                        _this.registrationFailureCount++;
                        if (_this.registrationFailureCount < 3) {
                            return Q.delay(500 + (_this.registrationFailureCount * 500)).then(function () {
                                return _this.register(eventData, eventbriteOrderNo);
                            });
                        } else
                            return false;
                    });
                };
            }
            EventManagement.prototype.getEventList = function () {
                return this.localData.getEvents();
            };

            EventManagement.prototype.getEventsForSyncAndBuildVMData = function () {
                var _this = this;
                var events = this.getEventList().filter(function (e) {
                    return e.isActive;
                });
                events.forEach(function (e) {
                    return _this.getEventData(e);
                });
                return events;
            };

            EventManagement.prototype.getEventData = function (dddEvent) {
                if (!dddEvent.vmData) {
                    dddEvent.vmData = new PocketDDD.VM.EventDataVM(dddEvent);
                }
                return dddEvent.vmData;
            };
            return EventManagement;
        })();
        Services.EventManagement = EventManagement;
    })(PocketDDD.Services || (PocketDDD.Services = {}));
    var Services = PocketDDD.Services;
})(PocketDDD || (PocketDDD = {}));
//# sourceMappingURL=event_management.js.map
