package api

import (
	"errors"
	"strconv"
	"strings"

	"github.com/jwowillo/trim"
	"github.com/jwowillo/trim/response"
	"github.com/mcprice30/mars/scraper"
)

// solPath is the path to the sol resource.
const solPath = roverPath + "/:sol"

// radius to find nearby sols to.
const radius = 10

var (
	// errBadSolType is an error for when the sol type is invalid.
	errBadSolType = errors.New("sol type must be int")
	// errBadSolValue is an error for when the sol value is invalid.
	errBadSolValue = errors.New("sol value invalid")
)

// solController is a resource and resource container which returns the cameras
// and nearest sols to a rover at a current sol.
type solController struct {
	trim.Bare
}

// Path is always solPath.
func (c *solController) Path() string {
	return solPath
}

// Handle the trim.Request by parsing out the rover name and sol and returning a
// mapping of camera paths and nearest sols to the sol.
func (c *solController) Handle(r *trim.Request) trim.Response {
	rover := r.URLArg("rover")
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
	cps := make(map[string]string)
	var cs []string
	for c := range sm.Cameras {
		cs = append(cs, c)
		cps[c] = makeCameraPath(rover, sol, c)
	}
	near := make(map[int]string)
	for _, sol := range rm.GetNearbySols(sol, radius, cs) {
		near[sol.Sol] = makeSolPath(rover, sol.Sol)
	}
	return response.NewJSON(
		trim.AnyMap{
			"cameraPaths":     cps,
			"nearestSols":     near,
			"thumbnailURL":    sm.ThumbnailUrl,
			"thumbnailCamera": sm.ThumbnailCamera,
			"earthDate":       sm.EarthDate,
			"totalPhotos":     sm.TotalPhotos,
		},
		trim.CodeOK,
	)
}

// makeCameraPath makes a path to a camera resource based on the rover the
// camera is attached to, the sol the pictures were taken at, and the camera
// which took the pictures.
func makeCameraPath(rover string, sol int, camera string) string {
	return makeSolPath(rover, sol) + "/" + strings.ToLower(camera)
}
