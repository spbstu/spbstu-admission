Groups = new Mongo.Collection('groups');
Abiturients = new Mongo.Collection('abiturients');

uploadStatus = new Mongo.Collection('uploadStatus');
SiteSettings = new Mongo.Collection('siteSettings');

Groups.allow({
    insert: function() {
        return true;
    },
    update: function (userId, doc, fields, modifier) {
        return true;
    }
});

Groups.deny({
    insert: function() {
        return false;
    },
    update: function (userId, doc, fields, modifier) {
        return false;
    }
});

Abiturients.allow({
    insert: function() {
        return true;
    },
    update: function (userId, doc, fields, modifier) {
        return true;
    }
});

Abiturients.deny({
    insert: function() {
        return false;
    },
    update: function (userId, doc, fields, modifier) {
        return false;
    }
});

FSStore = new FS.Store.FileSystem("files");

GroupsFiles = new FS.Collection("groupsFiles", {
    stores: [FSStore]
});
RatingGroupsFiles = new FS.Collection("ratingGroupsFiles", {
    stores: [FSStore]
});
CountersFiles = new FS.Collection("countersFiles", {
    stores: [FSStore]
});
AbiturientsFiles = new FS.Collection("abiturientsFiles", {
    stores: [FSStore]
});
