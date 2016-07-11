function sum() {
    var args = Array.prototype.slice.apply(arguments);

    return args.reduce(function(acc, val) {
        val = Number(val) || 0;
        return acc + val;
    }, 0);
}

showRatings = function() {
    var settings = SiteSettings.findOne({'showRatings': {$exists: true}});
    return settings && settings.showRatings
}

Template.Group.helpers({
    persons: function() {
        var controller = Iron.controller();
        var params = controller.getParams();

        var contestGroupId = contestGroupMap.get(currentContestGroup.get()).toString()

        return Abiturients.find({ groupId: params.groupId, category: contestGroupId}, {sort: { order: 1 }});
    },
    personExamWarn: function(examType) {
        if(examType === 'Без в/и (диплом не подтвержден ФИС)') {
            return 'warn z-depth-1 red darken-4'
        }
    },

    showRatings: showRatings,
    
    group: function() {
        var controller = Iron.controller(),
            params = controller.getParams();

        return Groups.findOne({groupId: params.groupId, });
    },

    examName: function(group, number) {
        return group.exams[number - 1]
    },

    examCount: function(group) {
        return group.exams.length
    },

    showExam: function(group, number) {
        return group.exams[number - 1]
    },

    examScore: function(person, number) {
        return person.exams[number - 1].score
    },

    showPriority: function() {
        return currentContestGroup.get() === 'Колледж';
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

    recommendation: function(recommendationType, gender) {
        switch (recommendationType) {
            case '0':
                return '';
                break;
            case '1':
                return 'да';
                break;
            case '2':
                return 'да, полупроходной балл';
                break;
            case '3':
                return 'проходит по более высокому приоритету';
                break;
            case '4':
                if (gender === 'ж') {
                    return 'зачислена по более низкому приоритету';
                } else {
                    return 'зачислен по более низкому приоритету';
                }
                break;
            case '5':
                return '';
                break;
            case '6':
                return 'отказ от зачисления';
                break;
        }
    },
    
    phd: function() {
        return currentCampaign.get() === 'Аспирантура'
    }
});
