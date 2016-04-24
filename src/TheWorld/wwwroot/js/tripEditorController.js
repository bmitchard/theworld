// tripEditorController.js
(function () {
    "use strict";

    angular.module("app-trips")
    .controller("tripEditorController", tripEditorController);

    function tripEditorController($routeParams, $http) {

        var vm = this;

        vm.newStop = {};

        vm.tripName = $routeParams.tripName;
        vm.stops = [];
        vm.errorMessage = "";
        vm.isBusy = true;
        vm.newStop = {};

        $http.get("/api/trips/" + vm.tripName + "/stops")
        .then(function (response) {
            //success
            angular.copy(response.data, vm.stops);
            _showMap(vm.stops);
        }, function (err) {
            //failure
            vm.errorMessage = "Failed to load stops: " + err;
        })
        .finally(function () {
            vm.isBusy = false;
        });

        vm.addStop = function () {
            vm.isBusy = true;
            vm.errorMessage = "";
            var url = "/api/trips/" + vm.tripName + "/stops";

            $http.post(url, vm.newStop)
            .then(function (response) {
                //success
                vm.stops.push(response.data);
                _showMap(vm.stops);
                vm.newStop = {};
            }, function (err) {
                //failure
                vm.errorMessage = "Failed to save new stop: " + err.error;
            })
            .finally(function () {
                vm.isBusy = false;
            });
        };

    }
    function _showMap(stops) {
        if (stops && stops.length > 0) {

            var mapStops = _.map(stops, function (item) { 
                return {
                    lat: item.latitude,
                    long: item.longitude,
                    info: item.name
                };
            });

            // show map
            travelMap.createMap({
                stops: mapStops,
                selector: "#map",
                currentStop: 1,
                initialZoom: 3
            });
        }
    };
})();