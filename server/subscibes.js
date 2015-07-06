Meteor.publish('allGroups', function() {
    return Groups.find({}, {sort: {faculty: 1, title: 1}});
});

Meteor.publish('abiturients', function(groupId) {
    return Abiturients.find({groupId: groupId});
});
