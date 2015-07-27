campaigns = new ReactiveVar(['Основной прием', 'Колледж', 'Крым']);
contestGroups = new ReactiveVar(['Общий конкурс', 'Без вступительных испытатаний', 'Особое право', 'Целевой приём']);

currentCampaign = new ReactiveVar('Основной прием', function(oldVal, newVal) {
    return ! newVal || oldVal === newVal;
});

currentContestGroup = new ReactiveVar('Общий конкурс', function(oldVal, newVal) {
    return ! newVal || oldVal === newVal;
});

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
        return this.currentValue.get() !== this._initialValue;
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
        new Filter('educationForm', 'Форма обучения', ['очная', 'заочная', 'очно-заочная']),
        new Filter('paymentForm', 'Финансирование', ['бюджет', 'контракт']),
        new Filter('program', 'Программа', ['академический бакалавриат', 'магистратура', 'специалитет', 'аспирантура']),
        new Filter('educationBaseLevel', 'Базовое образование', ['среднее общее', 'среднее профессиональное', 'высшее'])
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
