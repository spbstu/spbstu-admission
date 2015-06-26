Template.BackstageUpload.events({
    'change #groups': function(event) {
        var input = event.target,
            file = event.target.files[0];

        if (! file) {
            return;
        }

        var result = Papa.parse(file, {
            skipEmptyLines: true,
            complete: function(result) {
                var data = result.data
                    .slice(1)
                    .map(function(item) {
                        return {
                            faculty: item[0],           // Факультет
                            title: item[1],             // Название группы
                            groupId: item[2],           // UID группы
                            educationForm: item[3],     // Форма обучения
                            programm: item[4],          // Программа
                            paymentForm: item[5],       // Бюджет/контракт
                            educationLevel: item[6],    // Базовое образование
                            admissionLevel: item[7],    // Приёмная кампания
                            exams: item[8]              // Экзамены
                        }
                    });

                if (result.errors.length === 0) {
                    // TODO: Обработка ошибок. Наверно что-то типа промисов
                    data.forEach(function(item) {
                        Groups.insert(item);
                    });
                }
            }
        });
    },

    'change #counters': function(event) {
        var input = event.target,
            file = event.target.files[0];

        if (! file) {
            return;
        }

        var result = Papa.parse(file, {
            skipEmptyLines: true,
            complete: function(result) {
                var data = result.data
                    .slice(1)
                    .map(function(item) {
                        return {
                            groupId: item[0],               // UID группы
                            planned: item[2],               // План
                            applicationsCount: item[3],     // Подано заявления
                            docsCount: item[4]              // Подано документов
                        }
                    });

                if (result.errors.length === 0) {
                    // TODO: Обработка ошибок. Наверно что-то типа промисов
                    data.forEach(function(item) {
                        var doc = Groups.findOne({
                            groupId: item.groupId
                        });

                        Groups.update({
                            _id: doc._id
                        }, {
                            $set: {
                                planned: item.planned,
                                applicationsCount: item.applicationsCount,
                                docsCount: item.docsCount
                            }
                        }, function(err, affected) {
                            if (err) {
                                console.log(err);
                            }
                        });
                    });
                } else {
                    console.log(result.errors);
                }
            }
        });
    }
});
