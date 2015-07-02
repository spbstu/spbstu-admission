Groups = new Mongo.Collection('groups');

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

GroupsFiles = new FS.Collection("groupsFiles", {
    stores: [new FS.Store.FileSystem("groupsFiles")]
});

CountersFiles = new FS.Collection("countersFiles", {
    stores: [new FS.Store.FileSystem("countersFiles")]
});
