Template.BackstageUpload.events({
    'change #input': function(event) {
        var file = event.target.files[0];

        if (! file) {
            return;
        }

        var result = Papa.parse(file, {
            skipEmptyLines: true,
            complete: function(result) {
                console.log(result);
            }
        });
    }
});
