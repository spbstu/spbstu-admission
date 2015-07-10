Template.Group.helpers({
    persons: function() {
        var controller = Iron.controller(),
            params = controller.getParams();

        return Abiturients.find({ groupId: params.groupId }, {sort: { order: 1 }});
    },

    group: function() {
        var controller = Iron.controller(),
            params = controller.getParams();

        return Groups.findOne({groupId: params.groupId});
    }
});
