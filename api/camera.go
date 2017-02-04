package api

import (
	"fmt"
	"strconv"

	"github.com/jwowillo/trim"
	"github.com/jwowillo/trim/response"
	"github.com/mcprice30/mars/scraper"
)

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
	rover := r.URLArg("rover")
	camera := r.URLArg("camera")
	sol, err := strconv.Atoi(r.URLArg("sol"))
	if err != nil {
		return errResponse(errBadSolType, trim.CodeBadRequest)
	}
	rm, err := scraper.BuildManifest(rover, manifestPrefix)
	if err != nil && err == scraper.ErrNoRover {
		return errResponse(err, trim.CodeNotFound)
	}
	sm, ok := rm.Photos[sol]
	if !ok {
		return errResponse(errBadSolValue, trim.CodeNotFound)
	}
	// Temporary until necessary functionality is added.
	fmt.Println(camera, sm)
	return response.NewJSON(
		trim.AnyMap{"imageURLs": []string{}},
		trim.CodeOK,
	)
}
