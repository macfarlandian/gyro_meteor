if (Meteor.isClient){
    Template.FoodItem.events({
        'click': function(e, tmpl){
            e.preventDefault();
            alert(tmpl.data._id);
        }
    });
}
