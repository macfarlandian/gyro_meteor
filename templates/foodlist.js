if (Meteor.isClient){
    Template.FoodList.food_items = function(){
        return FoodItems.find({});
    }

    Template.FoodList.classes = function(){
        var classes = "isotope-item";
// TODO: the rest of this
        return classes;
    }

    Template.FoodList.values = function(){

        if (this.timescale == "week") {
            var startdate = new Date(this.startdate);
            // console.log(this.startdate);
            var enddate = new Date();
            enddate.setDate(startdate.getDate() + this.shelflife);
            var daysleft = enddate - Date.now();
            if (daysleft < 1) {
                daysleft = 0;
            }

            // convert from ms to days
            daysleft = daysleft / 1000 / 60 / 60 / 24;
            var scalefactor = 7.0;
        } else {
            // TODO: month, year etc
            var scalefactor = 30.0;
        }

        result = {};
        result.percentage = daysleft / scalefactor * 100;
        result.remaining = daysleft;

        if (daysleft == 0) {
            result.timeunits = "tap to reset";
        } else {
            if (this.timescale == 'year') {
                result.timeunits = 'months';
            } else {
                result.timeunits = 'days';
            }
        }

        return result;
    }
}
