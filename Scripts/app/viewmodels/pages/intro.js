var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var PocketDDD;
(function (PocketDDD) {
    (function (VM) {
        var IntroPage = (function (_super) {
            __extends(IntroPage, _super);
            function IntroPage(nav) {
                var _this = this;
                _super.call(this, 0 /* intro */, nav);
                this.nav = nav;
                this.currentPosition = 0;
                this.nextClick = function () {
                    return _this.currentPosition++;
                };
                this.backClick = function () {
                    return _this.currentPosition--;
                };
                this.finishClick = function () {
                    var localDal = new PocketDDD.Services.LocalData();

                    var hasSeenIntro = localDal.setHasSeenIntro(true);
                    _this.nav.navigateTo(1 /* eventList */, null, false);
                };

                ko.track(this);

                this.defineProperties();
            }
            Object.defineProperty(IntroPage.prototype, "hasReachedEnd", {
                get: function () {
                    return this.currentPosition >= 3;
                },
                enumerable: true,
                configurable: true
            });

            IntroPage.prototype.defineProperties = function () {
                var _this = this;
                ko.defineProperty(this, "introContent", function () {
                    switch (_this.currentPosition) {
                        case 0:
                            return "This application has been designed to support current and future DDD events.<br / > You can view sessions and speakers, along with providing ratings and feedback comments.";
                        case 1:
                            return "If the event supports it then, each time you rate a session, provide feedback comments or rate the event you will be given an extra chance of winning in the prize draw.</br>The app will show you your event score which == entries into the prize draw.</br>You must register using your eventbrite order number to be entered into the draw. Anon feedback is fine, but you won't get an event score!";
                        case 2:
                            return "The app was created by Ross Scott and the source will be available on GitHub: https://github.com/RossDScott/PocketDDD.</br>Feedback is very welcome:</br>@RossDScott</br>ross.d.scott@gmail.com</br>Or through the app itself";
                        case 3:
                            return "You won't be bothered by this page again.";
                    }
                });
            };
            return IntroPage;
        })(PocketDDD.VM.BasePage);
        VM.IntroPage = IntroPage;
    })(PocketDDD.VM || (PocketDDD.VM = {}));
    var VM = PocketDDD.VM;
})(PocketDDD || (PocketDDD = {}));
//<p>
//Each time you 'checkin' to a session, rate the session or provide feedback comments you will be given an extra chance of winning in the prize draw.
//    </p>
//# sourceMappingURL=intro.js.map
