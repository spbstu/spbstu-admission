Template.BackstageUpload.events({
    'change #groups': function(event, template) {
        var input = event.target,
            file = event.target.files[0];

        GroupsFiles.insert(file, function(err, fileObj) {
            if (err) {
                console.log('Upload error:', err);
            } else {

            }
        });
    },

    'change #counters': function(event) {
        var input = event.target,
            file = event.target.files[0];

        CountersFiles.insert(file, function(err, fileObj) {
            if (err) {
                console.log('Upload error:', err);
            } else {

            }
        });
    }
});
