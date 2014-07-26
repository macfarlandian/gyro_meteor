FoodItems = new Meteor.Collection("FoodItems");

if (Meteor.isServer){
    Meteor.startup(
    function (){
        FoodItems.insert( {
            name: "FOOD!!!",
            startdate: new Date(),
        });
    }
    );
}
