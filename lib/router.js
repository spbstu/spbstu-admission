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
        name: 'statistic',
        path: '/'
    });

    this.route('group', {
        name: 'group',
        path: '/group/:groupId'
    });

    this.route('backstageUpload', {
        path: '/backstage/upload'
    })
});

Router.onBeforeAction('loading');
