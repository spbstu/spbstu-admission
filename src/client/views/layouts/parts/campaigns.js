Template.Campaigns.helpers({
    campaigns: function() {
        return contestGroups.get();
        //return campaigns.get();
    },

    activeClassName: function(campaign) {
        //return campaign === currentCampaign.get() ? 'active' : '';
        return campaign === currentContestGroup.get() ? 'active' : '';
    }
});
