Template.RatingPhdGroup.helpers({
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
        return examType !== 'без в/и' 
        //&& examType !== 'без в/и*'
    },
    
    showRating: function(group) {
        return group.viewRating === '1' 
    },
});
