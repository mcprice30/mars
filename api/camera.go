package api

import "github.com/jwowillo/trim"

const cameraPath = solPath + "/:camera"

type cameraController struct {
	trim.Bare
}

func (c *cameraController) Path() string {
	return cameraPath
}

func (c *cameraController) Handle(r *trim.Request) trim.Response {
	return nil
}
