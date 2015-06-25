StatisticController = RouteController.extend({
    template: 'Statistic',
    groups: function() {
        var prevFaculty = '';

        return Groups.find({
            'educationForm': 'Очная',
            'paymentForm': 'Бюджет',
            'programm': 'Академический бакалавриат',
            'educationLevel': 'среднее общее'
        }).map(function(item) {
            var res = item;

            if (item.faculty === prevFaculty) {
                res.faculty = '';
            } else {
                prevFaculty = item.faculty;
            }

            return res;
        });
    },
    data: function() {
        var self = this;

        return {
            groups: self.groups()
        }
    }
});