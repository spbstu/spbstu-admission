Router.plugin('ensureSignedIn', {
    only: ['backstage', 'backstage/upload']
});

Router.configure({
    layoutTemplate: 'MainLayout',
    waitOn: function() {
        return Meteor.subscribe('groups');
    }
});

Router.map(function() {
    this.route('index', {
        name: 'home',
        path: '/',
        controller: StatisticController
    });

    this.route('backstageUpload', {
        path: '/backstage/upload'
    })
});

Router.onBeforeAction('loading');
