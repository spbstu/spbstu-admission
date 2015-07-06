function storedHandlerFactory(collectionName) {
    /**
     * Приходится нафигачить фабрику, потому что FS.Collection файрит событие 'stored' на все коллекции
     * и просто `storedHandler` вызывался трижды
     */

    return function(fileObj, storeName) {
        if (fileObj.collectionName !== collectionName) {
            return;
        }

        storedHandler.apply(this, arguments);
    }
}


function storedHandler(fileObj, storeName) {
    var readStream = fileObj.createReadStream('data'),
        data = '';

    readStream.on('data', Meteor.bindEnvironment(function (chunk) {
        data += iconv.fromEncoding(chunk, 'cp1251');
    }));

    readStream.on('end', Meteor.bindEnvironment(function () {
        switch (storeName) {
            case 'groupsFiles':
                processGroups(data);
                break;
            case 'countersFiles':
                processCounters(data);
                break;
            case 'abiturientsFiles':
                processAbiturients(data);
                break;
        }
    }));
}

function processGroups(data) {
    Papa.parse(data, {
        skipEmptyLines: true,
        delimiter: ";",
        encoding: "",
        complete: function (result) {
            var dataArr = result.data
                .slice(1)
                .map(function (item) {
                    return {
                        faculty: item[ 0 ],           // Факультет
                        title: item[ 1 ],             // Название группы
                        groupId: item[ 2 ],           // UID группы
                        educationForm: item[ 3 ],     // Форма обучения
                        // Todo: Переимевать
                        programm: item[ 4 ],          // Программа
                        paymentForm: item[ 5 ],       // Бюджет/контракт
                        educationLevel: item[ 6 ],    // Базовое образование
                        admissionLevel: item[ 7 ],    // Приёмная кампания
                        exams: item[ 8 ]              // Экзамены
                    }
                });

            if (result.errors.length === 0) {
                dataArr.forEach(function (item) {
                    Groups.insert(item);
                });
            } else {
                console.log('Errors caused', result.errors);
            }
        }
    })
}

function processCounters(data) {
    Papa.parse(data, {
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
                    Groups.update({
                        groupId: item.groupId
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

function processAbiturients(data) {
    Papa.parse(data, {
        skipEmptyLines: true,
        complete: function(result) {
            var data = result.data
                .slice(1)
                .map(function(item) {
                    return {
                        groupId: item[2],                // UID группы
                        contestForm: item[4],            // Форма конкурса
                        lastName: item[5],               // Фамилия
                        firstName: item[6],              // Имя
                        patronimusName: item[7],         // Отчество
                        abiturientUid: item[8],          // UID абитуриента
                        priority: item[11],              // Приоритет
                        documentType: item[12],          // Тип документа
                        totalScore: item[13],            // Общий балл
                        personalScore: item[14],         // Балл за индивидуальные достижения
                        subjects: item[15],              // Предметы
                        category: item[16]               // Категория поступления
                    }
                });

            if (result.errors.length === 0) {
                // TODO: Обработка ошибок. Наверно что-то типа промисов

                data.forEach(function(item) {
                    Abiturients.update({
                        abiturientUid: item.abiturientUid
                    }, {
                        $set: item
                    }, {
                        upsert: true

                    })
                });
            } else {
                console.log(result.errors);
            }
        }
    });
}

GroupsFiles.on('stored', Meteor.bindEnvironment(storedHandlerFactory('groupsFiles')));
CountersFiles.on('stored', Meteor.bindEnvironment(storedHandlerFactory('countersFiles')));
AbiturientsFiles.on('stored', Meteor.bindEnvironment(storedHandlerFactory('abiturientsFiles')));
