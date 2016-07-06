Template.MainCampaignGroup.helpers({
    personExamWarn: function(examType) {
        if(examType === 'Без в/и (диплом не подтвержден ФИС)') {
            return 'warn z-depth-1 red darken-4'
        }
    },
});
