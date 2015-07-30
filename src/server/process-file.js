function updateUploadProgress(collection, value) {
    uploadStatus.update({name: collection}, {$set: {name: collection, value: value}}, {upsert: true});
}

function startUploadProgress(collection) {
    updateUploadProgress(collection, 'Обработка началась');
}

function finishUploadProgress(collection) {
    updateUploadProgress(collection, 'Обработка завершена');

    Meteor.setTimeout(function() {
        clearUploadProgress(collection);
    }, 3000);
}

function clearUploadProgress(collection) {
    updateUploadProgress(collection, false);
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
            case 'ratingGroupsFiles':
                processRatingGroups(data);
                break;
            case 'countersFiles':
                processCounters(data);
                break;
            case 'abiturientsFiles':
                processAbiturients(data);
                break;
            case 'ratingFiles':
                processRating(data);
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
        startUploadProgress('groups');

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

        finishUploadProgress('groups');
    } else {
        console.log('Errors caused', result.errors);
    }
}

function processRatingGroups(data) {
    var result = Papa.parse(data, {
            skipEmptyLines: true
        }),
        skipLines = 0,
        count = result.data.length - skipLines;

    if (result.errors.length === 0) {
        Groups.remove({});
        startUploadProgress('groups');

        result.data
            .slice(skipLines)
            .map(function (item) {
                return {
                    faculty: item[ 3 ],                     // Факультет
                    facultyAbbr: item[ 2 ],                 // Факультет сокращенно
                    title: item[ 4 ],                       // Название группы
                    groupId: item[ 0 ],                     // UID группы
                    educationForm: item[ 5 ],               // Форма обучения
                    program: item[ 7 ],                     // Программа
                    paymentForm: item[ 6 ],                 // Бюджет/контракт
                    educationLevel: item[ 1 ],              // Уровень образования
                    educationBaseLevel: item[ 8 ],          // Базовое образование
                    exam1: item[ 9 ],                       // Экзамен 1
                    exam2: item[ 10 ],                      // Экзамен 2
                    exam3: item[ 11 ],                      // Экзамен 3
                    examExtra: item[ 12 ]                   // Доп достижения
                }
            })
            .forEach(function (item, index) {
                Groups.insert(item);
                var progress = Math.floor((index / count) * 100);

                updateUploadProgress('groups', progress);
            });

        finishUploadProgress('groups');
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

    startUploadProgress('counters');

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

        finishUploadProgress('counters');
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

    startUploadProgress('abiturients');

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

        finishUploadProgress('abiturients');
    } else {
        console.log(result.errors);
    }
}

function processRating(data) {
    var result = Papa.parse(data, {
            skipEmptyLines: true
        }),
        skipLines = 0,
        l = 0,
        count = result.data.length - skipLines;

    startUploadProgress('ratings');

    if (result.errors.length === 0) {
        Ratings.remove({});

        result.data.forEach(function(item, index) {
            var progress = Math.floor((index / count) * 50);

            switch (item.length) {
                case 1:
                    updateSiteSettings('lastUpdate', item[0]);
                    break;
                case 3:
                    updateRatingScore(item);
                    break;
                default:
                    updateRating(item);
                    break;
            }

            updateUploadProgress('ratings', progress);
        });

        updateGroupRatingInfo();

        finishUploadProgress('ratings');
    } else {
        console.log(result.errors);
    }
}

function updateSiteSettings(key, value) {
    var doc = {},
        lookup = {'lastUpdate': {$exists: true}};

    doc[key] = value;

    SiteSettings.update(lookup, {$set: doc}, {upsert: true});
}

function updateRatingScore(dataList) {
    var doc = {
        limit: dataList[1],
        semiLimit: dataList[2]
    };

    Groups.update({groupId: dataList[0]}, {$set: doc});
}

function updateRating(dataList) {
    var doc = {
        groupId: dataList[0],
        rating: dataList[1],
        name: dataList[2],
        gender: dataList[3],
        birthDate: dataList[4],
        priority: dataList[5],
        documentType: dataList[6],
        contestType: dataList[7],
        score1: dataList[8],
        score2: dataList[9],
        score3: dataList[10],
        additionalScore: dataList[11],
        recommendationType: dataList[12],
        customerName: dataList[13]
    };

    Ratings.insert(doc);
}

function updateGroupRatingInfo() {
    var count;

    Groups.find({}).forEach(function(group, index, collection) {
        var count1 = Ratings.find({groupId: group.groupId, contestType: "1"}).count(),
            count2 = Ratings.find({groupId: group.groupId, contestType: "2"}).count(),
            count3 = Ratings.find({groupId: group.groupId, contestType: "3"}).count(),
            count4 = Ratings.find({groupId: group.groupId, contestType: "4"}).count(),
            count = count || collection.count(),
            progress = 50 + Math.floor((index / count) * 50);

        Groups.update({_id: group._id}, {$set: {
            count1: count1,
            count2: count2,
            count3: count3,
            count4: count4
        }});

        updateUploadProgress('ratings', progress);
    });
}

GroupsFiles.on('stored', Meteor.bindEnvironment(storedHandlerFactory('groupsFiles')));
RatingGroupsFiles.on('stored', Meteor.bindEnvironment(storedHandlerFactory('ratingGroupsFiles')));
CountersFiles.on('stored', Meteor.bindEnvironment(storedHandlerFactory('countersFiles')));
AbiturientsFiles.on('stored', Meteor.bindEnvironment(storedHandlerFactory('abiturientsFiles')));
RatingFiles.on('stored', Meteor.bindEnvironment(storedHandlerFactory('ratingFiles')));
