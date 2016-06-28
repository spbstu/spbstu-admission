Template.MainLayout.rendered = function() {
    $('.back-btn').on('click', function() {
          Router.go('/');
    });
};
