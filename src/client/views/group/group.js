function sum() {
    var args = Array.prototype.slice.apply(arguments);

    return args.reduce(function(acc, val) {
        val = Number(val) || 0;
        return acc + val;
    }, 0);
}

Template.Group.helpers({
    persons: function() {
        var controller = Iron.controller(),
            params = controller.getParams();

        // Todo: Перевести на настройки из SiteSettings
        //return Abiturients.find({ groupId: params.groupId }, {sort: { order: 1 }});
        return Ratings.find({
            groupId: params.groupId.toString(), contestType: contestGroupMap.get(currentContestGroup.get()).toString()
        })
            .map(function(item, index) {
                item.index1 = index + 1;
                item.totalScore = sum(item.score1, item.score2, item.score3, item.additionalScore);

                return item;
            }.bind(this))
            .sort(function(a, b) {
                return b.totalScore - a.totalScore;
            });
    },

    group: function() {
        var controller = Iron.controller(),
            params = controller.getParams();

        return Groups.findOne({groupId: params.groupId});
    },

    examCount: function(group) {
        if (group.exam2 !== "") {
            if (group.exam3 !== "") {
                return 3;
            } else {
                return 2;
            }
        } else {
            return 1
        }
    },

    showExam2: function(group) {
        return group.exam2 !== "";
    },

    showExam3: function(group) {
        return group.exam3 !== "";
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
    },

    showRecommendation: function(group) {
        var exceptGroups = [520, 521];

        return group.paymentForm.toLowerCase() == 'бюджет'
            || exceptGroups.indexOf(Number(group.groupId)) !== -1
            || Date.now() > new Date(2015, 7, 30); // Todo: Replace with SiteSettings property
    },

    showSemiLimit: function(group) {
        return group.semiLimit > 0;
    },

    recommendation: function(recommendationType) {
        switch (recommendationType) {
            case '0':
                return '';
                break;
            case '1':
                return 'попадает в процент зачисления по проходному баллу';
                break;
            case '2':
                return 'попадает в процент зачисления по полупроходному баллу';
                break;
            case '3':
                return 'рекомендован по более высокому приоритету';
                break;
            case '4':
                return 'зачислен в первой волне';
                break;
            case '5':
                return 'попадает в процент зачисления по проходному баллу и попадает в список по более высокому приоритету'
                break;
            case '6':
                return 'попадает в процент зачисления по полупроходному баллу и попадает в список по более высокому приоритету'
                break;
            case '7':
                return 'отказ от участия в конкурсе';
                break;
        }
    }
});
