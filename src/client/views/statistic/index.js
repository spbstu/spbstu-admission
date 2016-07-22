function getContestGroupFilter() {
    var contestGroupId = contestGroupMap.get(currentContestGroup.get()),
        filter = {};

    filter['count' + contestGroupId] = {$gt: 0};

    return filter;
}

showRatings = function() {
    var settings = SiteSettings.findOne({'showRatings': {$exists: true}});
    return settings && settings.showRatings
}

getGroups = function() {
    var controller = Iron.controller()
    
    var filter = _.extend(groupFilter.get(), {admissionLevel: currentCampaign.get()})
    var groupsParams = {sort: {faculty: 1, title: 1, planned: -1, applicationsCount: -1, docsCount: -1}}
    var faculties = _.uniq(Groups.find({}, {
        sort: {
            faculty: 1
        },
        fields: {
            faculty: true
        }
    })
        .fetch()
        .map(function(item) {
            return item.faculty;
        }), true)
        .map(function(item) {
            return {
                faculty: item,
                groups: []
            }
        })
    var groups = Groups.find(filter, groupsParams).fetch();

    _.chain(groups)
        .map(function(item) {
            item.isActive = item.applicationsCount > 0 && currentCampaign.get() !== 'Колледж';
            return item;
        })
        .groupBy(function(item) {
            return item.faculty;
        })
        .forEach(function(val, key) {
            var faculty = _.find(faculties, function(item) {
                return item.faculty === key;
            });

            if (faculty) {
                faculty.groups = faculty.groups.concat(val);
            }
        });
    
    return _.filter(faculties, f => f.groups.length > 0);
};

Template.Statistic.helpers({
    rows: function() {
        return getGroups();
    },
    showRatings: showRatings,
    expandIfOnlyOneGroup: function(groups) {
        return groups.length === 1 ? 'active' : '';
    },
    mainCAmpaign: function() {
        var campaign = currentCampaign.get()
        return camapign === 'Основная кампания' || campaign === 'Крым'
    },
    mainCampaign: function() {
        var campaign = currentCampaign.get()
        return campaign === 'Основной прием' || campaign === 'Крым'
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
