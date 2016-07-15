Template.RatingMainCampaignGroup.helpers({
    personExamWarn: function(examType) {
        if(examType === 'Без в/и (диплом не подтвержден ФИС)') {
            return 'warn z-depth-1 red darken-4'
        }
    },
    
    showPriority: function() {
        return currentContestGroup.get() === 'Колледж';
    },
    
    group: function() {
        var controller = Iron.controller(),
            params = controller.getParams();

        return Groups.findOne({groupId: params.groupId, });
    },

    examName: function(group, number) {
        return group.exams[number - 1]
    },

    examCount: function(group, add = 0) {
        return group.exams.length + add
    },

    showExam: function(group, number) {
        return group.exams[number - 1]
    },

    examScore: function(person, number) {
        var status = person.exams[number - 1].status
        if(status === '1') {
            return 'ошибка'
        }
        return person.exams[number - 1].score
    },
    
    examClass: function(person, number) {
        var status = person.exams[number - 1].status
        if(status === '1') {
            return 'red darken-4 z-depth-1 warn'
        }
    },

    haveExams: function(examType) {
        return examType !== 'без в/и' && examType !== 'Без в/и (диплом не подтвержден ФИС)'
    },

    showRecommendation: function(group) {
        /*var exceptGroups = [520, 521];

        return group.paymentForm.toLowerCase() == 'бюджет'
            || exceptGroups.indexOf(Number(group.groupId)) !== -1
            || Date.now() > new Date(2016, 7, 30); // Todo: Replace with SiteSettings property*/
        return false
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

});
