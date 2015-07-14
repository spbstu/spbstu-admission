Template.Campaigns.helpers({
    campaigns: function() {
        return campaigns.get();
    },

    activeClassName: function(campaign) {
        return campaign === currentCampaign.get() ? 'active' : '';
    }
});
