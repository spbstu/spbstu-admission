Template.BackstageUpload.events({
    'change #groups': function(event, template) {
        var input = event.target,
            file = event.target.files[0];

        GroupsFiles.insert(file, function(err, fileObj) {
            if (err) {
                console.log('Upload error:', err);
            } else {
                template.find('.upload-form').reset();
            }
        });
    },

    'change #counters': function(event, template) {
        var input = event.target,
            file = event.target.files[0];

        CountersFiles.insert(file, function(err, fileObj) {
            if (err) {
                console.log('Upload error:', err);
            } else {
                template.find('.upload-form').reset();
            }
        });
    },

    'change #abiturients': function(event,template) {
        var input = event.target,
            file = event.target.files[0];

        AbiturientsFiles.insert(file, function(err, fileObj) {
            if (err) {
                console.log('Upload error:', err);
            } else {
                template.find('.upload-form').reset();
            }
        });
    }
});

Template.BackstageUpload.rendered = function() {
    $('.file-field').each(function() {
        var path_input = $(this).find('input.file-path');

        $(this).find('input[type="file"]').change(function () {
            var files = $(this)[0].files;
            var file_names = [];
            for (var i=0; i < files.length; i++) {
                file_names.push(files[i].name);
            }
            path_input.val(file_names.join(", "));
            path_input.trigger('change');
        });
    });
};
