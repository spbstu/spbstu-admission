Meteor.publish('allGroups', function() {
    return Groups.find({}, {sort: {faculty: 1, title: 1}});
});

Meteor.publish('groupInfo', function(groupId) {
    return Groups.find({groupId: groupId});
});

Meteor.publish('abiturients', function(groupId) {
    return Abiturients.find({groupId: groupId});
});

Meteor.publish('ratedAbiturients', function(groupId) {
    return Abiturients.find({groupId: groupId}, {sort: {rating: 1}});
});

Meteor.publish('uploadStatus', function() {
    return uploadStatus.find({});
});

Meteor.publish('siteSettings', function() {
    return SiteSettings.find({});
});
