if (Meteor.isClient){
    Router.map( function() {
        this.route('LoginPage', {path: '/login'});
        this.route('FoodOverview', {path: '/'});
    });
    Router.configure({
        onBeforeAction: function(pause){
            var routename = this.route.name;
            if ('LoginPage' === routename){
                return;
            }
            if (!Meteor.userId()){
                this.render('LoginPage');
                pause();
            }
        }
    });
}
