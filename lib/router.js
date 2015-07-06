Router.plugin('ensureSignedIn', {
    only: ['backstage', 'backstage/upload']
});

Router.configure({
    layoutTemplate: 'MainLayout'
});

Router.map(function() {
    this.route('index', {
        name: 'statistic',
        path: '/',
        waitOn: function() {
            return Meteor.subscribe('allGroups');
        }
    });

    this.route('group', {
        name: 'group',
        path: '/group/:groupId',
        waitOn: function() {
            return Meteor.subscribe('abiturients', this.params.groupId);
        }
    });

    this.route('backstageUpload', {
        path: '/backstage/upload'
    })
});

Router.onBeforeAction('loading');
