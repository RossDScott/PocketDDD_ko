declare function generateUUID(): string;

module PocketDDD {
    export var appState: Services.AppState;
    //export var serverData: Services.ServerData;

    $(() => {
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

        appState = new Services.AppState();
        appState.init();
        //serverData = new Services.ServerData();
        var main = new VM.Main();

        //appState.currentEvent.setEvent(appState.events[0]);

    });

}
