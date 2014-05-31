module PocketDDD.VM{
    export class ExpandingSection{
        isExpanded = false;

        constructor() {
            ko.track(this);
        }

        showHideExpand = () => {
            this.isExpanded = !this.isExpanded;
        }
    }
}