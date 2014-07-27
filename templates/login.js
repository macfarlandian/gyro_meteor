if (Meteor.isClient){
    Template.LoginPage.events({
        'submit form': function(e, tmpl){
            e.preventDefault();
            email = tmpl.find("#input_email").value;
            password = tmpl.find("#input_password").value;

            if(!Meteor.userId){
                Meteor.loginWithPassword(email,password, function(e){
                    if (typeof(e) === 'undefined'){
                        Router.go('/');
                    } else {
                        alert("Login didn't work")
                    }
                });
            }
        }
    });
}
