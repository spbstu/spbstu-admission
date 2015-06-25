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

if (Meteor.isServer) {
    Meteor.startup(function () {
        // code to run on server at startup
    });
}

Groups = new Mongo.Collection('groups');
