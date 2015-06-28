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

