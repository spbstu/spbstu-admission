Template.Group.helpers({
    persons: function() {
        var controller = Iron.controller(),
            params = controller.getParams();

        // Todo: Перевести на настройки из SiteSettings
        //return Abiturients.find({ groupId: params.groupId }, {sort: { order: 1 }});
        return Ratings.find({
            groupId: params.groupId.toString(), contestType: contestGroupMap.get(currentContestGroup.get()).toString()
        }, {sort: { priority: 1, name: 1 }})
            .map(function(item, index) {
                item.index1 = index + 1;

                return item;
            });
    },

    group: function() {
        var controller = Iron.controller(),
            params = controller.getParams();

        return Groups.findOne({groupId: params.groupId});
    },

    sum: function() {
        var args = Array.prototype.slice.apply(arguments);

        return args.reduce(function(acc, val) {
            val = Number(val) || 0;
            return acc + val;
        }, 0);
    },

    docType: function(docTypeId) {
        switch (docTypeId) {
            case "1":
                return "Оригинал";
            case "0":
                return "Копия";
        }
    },

    showPriority: function() {
        return currentContestGroup.get() === 'Общий конкурс';
    }
});
