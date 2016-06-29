function updateProgressValue(collection, value) {
    uploadStatus.update({name: collection}, {$set: {name: collection, value: value}}, {upsert: true});
}

function startUploadProgress(collection) {
    updateProgressValue(collection, 'Загрузка завершена');
}

function startProcessProgress(collection) {
    updateProgressValue(collection, 'Обработка началась');
}

function finishUploadProgress(collection) {
    updateProgressValue(collection, 'Обработка завершена');
    
    Meteor.setTimeout(function() {
        clearUploadProgress(collection);
    }, 3000);
}

function failUploadProgress(collection) {
    updateProgressValue(collection, 'Ошибка обработки файла');

    Meteor.setTimeout(function() {
        clearUploadProgress(collection);
    }, 3000);
}

function clearUploadProgress(collection) {
    updateProgressValue(collection, false);
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

function updateTime(fileObj) {
    //PlgroupsList-2016-06-27-210124
    var re = /.*(\d\d\d\d-\d\d-\d\d-\d\d\d\d\d\d).*/i;
    var filename = fileObj.original.name
    var found = filename.match(re)
    var date = moment()
    if(found && found[1]) {
        date = moment(found[1], 'YYYY-MM-DD-HHmmss')
    }
    
    updateSiteSettings('lastUpdate', date.format('DD-MM-YYYY HH:mm'));
}

function storedHandler(fileObj, storeName) {
    updateTime(fileObj)
    var readStream = fileObj.createReadStream('data'),
        data = '';

    switch (fileObj.collectionName) {
        case 'groupsFiles':
            startUploadProgress('groups');
            break;
        case 'ratingGroupsFiles':
            startUploadProgress('groups');
            break;
        case 'abiturientsFiles':
            startUploadProgress('abiturients');
            break;
        case 'ratingFiles':
            startUploadProgress('ratings');
            break;
    }

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
    startProcessProgress('groups');

    var result = Papa.parse(data, {
            skipEmptyLines: true
        }),
        skipLines = 1,
        count = result.data.length - skipLines;

    if (result.errors.length === 0) {
        Groups.remove({})
        
        const faculty = {
            '1': 'Инженерно-строительный институт',
            '2': 'Институт энергетики и транспортных систем',
            '3': 'Институт металлургии, машиностроения и транспорта',
            '4': 'Институт физики, нанотехнологий и телекоммуникаций',
            '5': 'Институт компьютерных наук и технологий',
            '6': 'Институт прикладной математики и механики',
            '7': 'Институт промышленного менеджмента, экономики и торговли',
            '8': 'Гуманитарный институт',
            '9': 'Институт военно-технического образования и безопасности',
            '20': 'Высшая школа биотехнологий и пищевых технологий',
            '21': 'Институт передовых производственных технологий'
        }
        const educationForm = {
            '1': 'Очная',
            '2': 'Очно-Заочная',
            '3': 'Заочная'
        }
        const program = {
            '1': 'Бакалавриат/Специалитет',
            '2': 'Магистратура',
            '3': 'Среднее профессиональное образование',
            '4': 'Аспирантура'
        }
        const paymentForm = {
            '1': 'Бюджет',
            '2': 'Контракт'
        }
        const educationLevel = {
            '1': 'Академический бакалавриат',
            '2': 'Прикладной бакалавриат',
            '3': 'Специалитет',
            '4': 'Магистратура',
            '5': 'на базе 9 классов',
            '6': 'Аспирантура',
            '7': 'на базе 11 классов'
        }
        const admissionLevel = {
            '1': 'Основной прием',
            '2': 'Крым',
            '3': 'Колледж',
            '4': 'Аспирантура'
        }
        
        result.data
            .slice(skipLines)
            .map(function (item) {
                var fcl = faculty[item[1]] || admissionLevel[item[7]]
                if(!faculty) {}
                return {
                    // UID конкурсной группы
                    groupId: item[0],
                    // Институт, если не указан то исп. название приёмной кампании
                    faculty: fcl,
                    // Название группы
                    title: item[2],
                    // Форма обучения
                    educationForm: educationForm[item[3]],
                    // Программа
                    program: program[item[4]],
                    // Бюджет/контракт
                    paymentForm: paymentForm[item[5]],
                    // Базовое образование
                    educationLevel: educationLevel[item[6]],
                    // Приёмная кампания
                    admissionLevel: admissionLevel[item[7]],
                    // Экзамены
                    exams: item[8],
                    // План приема
                    planned: parseInt(item[9]),
                    // Количество заявлений
                    applicationsCount: parseInt(item[10]),
                    // Количество оригиналов
                    docsCount: parseInt(item[11]),
                    // Количество заявлений о согласии
                    agreementsCount: parseInt(item[12]),
                    // Проходной балл
                    limit: item[13],
                    // Полупроходной балл
                    semilimit: item[14],
                    // Разъяснительный текст отображается  перед списком людей в конкурсной группе
                    descText: item[15],
                    // Признак отображения в рейтинговом списке (???)
                    viewRating: item[16],
                    // Код направления
                    specCode: item[17],
                    // Название направления
                    specName: item[18],
                    // Идентификатор группы направлений
                    specGroupId: item[19],
                    // Количество оригиналов по первому приоритету (для аспирантуры и коллежда)
                    docsCountForFirst: parseInt(item[20]),
                    // Количество заявлений по первому приоритету (для аспирантуры и коллежда)
                    applicationsCountForFirst: parseInt(item[21]),
                    // Состояние списка подавших документы ( состояние1 или состояние2 - с баллами)
                    status: item[22]
                }
            })
            .forEach(function (item, index) {
                Groups.insert(item);
                var progress = Math.floor((index / count) * 100);

                updateProgressValue('groups', progress);
            });
            
        finishUploadProgress('groups');
    } else {
        failUploadProgress('groups');
        console.log('Errors caused', result.errors);
    }
}

function processRatingGroups(data) {
    startProcessProgress('groups');

    var result = Papa.parse(data, {
            skipEmptyLines: true
        }),
        skipLines = 0,
        count = result.data.length - skipLines;

    if (result.errors.length === 0) {
        Groups.remove({});

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

                updateProgressValue('groups', progress);
            });

        finishUploadProgress('groups');
    } else {
        failUploadProgress('groups');
        console.log('Errors caused', result.errors);
    }
}

