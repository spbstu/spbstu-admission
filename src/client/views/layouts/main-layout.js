Template.MainLayout.helpers({
    lastUpdate: function() {
        var settings = SiteSettings.findOne({'lastUpdate': {$exists: true}});

        return settings && settings['lastUpdate'];
    },
    
    showCampaigns: function() {
        return titleFilter.get() === 'campaigns'
    },

    year: function () {
        return new Date().getFullYear();
    }
});