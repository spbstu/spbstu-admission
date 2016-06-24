campaigns = new ReactiveVar(['Основной прием', 'Крым', 'Колледж', 'Аспирантура']);
contestGroups = new ReactiveVar(['Общий конкурс', 'Без вступительных испытатаний', 'Особое право', 'Целевой приём']);

currentCampaign = new ReactiveVar('Основной прием', function(oldVal, newVal) {
    return ! newVal || oldVal === newVal;
});

currentContestGroup = new ReactiveVar('Общий конкурс', function(oldVal, newVal) {
    return ! newVal || oldVal === newVal;
});

contestGroupMap = new ReactiveDict('Конкурсные группы');

contestGroupMap.set('Общий конкурс', 2);
contestGroupMap.set('Без вступительных испытатаний', 1);
contestGroupMap.set('Особое право', 3);
contestGroupMap.set('Целевой приём', 4);

function Filter(name, title, values, initial) {
    this._initialValue = initial || '';
    this._values = new ReactiveVar([{k: '', v: 'Все'}].concat(values.map(function(item) {return {k: item, v: item}})));
    this.currentValue = new ReactiveVar(this._initialValue);

    this.title = title;
    this.name = name;
    this.values = this._values.get();

    this.get = function() {
        var val = this.currentValue.get();

        return this._values
            .get()
            .filter(function(elem) {return elem.k === val})[0].v;
    };

    this.isChanged = function() {
        return this.currentValue.get() !== '';
    };

    this.set = function(newValue) {
        this.currentValue.set(newValue);
    };

    this.reset = function() {
        this.set(this._initialValue);
    }
}

groupFilter = {
    filters: [
        new Filter('educationForm', 'Форма обучения', ['Очная', 'Заочная', 'Очно-Заочная'], 'Очная'),
        new Filter('paymentForm', 'Финансирование', ['Бюджет', 'Контракт'], 'Бюджет'),
        new Filter('program', 'Программа', ['Бакалавриат/Специалитет', 'Магистратура', 'Среднее профессиональное образование', 'Аспирантура'], 'Бакалавриат/Специалитет'),
    ],

    reset: function() {
        this.filters.forEach(function(filter) {
            filter.reset();
        });
    },

    get: function() {
        return this.filters.reduce(function(acc, item) {
            if (item.isChanged()) {
                acc[ item.name ] = item.currentValue.get();
            }

            return acc;
        }, {});
    }
};
