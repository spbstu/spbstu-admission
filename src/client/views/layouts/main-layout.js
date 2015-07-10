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

        Session.set('campanyQuery', $elem.data('val'));

        Router.go('statistic');
    }
});
