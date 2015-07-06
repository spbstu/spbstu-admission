Session.setDefault('groupsQuery', {});

Template.Statistic.helpers({
    rows: function() {
        var filter = Session.get('groupsQuery'),
            groups = Groups.find(filter),
            prevFaculty = '';

        return groups.map(function(row) {
            var result = row;

            if (row.faculty !== prevFaculty) {
                prevFaculty = row.faculty;
                result.isFirst = true;
            } else {
                result.faculty = '';
            }

            return result;
        });
    }
});

Template.Statistic.events({
    'click .data-row': function(e) {
        var groupId = e.currentTarget.dataset['groupid'];

        Router.go('group', {groupId: groupId});
        return false;
    }
});
