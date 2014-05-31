var PocketDDD;
(function (PocketDDD) {
    (function (VM) {
        var ExpandingSection = (function () {
            function ExpandingSection() {
                var _this = this;
                this.isExpanded = false;
                this.showHideExpand = function () {
                    _this.isExpanded = !_this.isExpanded;
                };
                ko.track(this);
            }
            return ExpandingSection;
        })();
        VM.ExpandingSection = ExpandingSection;
    })(PocketDDD.VM || (PocketDDD.VM = {}));
    var VM = PocketDDD.VM;
})(PocketDDD || (PocketDDD = {}));
//# sourceMappingURL=expanding_section.js.map
