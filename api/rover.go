package api

import "github.com/jwowillo/trim"

const roverPath = roversPath + "/:rover"

type roverController struct {
	trim.Bare
}

func (c *roverController) Path() string {
	return roverPath
}

func (c *roverController) Handle(r *trim.Request) trim.Response {
	return nil
}
