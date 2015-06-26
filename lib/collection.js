Groups = new Mongo.Collection('groups');

Groups.allow({
    update: function (userId, doc, fields, modifier) {
        return true;
    }
});

Groups.deny({
    update: function (userId, doc, fields, modifier) {
        return false;
    }
});
