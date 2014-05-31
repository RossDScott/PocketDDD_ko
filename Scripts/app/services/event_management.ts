module PocketDDD.Services {
    export class EventManagement {
        private localData = new LocalData();
        private serverData = new ServerData();

        getEventList(): DDDEvent[]{
            return this.localData.getEvents();
        }

        getEventData(dddEvent: DDDEvent): VM.EventDataVM{
            if (!dddEvent.vmData) {
                dddEvent.vmData = new VM.EventDataVM(dddEvent);
            }
            return dddEvent.vmData;
        }

        registrationFailureCount = 0;
        register = (eventData: VM.EventDataVM, eventbriteOrderNo: number): Q.Promise<boolean> => {
            var clientToken = this.localData.getClientToken();
            return this.serverData.register(eventbriteOrderNo, eventData.dddEvent.id, clientToken)
                .then((registrationData: any) => {
                    if (!registrationData)
                        return false;

                    var data: DDDEventUserRegisteredInfo = registrationData;
                    var userRegistration = {
                        firstName: data.firstName,
                        lastName: data.lastName,
                        token: data.token
                    }
                    ko.track(userRegistration);
                    eventData.userData.userRegistration = userRegistration;
                    eventData.userData.eventScore = registrationData.eventScore;
                
                    return true;
                }, () => {
                    this.registrationFailureCount++;
                    if (this.registrationFailureCount < 3) {
                        return <any> (<any>Q.delay)(500 + (this.registrationFailureCount * 500))
                            .then(() => this.register(eventData, eventbriteOrderNo));
                    } else
                        return false;
                });
        }
    }
} 