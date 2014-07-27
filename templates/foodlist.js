if (Meteor.isClient){
    Template.FoodList.food_items = function(){
        return FoodItems.find({status:"active"}, {sort: ["enddate"]});
    }

    Template.FoodItem.events({
        'click': function(e, tmpl){
            var id = tmpl.data._id;
            var itemname = tmpl.data.name;
            var shelflife = tmpl.data.shelflife;
            var timescale = tmpl.data.timescale;
            var enddate = Date.now() + (parseInt(shelflife)*1000*60*60*24);

            // save to db
            FoodItems.insert({
                name: itemname,
                user_id: Meteor.userId(),
                startdate: Date.now(),
                shelflife: shelflife,
                enddate: enddate,
                status: "active",
                timescale: "week"
            }, function (e){
                if (!e){
                    FoodItems.update({_id: id},
                        {$set: {
                                   status:"inactive"
                               }
                        });
                }
            });
        }
    });

    Template.FoodItem.values = function(){

        if (this.timescale == "week") {
            var startdate = new Date(this.startdate);
            // console.log(this.startdate);
            var enddate = new Date();
            // TODO: store enddate in the db
            enddate.setDate(startdate.getDate() + this.shelflife);
            var daysleft = (this.startdate + parseInt(this.shelflife)*3600000*24) - Date.now();
            if (daysleft < 1) {
                daysleft = 0;
            }

            // convert from ms to days
            daysleft = Math.round(daysleft / (1000 * 60 * 60 * 24));
            var scalefactor = 14.0;
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

    var hundredScale = function(num, divisions) {
        // scale the label boundaries automatically... with MATH
        var scalefactor = 100 / divisions;
        var currentscaled = num * scalefactor;
        // var max = currentscaled + scalefactor;
        var min = currentscaled - scalefactor;
        return {'min': min, 'max': currentscaled}
    }

    var donutColor = function(val){
        // bar color changes
        var yearcolor = "green";
        var monthcolor = "blue";
        var weekcolor = "aqua";
        var fivedaycolor = "yellow";
        var twodaycolor = "red";

        // 2/7 of 100 = 28ish
        if (val < hundredScale(3,14).min) {
            return twodaycolor;
        } else if (val > hundredScale(5,14).max) {
            return weekcolor;
        } else {
            return fivedaycolor;
        }
    };

    var staticoptions = {
        'lineWidth': 8,
        'size': 110,
        'scaleColor': false,
        'animate': false,
        'lineCap': 'butt',
        'barColor': donutColor,
        'trackColor': '#C9C9C9'
    };

    Template.FoodItem.rendered = function(){
        // small charts for list view
        $('.staticchart').data('timescale', 'week');
        $('.staticchart').easyPieChart(staticoptions);
    }

    // 14 day range
    var today = new Date();
    var fortnight = new Date();
    fortnight.setDate(today.getDate() + 14);

    var weekday = d3.scale.ordinal()
        .domain([0,1,2,3,4,5,6])
        .range(["Su", "M", "Tu", "W", "Th",
                "F", "Sa"]);

    var dayrange = d3.time.scale()
        .domain([today, fortnight])
        .range([1,14]);

    var months = d3.scale.ordinal()
        .domain(d3.range(12))
        .range(["January", "February", "March", "April", "May", "June",
               "July", "August", "September", "October", "November",
               "December"]);

    Template.CreateTimer.rendered = function(){
        // do some d3 shit

        // create dates
        d3.select(".row.dates").selectAll("div")
            .data(d3.range(1,15))
            .enter()
            .append("div")
                .attr("class", function(d,i){
                    var value = "col-xs-2";
                    if (i == 0) {
                        value = value + " col-xs-offset-4 active";
                    }
                    return value;
                })
                .text(function(d){ return dayrange.invert(d).getDate() });
        // create days of week
        d3.select(".row.days").selectAll("div")
            .data(d3.range(1,15)).enter()
            .append("div")
                .attr("class", function(d,i){
                    var value = "col-xs-2";
                    if (i == 0) {
                        value = value + " col-xs-offset-4 active";
                    }
                    return value;
                })
                .text(function(d){ return weekday(dayrange.invert(d).getDay()) });

        // create month
        d3.select(".row.month")
            .text(function(){
                return months(dayrange.invert(0).getMonth());
                });

        // scroll the rows together and do data stuff

        var scrollers = d3.selectAll(".row.days, .row.dates");

        var leftedge = scrollers.select("div").property("offsetLeft") - 20;

        d3.select(".row.daycount .num")
            .text(function(){
                return scrollers.select(".active").datum();
            });

        scrollers.on("scroll", function(d,i){
            // sync scrolling
            scrollers.property("scrollLeft", this.scrollLeft);
            // change active column
            var colwidth = d3.select(this).select("div").property("offsetWidth") - 15;
            scrollers.selectAll("div")
                .classed("active", function(){
                    if (-15 <= this.offsetLeft - scrollers.property("scrollLeft") - leftedge
                        && this.offsetLeft - scrollers.property("scrollLeft") - leftedge < colwidth) {
                        return true;
                    } else {
                        return false;
                    }
                });
            // update the number of days
            d3.select(".row.daycount .num")
                .text(function(){
                    return scrollers.select(".active").datum();
                });

            // update the month if necessary
            var activemonth = dayrange.invert(scrollers.select(".active")
                .datum()).getMonth();
            if (months(activemonth) != d3.select(".row.month").text()) {
                d3.select(".row.month").text(function(){
                    return months(activemonth);
                })
            }
        });
    }

    Template.CreateTimer.events({
        'click .btn.save': function(e){
            e.preventDefault();
            // gather data
            var itemname = d3.select("#timer_name").property("value");
            var shelflife = d3.select(".daycount .num").text();
            var enddate = dayrange.invert(d3.select(".days .active").datum());

            // save to db
            FoodItems.insert({
                name: itemname,
                user_id: Meteor.userId(),
                startdate: Date.now(),
                shelflife: shelflife,
                enddate: enddate.getTime(),
                status: "active",
                timescale: "week"
            });

            // return to list
            Router.go('FoodList');
        },
        'click .btn.cancel': function(e){
            e.preventDefault();
            Router.go("FoodList");
        }
    });
}
