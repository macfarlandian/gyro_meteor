FoodItems = new Meteor.Collection("FoodItems");

if (Meteor.isServer){
    Meteor.startup(
    function (){
        // FoodItems.insert( {
        //     name: "FOOD!!!",
        //     startdate: Date.now(),
        //     timescale: "week",
        //     shelflife: 7,
        //     status: "active"
        // });
    }
    );
}
