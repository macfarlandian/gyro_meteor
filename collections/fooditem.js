FoodItems = new Meteor.Collection("FoodItems");

if (Meteor.isServer){
    Meteor.startup(
        Meteor.publish('FoodItems', function(){
        return FoodItems.find({user_id: this.userId});
    });

    FoodItems.allow({
        insert: function (userId, doc){
            return doc.user_id === userId;
        },
        update: function (userId, doc){
            return doc.user_id === userId;
        },
        remove: function (userId, doc){
            return doc.user_id === userId;
        }

    });
}

if (Meteor.isClient){
    Meteor.subscribe('FoodItems');
}
