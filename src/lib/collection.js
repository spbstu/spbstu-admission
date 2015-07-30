Groups = new Mongo.Collection('groups');
Abiturients = new Mongo.Collection('abiturients');
Ratings = new Mongo.Collection('ratings');

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

Ratings.allow(allowBase);
Ratings.deny(denyBase);

SiteSettings.deny(denyBase);
SiteSettings.allow(allowBase);

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
RatingFiles = new FS.Collection("ratingFiles", {
    stores: [FSStore]
});

uploadStatus.update({}, {$set: {value: false}});
