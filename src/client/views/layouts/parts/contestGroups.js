

Template.ContestGroups.helpers({
    groups: function() {
        return contestGroups.get();
    },
    
    groupId: function() {
        var controller = Iron.controller();
        var params = controller.getParams();
        return params.groupId
    },

    activeClassName: function(group) {
        return group === currentContestGroup.get() ? 'active' : '';
    }
});
