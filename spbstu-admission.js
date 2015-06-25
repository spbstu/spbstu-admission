AccountsTemplates.configure({
    showForgotPasswordLink: true,
    texts: {
        button: {
            signUp: "Register Now!"
        },
        socialSignUp: "Register",
        socialIcons: {
            "meteor-developer": "fa fa-rocket"
        },
        title: {
            forgotPwd: "Recover Your Password"
        }
    }
});

AccountsTemplates.configureRoute('signIn');

Router.plugin('ensureSignedIn', {
    only: ['backstage', 'backstage/upload']
});

Router.configure({
    layoutTemplate: 'MainLayout'
});

Router.route('/', function () {
    this.render('spbstu-admission');
});

Router.route('/backstage/upload', {
    template: 'BackstageUpload'
});

if (Meteor.isServer) {
    Meteor.startup(function () {
        // code to run on server at startup
    });
}

Groups = new Mongo.Collection('groups');
