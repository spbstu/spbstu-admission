function getContestGroupFilter() {
    var contestGroupId = contestGroupMap.get(currentContestGroup.get()),
        filter = {};

    filter['count' + contestGroupId] = {$gt: 0};

    return filter;
}

getGroups = function() {
    var controller = Iron.controller(),
        filter = _.extend(groupFilter.get(), getContestGroupFilter()),
        // Todo: Перевести на настройки из SiteSettings
        // filter = _.extend(groupFilter.get(), {admissionLevel: currentCampaign.get()}),
        groupsParams = {sort: {faculty: 1, title: 1, planned: -1, applicationsCount: -1, docsCount: -1}},
        groups = Groups.find(filter, groupsParams).fetch();

    console.log(contestGroupMap.get(currentContestGroup.get()));

    return _.chain(groups)
        .map(function(item) {
            // Todo: Перевести на настройки из SiteSettings
            //item.isActive = item.applicationsCount > 0;
            item.isActive = true;

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
    },
    showCounters: function() {
        // Todo: Перевести на настройки из бекстейджа
        return false;
    },
    pageTitle: function() {
        // return 'Статистика принятых заявлений'
        return 'Рейтинг абитуриентов';
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
