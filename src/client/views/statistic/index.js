Session.setDefault('groupsQuery', {});
Session.setDefault('campanyQuery', 'Основной прием');

Template.Statistic.helpers({
    rows: function() {
        var filter = _.extend(Session.get('groupsQuery'), {admissionLevel: Session.get('campanyQuery')}),
            groups = Groups.find(filter, {sort: {faculty: 1, title: 1, planned: -1, applicationsCount: -1, docsCount: -1}}).fetch(),
            prevFaculty = '';

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
    }
});

Template.Statistic.events({
    'click .data-row_active': function(e) {
        var groupId = e.currentTarget.dataset['groupid'];

        Router.go('group', {groupId: groupId});
        return false;
    }
});

Template.Statistic.rendered = function() {
    $('.collapsible').collapsible({});
};
