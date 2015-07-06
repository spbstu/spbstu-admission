Groups = new Mongo.Collection('groups');
Abiturients = new Mongo.Collection('abiturients');

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

GroupsFiles = new FS.Collection("groupsFiles", {
    stores: [new FS.Store.FileSystem("groupsFiles")]
});

CountersFiles = new FS.Collection("countersFiles", {
    stores: [new FS.Store.FileSystem("countersFiles")]
});

AbiturientsFiles = new FS.Collection("abiturientsFiles", {
    stores: [new FS.Store.FileSystem("abiturientsFiles")]
});
