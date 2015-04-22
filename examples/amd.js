requirejs.config({
    baseUrl: '../bower_components',
    paths: {
        bootstrap: "bootstrap/dist/js/bootstrap",
        "jquery": "jquery/dist/jquery",
        knockout: "knockout/dist/knockout",
        "knockout-bulk-table": "../dist/knockout-bulk-table",
        "knockout-datatable": "knockout-datatable/knockout-datatable.amd"
    },
    shim: {
        bootstrap: {
            deps: ["jquery"]
        },
        "knockout-datatable": {
            deps: ["knockout"],
            exports: "this.DataTable"
        }
    }
});

requirejs(["knockout", "knockout-bulk-table", "knockout-datatable"], function(ko, BulkTable, DataTable){
    var actions = ko.observableArray();

    var citiesList=[{city_name:"Tokyo",country_name:"Japan",population:31714e3},{city_name:"Seoul",country_name:"South Korea",population:25721e3},{city_name:"Jakarta",country_name:"Indonesia",population:23308500},{city_name:"Delhi",country_name:"India",population:21753486}];

    var City = function City(row) {
        this.id = row.id;
        this.population = ko.observable(row.population);
        this.countryName = row.country_name;
        this.cityName = row.city_name;
    }

    var i = 1;
    var mapped = ko.observableArray(citiesList.map(function(row){
        row.id = i;
        i++;
        return new City(row);
    })); 

    var table = new DataTable(mapped, {
        recordWord: 'thing',
        recordWordPlural: 'snakes',
        sortDir: 'desc',
        sortField: 'foo',
        perPage: 15
    });

    var bulk = ko.observableArray();

    bulk.subscribe(function(newValue){
        console.log(newValue);
    });

    var bulkActions = new BulkTable(mapped, [
        {label: 'Test', click: function(collection, success){
            console.log("YO", collection(), success());
        }}
    ], {
        checkProperty: 'id'
    });

    setTimeout(function(){
        mapped.push(new City({id: i,city_name: "Copenhagen",country_name: "Denmark",population:50000000}));
    }, 100);

    ko.applyBindings({
        collection: mapped,
        bulkActions: bulkActions,
        exampleTable: table
    }, document.getElementById("container"));

});