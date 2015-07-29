Template.Campaigns.helpers({
    campaigns: function() {
        var show = SiteSettings.findOne({'showContestGroups': {$exists: true}});

        if (show !== undefined && show['showContestGroups'] === false) {
            return [];
        } else {
            return contestGroups.get();
        }
        //return campaigns.get();
    },

    activeClassName: function(campaign) {
        //return campaign === currentCampaign.get() ? 'active' : '';
        return campaign === currentContestGroup.get() ? 'active' : '';
    }
});
