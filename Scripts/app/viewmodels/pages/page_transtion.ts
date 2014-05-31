module PocketDDD.VM {
    export class PageTransitionVM {
        activeStatusCSS: string = "pageHidden";

        constructor(private page: IPage) {
            ko.track(this)

            ko.getObservable(page, "isActive").subscribe((isActive) => {
                if (isActive) {
                    this.activeStatusCSS = "";
                    setTimeout(() => this.activeStatusCSS = "showing", 50);
                    setTimeout(() => this.activeStatusCSS = "active", 1000);
                } else {
                    this.activeStatusCSS = "active hiding";
                    setTimeout(() => this.activeStatusCSS = "pageHidden", 1000);
                }
            });
        }
    }
} 