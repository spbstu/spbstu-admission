campaigns = new ReactiveVar(['Основной прием', 'Колледж', 'Крым']);
currentCampaign = new ReactiveVar('Основной прием', function(oldVal, newVal) {
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
        new Filter('educationForm', 'Форма обучения', ['Очная', 'Заочная']),
        new Filter('paymentForm', 'Бюджет/контракт', ['Бюджет', 'Контракт']),
        new Filter('program', 'Программа', ['Академический бакалавриат', 'Магистратура', 'Специалитет', 'Аспирантура']),
        new Filter('educationLevel', 'Базовое образование', ['среднее общее', 'высшее', 'среднее профессиональное']),
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
