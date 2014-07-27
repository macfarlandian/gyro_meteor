Groups = new Meteor.Collection('groups');

if (Meteor.isServer){
    Meteor.publish('Groups', function(){
        return Groups.find({memebers: {$in: this.userId}});
    });

    Groups.allow({
        insert: function (userId, doc){
            return _.indexOf(doc.admins, userId);
        },
        update: function (userId, doc){
            return _.indexOf(doc.admins, userId);
        },
        remove: function (userId, doc){
            return _.indexOf(doc.admins, userId);
        }
    });

}