function processAbiturients(data) {
    startProcessProgress('abiturients');

    var result = Papa.parse(data, {
            delimiter: '|',
            skipEmptyLines: true
        })
    var skipLines = 1
    var count = result.data.length - skipLines


    if (result.errors.length === 0) {
        // TODO: Обработка ошибок. Наверно что-то типа промисов
        const examType = {
            '1': 'без в/и',
            '2': 'в/и в СПбПУ',
            '3': 'ЕГЭ'
        }
        const documentType = {
            '0': 'Оригинал',
            '1': 'Копия'
        }
        
        Abiturients.remove({})
        result.data
            .slice(skipLines)
            .map(function (item) {
                return {
                    groupId: item[ 0 ],                             // UID группы
                    order: parseInt(item[ 1 ]),                     // Номер по порядку внутри группы
                    category: item[ 2 ],                            // Категория поступления
                    fio: item[ 3 ],                                 // Фамилия Имя Отчество
                    examType: examType[ item[ 4 ] ],                // сдает вступительные испытания
                    birthDate: item[ 5 ],                           // Дата рождения
                    documentType: documentType[ item[ 6 ] ],        // Тип документа (Оригинал/Копия)
                    agreement: item[ 7 ] === '1' ? 'Да' : 'Нет',    // Заявление о согласии
                    refuse: item[ 8 ] !== '0' ? 'отказ' : '',       // Отакз в приеме документов
                    totalScore: item[ 9 ],                          // Общий балл
                    exams: {
                        '1': {score: item[10], status: item[11]},
                        '2': {score: item[12], status: item[13]},
                        '3': {score: item[14], status: item[15]}
                    },
                    personalScore: item[ 16 ],         // Балл за индивидуальные достижения
                    hitPercent: item[ 17 ],            // Попадание в процент зачисления
                    priority: item[ 18 ],              // Приоритет
                    avgScore: item[ 19 ],              // Средний балл по профильному предмету
                }
            })
            .forEach(function (item, index) {
                Abiturients.insert(item);
                var progress = Math.floor((index / count) * 100);
                updateProgressValue('abiturients', progress);
            });

        finishUploadProgress('abiturients');
    } else {
        failUploadProgress('abiturients');
        console.log(result.errors);
    }
}

function processRating(data) {
    startProcessProgress('ratings');

    var result = Papa.parse(data, {
            skipEmptyLines: true
        }),
        skipLines = 0,
        l = 0,
        count = result.data.length - skipLines;


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

            updateProgressValue('ratings', progress);
        });

        updateGroupRatingInfo();

        finishUploadProgress('ratings');
    } else {
        failUploadProgress('ratings');
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

        updateProgressValue('ratings', progress);
    });
}

GroupsFiles.on('stored', Meteor.bindEnvironment(storedHandlerFactory('groupsFiles')));
RatingGroupsFiles.on('stored', Meteor.bindEnvironment(storedHandlerFactory('ratingGroupsFiles')));
AbiturientsFiles.on('stored', Meteor.bindEnvironment(storedHandlerFactory('abiturientsFiles')));
RatingFiles.on('stored', Meteor.bindEnvironment(storedHandlerFactory('ratingFiles')));
