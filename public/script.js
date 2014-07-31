// -*- encoding: utf-8; -*-

// searchApp: Angular 1.2.10 application for managing
// a simple concordance search
//
// Brandon Chau

var app = angular.module('searchApp', ['ngRoute']);

// Configure routes for pages in the application
app.config(function($routeProvider) {
    $routeProvider

    // route for the home page
	.when('/', {
	    templateUrl : 'pages/home.html',
	    controller  : 'mainController'
	})

    // route for the help page
	.when('/help', {
	    templateUrl : 'pages/help.html',
	    controller  : 'helpController'
	});
});

app.controller('mainController', function($scope, $http) {
    $scope.userSearchTerm = "";
    $scope.searchmsg = "";
    $scope.getresults = function(t) {
        if ((typeof t) === "string") {
            $scope.userSearchTerm = t;
        } else {
            t = t.Term;
            $scope.userSearchTerm = t.Term;
        }
        $scope.showResults = false;

        var searchterm = t;

        $http({
            method: "POST",
            url: "http://localhost:8000/search",
            data: {
                "reqtype":"search",
                "term": searchterm
            }
        }).
            success(function(data, status, headers, config) {
                // angular.forEach(data.results, function(value) {
                //     console.log("RESULTS value = "+value);
                // });
                $scope.showResults = true;
                $scope.results = data.results;
                $scope.searchterm = data.searchterm;
                $scope.searchmsg = data.term;
                $scope.matchcount = data.count;
            }).
            error(function(data, status, headers, config) {
                console.log("ERROR in $http search (status = "+status+")");
            });
    };
});

app.controller('helpController', function($scope, $http) {
    $scope.x = 1;
    $scope.samples1 = [
        {"Term":"and","Description":"Return context for \"and\", \"stand\", \"hand\", \"husband\", etc."},
        {"Term":"\\band\\b","Description":"Return context only for \"and\" "},
        {"Term":"love(r|s)","Description":"Return context only for \"lover\" and \"loves\", not \"love\" or \"lovers\" "},
    ];

    $scope.searchFor = function(term) {
        window.location.assign("#");
        $scope.getresults(term);
    };
});
