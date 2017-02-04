package api

import (
	"github.com/jwowillo/trim"
	"github.com/jwowillo/trim/response"
	"github.com/mcprice30/mars/scraper"
)

// roversPath is the path to the rovers collection resource.
const roversPath = "/rovers"

// roversController is a collection resource which contains all possible
// rovers.
type roversController struct {
	trim.Bare
}

// Path is always roversPath.
func (c *roversController) Path() string {
	return roversPath
}

// Handle the trim.Request by returning a mapping of all rovers to their
// roverResource paths.
func (c *roversController) Handle(r *trim.Request) trim.Response {
	m := trim.AnyMap{}
	for _, r := range scraper.Rovers {
		m[r] = makeRoverPath(r)
	}
	return response.NewJSON(m, trim.CodeOK)
}

// roverPath creates a path to a rover resource based on a given rover.
func makeRoverPath(rover string) string {
	return roversPath + "/" + rover
}
