// Package api contains a single function called Configure that accepts an
// application.API and configures it to serve the resources for the mars API.
//
// Every endpoint is read only and thus only supports GET trim.Requests.
//
// The attached resources are:
//   - /rovers
//
//     Is a collection resource that returns a JSON object of the form
//
//       {"roverPaths": {(string): ([]string)}([]string)}.
//
//     The "roverPaths" key contains a dictionary that maps rover names to their
//     resource paths.
//
//   - /rovers/:rover
//
//   - /rovers/:rover/:sol
//
//   - /rovers/:rover/:sol/:camera
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
