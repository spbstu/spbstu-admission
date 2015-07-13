Template.MainLayout.events({
    'click .campany-selector a': function(event) {
        var $elem = $(event.target);

        event.preventDefault();

        $('.campany-selector')
            .find('li')
            .removeClass('active');
        $elem
            .closest('li')
            .addClass('active');

        Router.go('statistic', {campaignName: $elem.data('val')});
    }
});
