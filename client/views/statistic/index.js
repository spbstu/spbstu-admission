Session.setDefault('groupsQuery', {});
Session.setDefault('campanyQuery', 'Основной прием');

getGroups = function() {
    var controller = Iron.controller(),
        params = controller.getParams(),
        filter = _.extend(groupFilter.get(), {admissionLevel: (params.campaignName || 'Основной прием')}),
        groupsParams = {sort: {faculty: 1, title: 1, planned: -1, applicationsCount: -1, docsCount: -1}},
        groups = Groups.find(filter, groupsParams).fetch();

    return _.chain(groups)
        .map(function(item) {
            item.isActive = item.applicationsCount > 0;

            return item;
        })
        .groupBy(function(item) {
            return item.faculty;
        })
        .reduce(function(memo, val, key) {
            memo.push({
                faculty: key,
                groups: val
            });

            return memo;
        }, [])
        .value();
};

Template.Statistic.helpers({
    rows: function() {
        return getGroups();
    }
});

Template.Statistic.events({
    'click .data-row_active': function() {
        Router.go('group', {groupId: this.groupId});
        return false;
    }
});

Template.Statistic.rendered = function() {
    this.autorun(_.bind(function() {
        getGroups(this.data);

        Deps.afterFlush(function() {
            $('.collapsible').collapsible({});
        });
    }, this));
};
