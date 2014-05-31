var PocketDDD;
(function (PocketDDD) {
    PocketDDD.appState;

    //export var serverData: Services.ServerData;
    $(function () {
        //$('#headerExpandSection').collapse({ toggle: false });
        //$("#headerExpandCollapseButton").on("click", function () {
        //    $('#headerExpandSection').collapse('toggle');
        //    $("#headerExpandCollapseIcon").toggleClass("rotate");
        //});
        //$('.collapseTarget').collapse({ toggle: false });
        //$('.collapseTriggerBtn').on('click', function (e) {
        //    $(e.currentTarget).parents('.expandGroup').find('.collapseTarget').collapse('toggle');
        //});
        $("button").on("touchstart", function () {
            $(this).removeClass("mobileHoverFix");
        });
        $("button").on("touchend", function () {
            $(this).addClass("mobileHoverFix");
        });

        PocketDDD.appState = new PocketDDD.Services.AppState();
        PocketDDD.appState.init();

        //serverData = new Services.ServerData();
        var main = new PocketDDD.VM.Main();
        //appState.currentEvent.setEvent(appState.events[0]);
    });
})(PocketDDD || (PocketDDD = {}));
//# sourceMappingURL=init.js.map
