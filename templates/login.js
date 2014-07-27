var loginfunc = function(e){
    // if (typeof(e) === 'undefined'){
    //     Router.go('FoodList');
    // } else {
    //     alert("Login didn't work");
    // }
}
if (Meteor.isClient){
    Template.LoginPage.events({
        'click .emailbutton': function(e, tmpl){
            e.preventDefault();
            $(".emailform").fadeToggle();
        },

        'click .loginbutton': function(e, tmpl){
            e.preventDefault();
            var email = tmpl.find("#input_email").value;
            var password = tmpl.find("#input_password").value;

            if(!Meteor.userId()){
                Meteor.loginWithPassword(email, password, loginfunc);
            }
        },
        'click .createaccountbutton': function(e, tmpl){
           var email = tmpl.find("#input_email").value;
           var password = tmpl.find("#input_password").value;
           Accounts.createUser({email: email, password: password},
               function (e){
                   if(e){
                       console.log('account creation failed');
                   } else{
                       Meteor.loginWithPassword(email, password, loginfunc);
                   }
               });
        },
        'click #facebook_login': function (e, tmpl){
            e.preventDefault();
            Meteor.loginWithFacebook(loginfunc);
        },
        'click #twitter_login': function (e, tmpl){
            e.preventDefault();
            Meteor.loginWithTwitter(loginfunc);
        }
    });
}
