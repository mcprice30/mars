package api

import "github.com/jwowillo/trim"

// cameraPath is the path to the camera resource.
const cameraPath = solPath + "/:camera"

// cameraController is a resource that returns a list of URLs to images taken by
// a rover's camera on a particular sol.
type cameraController struct {
	trim.Bare
}

// Path is always cameraPath.
func (c *cameraController) Path() string {
	return cameraPath
}

// Handle the trim.Request by returning a list of URLs to images taken by a
// rover's camera on a particular sol.
//
// Returns an error if the rover, sol, or camera don't exist.
func (c *cameraController) Handle(r *trim.Request) trim.Response {
	return nil
}
