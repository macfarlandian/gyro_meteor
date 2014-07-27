FoodItems = new Meteor.Collection("FoodItems");

if (Meteor.isServer){

    // fixture data
    if (FoodItems.find().count() == 0) {
        var items = [
            {
                name: "bananas",
                startdate: "2014-07-24T14:48:00",
                timescale: "week",
                shelflife: 3,
                status: "active",
                user_id: "TXjTMSaW9mkbpPfLy"
            },

            {
                name: "tomatoes",
                startdate: "2014-07-25T14:48:00",
                timescale: "week",
                shelflife: 7,
                status: "active",
                user_id: "TXjTMSaW9mkbpPfLy"
            },

            {
                name: "leftover cheesecake",
                startdate: "2014-07-26T14:48:00",
                timescale: "week",
                shelflife: 2,
                status: "active",
                user_id: "testteststs"
            }

        ];
        _.each(items, function(item){
            FoodItems.insert(item);
        });
    }

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
