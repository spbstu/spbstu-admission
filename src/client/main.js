Template.MainLayout.rendered = function() {
    $('select').material_select();
    $('.back-btn').on('click', function() {
          history.back();
    });
};
