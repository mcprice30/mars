package api

import "github.com/jwowillo/trim"

// solPath is the path to the sol resource.
const solPath = roverPath + "/:sol"

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
	return nil
}

// makeCameraPath makes a path to a camera resource based on the rover the
// camera is attached to, the sol the pictures were taken at, and the camera
// which took the pictures.
func makeCameraPath(rover string, sol int, camera string) string {
	return makeSolPath(rover, sol) + "/" + camera
}
