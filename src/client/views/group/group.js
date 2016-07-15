Template.Group.helpers({
    persons: function() {
        var controller = Iron.controller();
        var params = controller.getParams();

        var contestGroupId = contestGroupMap.get(currentContestGroup.get()).toString()

        return Abiturients.find({ groupId: params.groupId, category: contestGroupId}, {sort: { order: 1 }});
    },
    
    group: function() {
        var controller = Iron.controller(),
            params = controller.getParams();

        return Groups.findOne({groupId: params.groupId, });
    },
    
    showRatings: function(group) {
        return group.status === '2'
    },
    
    phd: function() {
        return currentCampaign.get() === 'Аспирантура'
    }
});
