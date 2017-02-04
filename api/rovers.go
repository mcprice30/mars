package api

import (
	"net/http"

	"github.com/jwowillo/trim"
	"github.com/jwowillo/trim/response"
)

// roversPath is the path to the rovers collection resource.
const roversPath = "/rovers"

// rovers is the list of all possible rovers.
var rovers = []string{"curiousity", "opportunity", "spirit"}

// roversController is a collection resource which contains all possible
// rovers.
type roversController struct {
	trim.Bare
}

// Path is always roversPath.
func (c *roversController) Path() string {
	return roversPath
}

// Handle the trim.Request by creating a mapping of all rovers to their
// roverResource paths.
func (c *roversController) Handle(r *trim.Request) trim.Response {
	m := trim.AnyMap{}
	for _, r := range rovers {
		m[r] = roverPath(roversPath, r)
	}
	return response.NewJSON(m, http.StatusOK)
}

// roverPath creates a path to a rover resource based on a given rover.
func roverPath(rover string) string {
	return roversPath + "/" + rover
}
