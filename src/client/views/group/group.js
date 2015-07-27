Template.Group.helpers({
    persons: function() {
        var controller = Iron.controller(),
            params = controller.getParams();

        // Todo: Перевести на настройки из SiteSettings
        //return Abiturients.find({ groupId: params.groupId }, {sort: { order: 1 }});
        return Ratings.find({
            groupId: params.groupId.toString(), contestType: contestGroupMap.get(currentContestGroup.get()).toString()
        }, {sort: { order: 1 }});
    },

    group: function() {
        var controller = Iron.controller(),
            params = controller.getParams();

        return Groups.findOne({groupId: params.groupId});
    }
});
