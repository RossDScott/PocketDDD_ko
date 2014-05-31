module PocketDDD.VM {
    export enum SessionHomeDisplayType {
        synopsis,
        detail,
        feedback
    }

    export class SessionHomePage extends BasePage {
        expandingAmIGoingChoiceSection: ExpandingSection;
        currentSessionData: SessionDataVM = null;
        displayType: SessionHomeDisplayType = SessionHomeDisplayType.synopsis;
        sessionData: Session;

        privateComments: Comments;

        constructor(private nav: PageNav) {
            super(PageType.sessionHome, nav);
            this.expandingAmIGoingChoiceSection = new ExpandingSection();
            this.privateComments = new Comments();
            this.privateComments.defaultAdd = true;

            ko.track(this);
        }

        show(currentSession: SessionDataVM) {
            if (currentSession !== undefined)
                this.currentSessionData = currentSession;

            this.displayType = SessionHomeDisplayType.synopsis;
            this.privateComments.setData(this.currentSessionData.userSessionData.privateComments);
            this.isActive = true;
        }

        showShortDescriptionClick = () => {
            this.displayType = SessionHomeDisplayType.synopsis;
        }

        showLongDescriptionClick = () => {
            this.displayType = SessionHomeDisplayType.detail;
        }

        showFeedbackClick = () => {
            this.displayType = SessionHomeDisplayType.feedback;
        }

        amIGoingChoiceOptionsClick = (choice: AttendanceChoiceOption) => {
            this.currentSessionData.userSessionData.attendingStatus = choice.choiceType;
            this.expandingAmIGoingChoiceSection.showHideExpand();
        }

        bookmarkThisClick = () => {
            this.currentSessionData.userSessionData.bookmarked = !this.currentSessionData.userSessionData.bookmarked;
        }
    }
}