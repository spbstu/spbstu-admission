Template.Navigation.events({
    'change select': function(event) {
        var elem = event.target,
            groupsQuery = Session.get('groupsQuery');

        if (elem.value !== '') {
            groupsQuery[elem.name] = elem.value;
        } else {
            delete groupsQuery[elem.name];
        }

        Session.set('groupsQuery', groupsQuery);
    }
});
