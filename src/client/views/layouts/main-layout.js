Template.MainLayout.helpers({
    lastUpdate: function() {
        return SiteSettings.findOne({'lastUpdate': {$exists: true}})['lastUpdate'];
    }
});