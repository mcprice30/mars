package api

import (
	"fmt"
	"strconv"

	"github.com/jwowillo/pack"
	"github.com/jwowillo/trim"
	"github.com/jwowillo/trim/response"
	"github.com/mcprice30/mars/scraper"
)

// roverPath is the path to the rover resource.
const roverPath = roversPath + "/:rover"

// roverController is a resource representing a rover that also serves as a
// collection to all the sols the rover has experienced.
type roverController struct {
	trim.Bare
}

// Path is always roverPath.
func (c *roverController) Path() string {
	return roverPath
}

// Handle the trim.Request by returning a mapping of the sols the rover has
// experience to the paths to the sol resources.
//
// Essential parts of the rover manifest are also included.
//
// An error trim.Response is returned if an invalid rover is passed.
func (c *roverController) Handle(r *trim.Request) trim.Response {
	set := pack.NewHashSet(pack.StringHasher)
	for _, rover := range rovers {
		set.Add(rover)
	}
	rover := r.URLArg("rover")
	if !set.Contains(rover) {
		return response.NewJSON(
			trim.AnyMap{"message": fmt.Sprintf(
				"rover %s not in %v",
				rover, pack.Items(set),
			)}, trim.CodeBadRequest,
		)
	}
	rm, err := scraper.BuildManifest(rover, "scraper/manifests")
	if err != nil {
		return response.NewJSON(
			trim.AnyMap{"message": err},
			trim.CodeInternalServerError,
		)
	}
	sm := trim.AnyMap{}
	for _, sol := range rm.ActiveSols {
		sm[strconv.Itoa(sol)] = makeSolPath(rover, sol)

	}
	mm := trim.AnyMap{
		"name":        rm.Name,
		"landingDate": rm.LandingDate,
		"launchDate":  rm.LaunchDate,
		"status":      rm.Status,
		"maxSol":      rm.MaxSol,
		"maxDate":     rm.MaxDate,
		"totalPhotos": rm.TotalPhotos,
	}
	return response.NewJSON(
		trim.AnyMap{"solPaths": sm, "manifest": mm},
		trim.CodeOK,
	)
}

// makeSolPath makes a path to a sol resource based on the rover and a sol.
func makeSolPath(rover string, sol int) string {
	return makeRoverPath(rover) + "/" + strconv.Itoa(sol)
}
