Router.plugin('ensureSignedIn', {
    only: ['backstage', 'backstage/upload']
});

Router.configure({
    layoutTemplate: 'MainLayout',
    loadingTemplate: 'Loading',
    waitOn: function() {
        return [
            Meteor.subscribe('siteSettings')
        ];
    }
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
        onBeforeAction: function() {
            currentCampaign.set(this.params.campaignName);
            titleFilter.set('campaigns')
            groupFilter.reset();
            this.next();
        },
        waitOn: function() {
            return [
                Meteor.subscribe('allGroups')
                ]
        }
    });

    this.route('group', {
        name: 'group',
        path: '/group/:groupId/:contestGroup?',
        onBeforeAction: function() {
            $('body').addClass('inner-page');
            if(this.params.contestGroup) {
                currentContestGroup.set(this.params.contestGroup);
            } else {
                currentContestGroup.set('Общий конкурс');
            }
            titleFilter.set('contestGroups')
            this.next();
        },
        waitOn: function() {
            return [
                Meteor.subscribe('groupInfo', this.params.groupId),
                Meteor.subscribe('abiturients', this.params.groupId),
                Meteor.subscribe('ratings', this.params.groupId)
                ];
        }
    });

    this.route('backstageUpload', {
        path: '/backstage/upload',
        onBeforeAction: function() {
            $('body').addClass('inner-page');
            this.next();
        },
        waitOn: function() {
            return [
                Meteor.subscribe('uploadStatus')
            ]
        }
    })
});

Router.onBeforeAction('loading');
