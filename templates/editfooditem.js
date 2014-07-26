if (Meteor.isClient){
    Template.EditFoodItem.events( {
        'submit form': function(e, tmpl){
            e.preventDefault();
            var name = tmpl.find("#input_name").value;
            var shelflife = tmpl.find("#input_shelflife").value;

            FoodItems.insert({
                name: name,
                shelflife: shelflife,
                user_id: Meteor.userId()
            });

            tmpl.find('form').reset();
            
        }
    });
}
