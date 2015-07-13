campaigns = new ReactiveVar(['Основной прием', 'Колледж', 'Крым']);
currentCampaign = new ReactiveVar('Основной прием', function(oldVal, newVal) {
    return ! newVal || oldVal === newVal;
});
