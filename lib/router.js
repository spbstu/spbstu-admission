Router.plugin('ensureSignedIn', {
    only: ['backstage', 'backstage/upload']
});

Router.configure({
    layoutTemplate: 'MainLayout'
});

Router.map(function() {
    this.route('/', function() {
        this.redirect('/campaign');
    });

    /* TODO: Отрефакторить имя роута и шаблоны */
    this.route('campaign', {
        name: 'statistic',
        path: '/campaign/:campaignName?',
        onRun: function() {
            $('body').removeClass('inner-page');
            this.next();
        },
        onRerun: function() {
            $('body').removeClass('inner-page');
            this.next();
        },
        waitOn: function() {
            return Meteor.subscribe('allGroups');
        }
    });

    this.route('group', {
        name: 'group',
        path: '/group/:groupId',
        onBeforeAction: function() {
            $('body').addClass('inner-page');
            this.next();
        },
        waitOn: function() {
            return [
                Meteor.subscribe('abiturients', this.params.groupId),
                Meteor.subscribe('groupInfo', this.params.groupId)
                ];
        }
    });

    this.route('backstageUpload', {
        path: '/backstage/upload',
        onBeforeAction: function() {
            $('body').addClass('inner-page');
            this.next();
        }
    })
});

Router.onBeforeAction('loading');
