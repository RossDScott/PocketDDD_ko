module PocketDDD.VM{
    export class IntroPage extends BasePage{

        introContent: string;
        currentPosition = 0;
        constructor(private nav: PageNav) {
            super(PageType.intro, nav);

            ko.track(this);

            this.defineProperties();
        }

        get hasReachedEnd(): boolean {
            return this.currentPosition >= 3;
        }

        private defineProperties() {
            ko.defineProperty(this, "introContent", () => {
                switch (this.currentPosition) {
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
        }

        nextClick = () => this.currentPosition++;
        backClick = () => this.currentPosition--;
        finishClick = () => {
            var localDal = new PocketDDD.Services.LocalData();

            var hasSeenIntro = localDal.setHasSeenIntro(true);
            this.nav.navigateTo(PageType.eventList, null, false);
        }
    }
} 

//<p>
//Each time you 'checkin' to a session, rate the session or provide feedback comments you will be given an extra chance of winning in the prize draw.
//    </p>