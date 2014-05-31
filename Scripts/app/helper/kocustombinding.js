ko.bindingHandlers.collapsableSection = {
    init: function (element, valueAccessor, allBindingsAccessor, viewModel) {
        // First get the latest data that we're bound to
        var value = valueAccessor();

        // Next, whether or not the supplied model property is observable, get its current value
        var valueUnwrapped = ko.unwrap(value.isExpanded);

        $(element).find('.collapseTarget').collapse({ toggle: false });
    },
    update: function (element, valueAccessor, allBindingsAccessor, viewModel) {
        // First get the latest data that we're bound to
        var value = valueAccessor();

        // Next, whether or not the supplied model property is observable, get its current value
        var valueUnwrapped = ko.unwrap(value.isExpanded);

        $(element).find('.collapseTarget').collapse(valueUnwrapped ? 'show' : 'hide');
    }
};

ko.bindingHandlers.rating = {
    init: function (element, valueAccessor, allBindingsAccessor, viewModel) {
        // First get the latest data that we're bound to
        var value = valueAccessor();

        // Next, whether or not the supplied model property is observable, get its current value
        var valueUnwrapped = ko.unwrap(value);

        $(element).rating();
        $(element).on('rating.change', function (event, newValue, caption) {
            valueAccessor()(newValue);
        });
    },
    update: function (element, valueAccessor, allBindingsAccessor, viewModel) {
        // First get the latest data that we're bound to
        var value = valueAccessor();

        // Next, whether or not the supplied model property is observable, get its current value
        var valueUnwrapped = ko.unwrap(value);

        $(element).rating('update', valueUnwrapped);
    }
};