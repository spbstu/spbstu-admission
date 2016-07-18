Groups = new Mongo.Collection('groups');
Abiturients = new Mongo.Collection('abiturients');

uploadStatus = new Mongo.Collection('uploadStatus');
SiteSettings = new Mongo.Collection('siteSettings');

allowBase = {
    insert: function() {
        return true;
    },
    update: function (userId, doc, fields, modifier) {
        return true;
    }
};

denyBase = {
    insert: function() {
        return false;
    },
    update: function (userId, doc, fields, modifier) {
        return false;
    }
};

Groups.allow(allowBase);
Groups.deny(denyBase);

Abiturients.allow(allowBase);
Abiturients.deny(denyBase);

uploadStatus.deny(denyBase);
uploadStatus.allow(allowBase);

SiteSettings.deny(denyBase);
SiteSettings.allow(allowBase);

FSStore = new FS.Store.FileSystem("files");

GroupsFiles = new FS.Collection("groupsFiles", {
    stores: [FSStore]
});
AbiturientsFiles = new FS.Collection("abiturientsFiles", {
    stores: [FSStore]
});
RatingsFiles = new FS.Collection("ratingsFiles", {
    stores: [FSStore]
});

uploadStatus.find({}).forEach(function(doc) {
    uploadStatus.update({_id: doc._id}, {$set: {value: false}});
});
