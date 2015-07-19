function updateUploadProgress(collection, value) {
    value = value || 0;

    uploadStatus.update({name: collection}, {$set: {name: collection, value: value}}, {upsert: true});
}

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
        switch (fileObj.collectionName) {
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
    var result = Papa.parse(data, {
            skipEmptyLines: true
        }),
        skipLines = 1,
        count = result.data.length - skipLines;

    if (result.errors.length === 0) {
        updateUploadProgress('groups');

        result.data
            .slice(skipLines)
            .map(function (item) {
                return {
                    faculty: item[ 0 ],           // Факультет
                    title: item[ 1 ],             // Название группы
                    groupId: item[ 2 ],           // UID группы
                    educationForm: item[ 3 ],     // Форма обучения
                    program: item[ 4 ],           // Программа
                    paymentForm: item[ 5 ],       // Бюджет/контракт
                    educationLevel: item[ 6 ],    // Базовое образование
                    admissionLevel: item[ 7 ],    // Приёмная кампания
                    exams: item[ 8 ],             // Экзамены
                    limit: item[ 9 ],             // Проходной балл
                    semilimit: item[ 10 ]         // Полупроходной балл
                }
            })
            .forEach(function (item, index) {
                Groups.insert(item);
                var progress = Math.floor((index / count) * 100);

                updateUploadProgress('groups', progress);
            });

        updateUploadProgress('groups');
    } else {
        console.log('Errors caused', result.errors);
    }
}

function processCounters(data) {
    var result = Papa.parse(data, {
            skipEmptyLines: true
        }),
        skipLines = 1,
        count = result.data.length - skipLines;

    updateUploadProgress('counters');

    if (result.errors.length === 0) {
        // TODO: Обработка ошибок. Наверно что-то типа промисов
        result.data
            .slice(skipLines)
            .map(function (item) {
                return {
                    groupId: item[ 0 ],                         // UID группы
                    planned: parseInt(item[ 2 ], 10),           // План
                    applicationsCount: parseInt(item[ 3 ]),     // Подано заявления
                    docsCount: parseInt(item[ 4 ])              // Подано документов
                }
            })
            .forEach(function (item, index) {
                Groups.update({
                    groupId: item.groupId
                }, {
                    $set: item
                }, function (err, affected) {
                    if (err) {
                        console.log(err);
                    }
                });

                var progress = Math.floor((index / count) * 100);

                updateUploadProgress('counters', progress);
            });

        updateUploadProgress('counters');
    } else {
        console.log(result.errors);
    }
}

function processAbiturients(data) {
    var result = Papa.parse(data, {
            skipEmptyLines: true
        }),
        skipLines = 1,
        count = result.data.length - skipLines;

    updateUploadProgress('abiturients');

    if (result.errors.length === 0) {
        // TODO: Обработка ошибок. Наверно что-то типа промисов


        result.data
            .slice(skipLines)
            .map(function (item) {
                return {
                    order: parseInt(item[ 0 ]),        // Номер по порядку внутри группы
                    faculty: item[ 1 ],                // Факультет
                    groupId: item[ 2 ],                // UID группы
                    groupName: item[ 3 ],              // Название конкурсной группы
                    contestForm: item[ 4 ],            // Форма конкурса
                    lastName: item[ 5 ],               // Фамилия
                    firstName: item[ 6 ],              // Имя
                    patronimusName: item[ 7 ],         // Отчество
                    abiturientUid: item[ 8 ],          // UID абитуриента
                    gender: item[ 9 ],                 // Пол
                    birthDate: item[ 10 ],             // Дата рождения
                    priority: item[ 11 ],              // Приоритет
                    documentType: item[ 12 ],          // Тип документа
                    totalScore: item[ 13 ],            // Общий балл
                    personalScore: item[ 14 ],         // Балл за индивидуальные достижения
                    subjects: item[ 15 ],              // Предметы
                    category: item[ 16 ]               // Категория поступления
                }
            })
            .forEach(function (item, index) {
                Abiturients.update({
                    abiturientUid: item.abiturientUid
                }, {
                    $set: item
                }, {
                    upsert: true
                });

                var progress = Math.floor((index / count) * 100);

                updateUploadProgress('abiturients', progress);
            });

        updateUploadProgress('abiturients');
    } else {
        console.log(result.errors);
    }
}

GroupsFiles.on('stored', Meteor.bindEnvironment(storedHandlerFactory('groupsFiles')));
CountersFiles.on('stored', Meteor.bindEnvironment(storedHandlerFactory('countersFiles')));
AbiturientsFiles.on('stored', Meteor.bindEnvironment(storedHandlerFactory('abiturientsFiles')));
