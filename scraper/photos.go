package scraper

import (
	"encoding/json"
	"errors"
	"fmt"
	"io/ioutil"
	"net/http"
)

type Photo struct {
	Url       string
	Camera    string
	EarthDate string
}

func (p *Photo) String() string {
	return fmt.Sprintf("Taken: %s	(%s) At: %s", p.EarthDate, p.Camera, p.Url)
}

var apiKeyIdx int = 0
var apiKeys []string = []string{
	"mx2LmwatV6u7v6qgVXSilCK5kiieKLdca7TxK52p",
	"h7dzj93PYcumEJhWcmWQbB11pdYKuIMJV96UUAZY",
	"ltfyjF4xUAu14OD9bvX1afj7cwbsDcXesz8jEc7C",
}

// GetSolImgs will take a rover, sol, and list of cameras and return a
// list of photos, or an error if it occurred.
func GetSolImgs(rover, sol string, cams []string) ([]*Photo, error) {
	out := []*Photo{}
	for _, cam := range cams {
		apiKey := apiKeys[apiKeyIdx%len(apiKeys)]
		apiKeyIdx++
		photos, err := getCamImgs(rover, sol, cam, apiKey)
		if err != nil {
			return nil, err
		}
		out = append(out, photos...)
	}
	return out, nil
}

func getCamImgs(rover, sol, cam, api_key string) ([]*Photo, error) {

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

	out := []*Photo{}

	for k, v := range jso {
		if k == "photos" {
			photoArr, valid := v.([]interface{})
			if !valid {
				return nil, errors.New("Photos are not a list.")
			}

			for _, photo := range photoArr {

				// Convert the photo into a map.
				photoMap, valid := photo.(map[string]interface{})

				if !valid {
					return nil, errors.New("Photo is not map.")
				}

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

				if url_out != "" && earth_date_out != "" {
					out = append(out, &Photo{
						Url:       url_out,
						Camera:    cam,
						EarthDate: earth_date_out,
					})
				}
			}
		}

	}
	return out, nil

}
