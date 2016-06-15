showRatings = function() {
    var settings = SiteSettings.findOne({'showRatings': {$exists: true}});
    return settings && settings.showRatings
}

Template.Campaigns.helpers({
    campaigns: function() {
        if(!showRatings()) {
            return campaigns.get();
        }
        
        var show = SiteSettings.findOne({'showContestGroups': {$exists: true}});

        if (show !== undefined && show['showContestGroups'] === false) {
            return [];
        } else {
            return contestGroups.get();
        }
    },


    activeClassName: function(campaign) {
        if(!showRatings()) {
            return campaign === currentCampaign.get() ? 'active' : '';
        }
        return campaign === currentContestGroup.get() ? 'active' : '';
    }
});
