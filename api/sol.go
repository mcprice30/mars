package api

import "github.com/jwowillo/trim"

const solPath = roverPath + "/:sol"

type solController struct {
	trim.Bare
}

func (c *solController) Path() string {
	return solPath
}

func (c *solController) Handle(r *trim.Request) trim.Response {
	return nil
}
