showRatings = function() {
    var settings = SiteSettings.findOne({'showRatings': {$exists: true}});
    return settings && settings.showRatings
}

Template.College.helpers({
    showRatings: showRatings,
    showCounters: function() {
        return !showRatings();
    },
    hasGroups: function(groups) {
        return groups.length > 0;
    }
});

Template.College.events({
    'click .data-row_active': function() {
        Router.go('group', {groupId: this.groupId});
        return false;
    }
});

