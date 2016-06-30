showRatings = function() {
    var settings = SiteSettings.findOne({'showRatings': {$exists: true}});
    return settings && settings.showRatings
}

Template.MainCampaign.helpers({
    showRatings: showRatings,
    showCounters: function() {
        return !showRatings();
    },
    hasGroups: function(groups) {
        return groups.length > 0;
    },
    needProgram: function() {
        var campaign = currentCampaign.get()
        return campaign === 'Основной прием' || campaign === 'Крым'
    }
});

Template.MainCampaign.events({
    'click .data-row_active': function() {
        Router.go('group', {groupId: this.groupId});
        return false;
    }
});

