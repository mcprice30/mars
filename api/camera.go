package api

import (
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
	var cs []string
	for c := range sm.Cameras {
		cs = append(cs, c)
	}
	ps, err := scraper.GetSolImgs(
		rover,
		strconv.Itoa(sol),
		[]string{camera},
	)
	if err != nil {
		return errResponse(err, trim.CodeInternalServerError)
	}
	var pms []trim.AnyMap
	for _, p := range ps {
		pms = append(
			pms,
			trim.AnyMap{"url": p.Url, "earthDate": p.EarthDate},
		)
	}
	return response.NewJSON(
		trim.AnyMap{"images": pms},
		trim.CodeOK,
	)
}
