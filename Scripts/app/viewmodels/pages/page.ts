module PocketDDD.VM {
    export enum PageType {
        intro,
        eventList,
        eventHome,
        sessionList,
        sessionHome,
        eventFeedback
    }

    export interface IPage {
        isActive: boolean;
        show? (data: any): void;
        pageType: PageType;
    }

    export class BasePage implements IPage {
        isActive = false;
        pageTransitionVM: PageTransitionVM;

        constructor(public pageType: PageType, nav: PageNav) {
            nav.pageDir[PageType[pageType]] = this;
            ko.track(this);

            this.pageTransitionVM = new PageTransitionVM(this);
        }

    }
} 