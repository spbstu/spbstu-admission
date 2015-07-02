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
        fs = Npm.require('fs');
        path = Npm.require('path');
    });
}
