// Package api contains a single function called Configure that accepts an
// application.API and configures it to serve the resources for the mars API.
//
// Every endpoint is read only and thus only supports GET trim.Requests.
//
// Any error objects are of the form
//
//   {"message": (string)}
//
// The attached resources are:
//   - /rovers
//
//     Is a collection resource that returns a JSON object of the form
//
//       {"roverPaths": {(string): (string)}}.
//
//     The "roverPaths" key contains a mapping of rover names to their resource
//     paths.
//
//   - /rovers/:rover
//
//    Is a resource and collection resource that returns a JSON object of the
//    form
//
//      {"solPaths": {(string): (string)}, "manifest": (string)}
//
//    The "solPaths" key contains a mapping of sols to their resource paths. The
//    key "manifest" contains important information about the rover.
//
//    An error is returned if a rover not returned by "/rovers" is requested.
//
//   - /rovers/:rover/:sol
//
//     Is a resource and collection resource that returns a JSON object of the
//     form
//
//       {
//         "cameraPaths": {(string): (string)},
//         "nearestSols": {(string): (string)},
//       }
//
//     The "cameraPaths" key contains a mapping of camera names to their
//     resource paths. The key "nearestSols" contains sols near the requested
//     sol.
//
//     An error is returned if the requested rover or sol doesn't exist.
//
//   - /rovers/:rover/:sol/:camera
//
//     Is a resource that returns a JSON object of the form
//
//       {"imageURLs": ([]string)}
//
//     The "imageURLs" key contains a list of imageURLs taken by the rover's
//     camera on the particular sol.
//
//     An error is returned if the requested rover, sol, or camera doesn't
//     exist.
package api

import (
	"github.com/jwowillo/trim"
	"github.com/jwowillo/trim/application"
	"github.com/jwowillo/trim/trimming"
)

// Configure the application.API to serve the mars API.
//
// This entails only allowing GET trim.Requests to endpoints and attaching all
// necessary trim.Controllers. These include trim.Controllers which return the
// list of rovers, information about a specific rover, information about a rover
// on a specific sol, and information about cameras attached to the rover.
func Configure(app *application.API) {
	app.AddTrimming(trimming.NewAllow(trim.MethodGet))
	app.AddController(&roversController{})
	app.AddController(&roverController{})
	app.AddController(&solController{})
	app.AddController(&cameraController{})
}
