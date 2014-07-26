if (Meteor.isClient){
    Template.FoodList.food_items = function(){
        return FoodItems.find({});
    }
}
