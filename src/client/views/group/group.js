Template.Group.helpers({
    persons: function() {
        var controller = Iron.controller();
        var params = controller.getParams();

        var contestGroupId = contestGroupMap.get(currentContestGroup.get()).toString()
        var group = Groups.findOne({groupId: params.groupId})
        if(group.viewRating === '1') {
            return Ratings.find({ groupId: params.groupId, category: contestGroupId, rating: {$exists: true}}, {sort: { rating: 1 }});
        } else {
            return Abiturients.find({ groupId: params.groupId, category: contestGroupId}, {sort: { order: 1 }});
        }
    },
    
    group: function() {
        var controller = Iron.controller(),
            params = controller.getParams();

        return Groups.findOne({groupId: params.groupId, });
    },
    
    showRatingOrExam: function(group) {
        return group.viewRating === '1' || group.status === '2'
    },
    
    phd: function() {
        return currentCampaign.get() === 'Аспирантура'
    },
    
    showDescText: function(group) {
        return group.viewRating === '1' && group.descText !== '' &&
            currentContestGroup.get() === 'Общий конкурс' &&
            (currentCampaign.get() === 'Основной прием' || currentCampaign.get() === 'Крым')
    }
});
