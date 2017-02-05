package scraper

import (
	"encoding/json"
	"errors"
	"fmt"
	"io/ioutil"
	"net/http"
)

// Photo contains information about a particular photograph.
type Photo struct {

	// Url is the location of the photograph.
	Url string

	// Camera describes which camera the rover took the picture with.
	Camera string

	// EarthDate contains the earth date when the picture was taken.
	EarthDate string
}

// String implements Stringer for photo. It is used in debugging.
func (p *Photo) String() string {
	return fmt.Sprintf("Taken: %s	(%s) At: %s", p.EarthDate, p.Camera, p.Url)
}

// Used to cycle through multiple apiKeys to allow for more requests per hour.
// Each of these keys belongs to a different person, just as a heads up.
var apiKeyIdx int = 0
var apiKeys []string = []string{
	"mx2LmwatV6u7v6qgVXSilCK5kiieKLdca7TxK52p",
	"h7dzj93PYcumEJhWcmWQbB11pdYKuIMJV96UUAZY",
	"ltfyjF4xUAu14OD9bvX1afj7cwbsDcXesz8jEc7C",
}

// GetSolImgs will take a rover, sol, a list of cameras, and a maximum
// number of images per camera to fetch and return a list of photos, or an
// error if one occurred.
func GetSolImgs(rover, sol string, cams []string, camMax int) ([]*Photo, error) {
	out := []*Photo{}
	for _, cam := range cams {
		apiKey := apiKeys[apiKeyIdx%len(apiKeys)]
		apiKeyIdx++
		photos, err := getCamImgs(rover, sol, cam, apiKey, camMax)
		if err != nil {
			return nil, err
		}
		out = append(out, photos...)
	}
	return out, nil
}

// getCamImgs will take a rover, sol, cam, api key, and a maximum number of
// images to return and return either a list of photos, or an error if one
// occurred.
func getCamImgs(rover, sol, cam, api_key string, maxImgs int) ([]*Photo, error) {

	baseUrl := "https://api.nasa.gov/mars-photos/api/v1/rovers"

	resp, err := http.Get(fmt.Sprintf("%s/%s/photos?sol=%s&camera=%s&api_key=%s",
		baseUrl, rover, sol, cam, api_key))

	if err != nil {
		return nil, fmt.Errorf("Error in request (%s)", err)
	}

	respBytes, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return nil, fmt.Errorf("Cannot read response body (%s)", err)
	}

	// Unmarshal the json response into a map.
	jso := map[string]interface{}{}
	if err := json.Unmarshal(respBytes, &jso); err != nil {
		return nil, fmt.Errorf("Cannot unmarshal response (%s)", err)
	}

	// Photos will be stored here.
	out := []*Photo{}

	for k, v := range jso {

		// Find the photos field of the returned json.
		if k == "photos" {
			// The "photos" field must be a list.
			photoArr, valid := v.([]interface{})
			if !valid {
				return nil, errors.New("Photos are not a list.")
			}

			// Iterate over every photo.
			for _, photo := range photoArr {

				// Convert the photo into a map.
				photoMap, valid := photo.(map[string]interface{})

				if !valid {
					return nil, errors.New("Photo is not map.")
				}

				// Extract the url and earth date for each photo.
				url_out := ""
				earth_date_out := ""

				for photoField, photoFieldValue := range photoMap {
					if photoField == "img_src" {
						srcString, valid := photoFieldValue.(string)
						if !valid {
							return nil, errors.New("img_src is not a string.")
						}
						url_out = srcString
					} else if photoField == "earth_date" {
						dateString, valid := photoFieldValue.(string)
						if !valid {
							return nil, errors.New("earth_date is not a string.")
						}
						earth_date_out = dateString
					}
				}

				// If we could extract a url and earth date, add this photo to the
				// output.
				if url_out != "" && earth_date_out != "" {
					out = append(out, &Photo{
						Url:       url_out,
						Camera:    cam,
						EarthDate: earth_date_out,
					})

					if len(out) >= maxImgs {
						return out, nil
					}
				}
			}
		}
	}
	return out, nil
}
