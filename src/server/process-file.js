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
        case 'abiturientsFiles':
            startUploadProgress('abiturients');
            break;
        case 'ratingsFiles':
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
            case 'abiturientsFiles':
                processAbiturients(data);
                break;
            case 'ratingsFiles':
                processRatings(data);
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
                    exams: parseExams(item[8]),
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

function parseExams(examsIdsStr) {
    const exams = {
        '1': 'Математика',
        '2': 'Физика',
        '3': 'История',
        '4': 'Русский язык',
        '5': 'Обществознание',
        '6': 'Информатика',
        '7': 'Рисунок, живопись и композиция',
        '8': 'Иностранный язык',
        '9': 'Химия',
        '10': 'Литература',
        '11': 'Биология',
        '12': 'Междисциплинарный экзамен',
        '13': 'Собеседование',
        '14': 'Средний балл аттестата',
        '15': 'Технология машиностроения',
        '16': 'Основы алгоритмизации',
        '17': 'Философия',
        '18': 'Специальная дисциплина',
        '19': 'Немецкий язык',
        '20': 'Французский язык',
        '21': 'Испанский язык',
        '22': 'Английский язык',
        '23': 'Математика базовая'
    }
    return examsIdsStr.split(',').map(x => exams[x.trim()])
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
            '3': 'ЕГЭ',
            '4': 'Без в/и (диплом не подтвержден ФИС)'
        }
        const documentType = {
            '1': 'Оригинал',
            '0': 'Копия'
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
                    totalScore: item[ 9 ] === '0' ? '' : item[ 9 ], // Общий балл
                    exams: [
                        {score: item[10], status: item[11]},
                        {score: item[12], status: item[13]},
                        {score: item[14], status: item[15]}
                    ],
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

function processRatings(data) {
    startProcessProgress('ratings');

    var result = Papa.parse(data, {
            delimiter: '|',
            skipEmptyLines: true
        })
    var skipLines = 1
    var count = result.data.length - skipLines


    if (result.errors.length === 0) {
        // TODO: Обработка ошибок. Наверно что-то типа промисов
        result.data
            .slice(skipLines)
            .map(function (item) {
                return {
                    groupId: item[ 0 ],                             // UID группы
                    order: parseInt(item[ 1 ]),                     // Номер по порядку внутри группы
                    category: item[ 2 ],                            // Категория поступления
                    fio: item[ 3 ],                                 // Фамилия Имя Отчество
                }
            })
            .forEach(function (item, index) {
                Abiturients.update({
                    groupId: item.groupId,
                    fio: item.fio
                }, {
                    $set: {rating: item.order}
                });
                var progress = Math.floor((index / count) * 100);
                updateProgressValue('ratings', progress);
            });

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

GroupsFiles.on('stored', Meteor.bindEnvironment(storedHandlerFactory('groupsFiles')));
AbiturientsFiles.on('stored', Meteor.bindEnvironment(storedHandlerFactory('abiturientsFiles')));
RatingsFiles.on('stored', Meteor.bindEnvironment(storedHandlerFactory('ratingsFiles')));
