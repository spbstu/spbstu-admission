function getFilters() {
    return groupFilter;
}

Template.Navigation.helpers({
    items: getFilters,

    selectedAttr: function(itemValue, filterValue) {
        return itemValue === filterValue.get() ? 'selected' : '';
    }
});

Template.Navigation.events({
    'change select': function(event) {
        this.set(event.target.value);
    },
    'click .reset-filter': function() {
        groupFilter.reset();
    }
});

Template.Navigation.rendered = function () {
    this.autorun(_.bind(function () {
        getFilters(this.data).get();

        Deps.afterFlush(function () {
            $('select').material_select();
        });
    }, this));
};
