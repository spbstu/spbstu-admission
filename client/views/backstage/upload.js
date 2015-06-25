Template.BackstageUpload.events({
    'change #input': function(event) {
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
                    Groups.insert(data, function(err, id) {
                        var $input = $(input);

                        if (! err) {
                            $input.replaceWith($input.val('').clone(true));
                        }
                    })
                }
            }
        });
    }
});
