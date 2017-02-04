package api

import (
	"github.com/jwowillo/trim"
	"github.com/jwowillo/trim/response"
)

// errResponse returns a trim.Response containing properly formatted JSON about
// an error with a given trim.Code.
func errResponse(err error, code trim.Code) trim.Response {
	return response.NewJSON(trim.AnyMap{"message": err}, code)
}
