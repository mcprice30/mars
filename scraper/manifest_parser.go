package scraper

import (
	"bufio"
	"encoding/json"
	"errors"
	"fmt"
	"io/ioutil"
	"os"
	"strconv"
	"strings"
)

// thumbnailData contains information about what thumbnail is availabile for a
// given sol.
type thumbnailData struct {
	sol       int
	earthDate string
	camera    string
	thumbnail string
}

// ErrNoRover is returned if a bad rover is requested.
var ErrNoRover = errors.New("bad rover name")

// Rovers is a list of all possible rovers.
var Rovers = []string{"curiosity", "opportunity", "spirit"}

// BuildManifest will take the name of a rover and a path from the
// where the program is run to the /scraper/manifests directory.
// It will return the manifest for that rover, if there is one.
func BuildManifest(roverName, filePrefix string) (*RoverManifest, error) {

	// Read the rover's manifest file.
	fileName := fmt.Sprintf("%s/%s.json", filePrefix, roverName)
	fileData, err := ioutil.ReadFile(fileName)
	if err != nil {
		return nil, ErrNoRover
	}

	// Unmarshal JSON and retrieve photo manifest.
	manifestMap := map[string]interface{}{}
	if err = json.Unmarshal(fileData, &manifestMap); err != nil {
		return nil, fmt.Errorf("Cannot unmarshal JSON: %s", err)
	}

	photoManifest, exists := manifestMap["photo_manifest"]
	if !exists {
		return nil, errors.New("No photos manifest in given manifest.")
	}

	photoManifestMap, valid := photoManifest.(map[string]interface{})
	if !valid {
		return nil, errors.New("Photo manifest is not a map.")
	}

	outManifest := &RoverManifest{}

	// Retrieve basic fields from the photo manifest (name, status, etc)

	// Name
	if name, exists := photoManifestMap["name"]; !exists {
		return nil, errors.New("Photo manifest has no name.")
	} else {
		if nameStr, valid := name.(string); !valid {
			return nil, errors.New("Photo manifest name is not a string.")
		} else {
			outManifest.Name = nameStr
		}
	}

	// Landing Date
	if landingDate, exists := photoManifestMap["landing_date"]; !exists {
		return nil, errors.New("Photo manifest has no landing date.")
	} else {
		if landingDateStr, valid := landingDate.(string); !valid {
			return nil, errors.New("Landing date is not a string.")
		} else {
			outManifest.LandingDate = landingDateStr
		}
	}

	// Launch Date
	if launchDate, exists := photoManifestMap["launch_date"]; !exists {
		return nil, errors.New("Photo manifest has no launch date.")
	} else {
		if launchDateStr, valid := launchDate.(string); !valid {
			return nil, errors.New("Launch date is not a string.")
		} else {
			outManifest.LaunchDate = launchDateStr
		}
	}

	// Status
	if status, exists := photoManifestMap["status"]; !exists {
		return nil, errors.New("Photo manifest has no status.")
	} else {
		if statusStr, valid := status.(string); !valid {
			return nil, errors.New("Status is not a string.")
		} else {
			outManifest.Status = statusStr
		}
	}

	// Max Sol
	if maxSol, exists := photoManifestMap["max_sol"]; !exists {
		return nil, errors.New("Photo manifest has no max sol.")
	} else {
		if maxSolNum, valid := maxSol.(float64); !valid {
			return nil, errors.New("Max sol is not a number.")
		} else {
			outManifest.MaxSol = int(maxSolNum)
		}
	}

	// Max Date
	if maxDate, exists := photoManifestMap["max_date"]; !exists {
		return nil, errors.New("Photo manifest has no max date.")
	} else {
		if maxDateStr, valid := maxDate.(string); !valid {
			return nil, errors.New("Max date is not a string.")
		} else {
			outManifest.MaxDate = maxDateStr
		}
	}

	// Total Photos
	if totalPhotos, exists := photoManifestMap["total_photos"]; !exists {
		return nil, errors.New("Photo manifest has no total photos.")
	} else {
		if totalPhotosNum, valid := totalPhotos.(float64); !valid {
			return nil, errors.New("Total photos is not a number.")
		} else {
			outManifest.TotalPhotos = int(totalPhotosNum)
		}
	}

	// Photos
	photos, exists := photoManifestMap["photos"]
	if !exists {
		return nil, errors.New("Photo manifest has no photos.")
	}

	photosList, valid := photos.([]interface{})
	if !valid {
		return nil, errors.New("Photos do not form a list.")
	}

	// Fill photos with the sol manifests.
	outManifest.Photos = map[int]*SolManifest{}

	for i, photoData := range photosList {
		sol, solManifest, err := parseSolManifest(photoData)
		if err != nil {
			fmt.Printf("Error retrieving sol manifest #%d: %s\n", i, err)
		} else {
			outManifest.Photos[sol] = solManifest
			outManifest.ActiveSols = append(outManifest.ActiveSols, sol)
		}
	}

	// Try to find thumbnails for every sol.
	thumbData, err := fetchThumbnailData(roverName, filePrefix)
	if err == nil {
		for _, thumbInfo := range thumbData {
			sol := thumbInfo.sol
			outManifest.Photos[sol].ThumbnailUrl = thumbInfo.thumbnail
			outManifest.Photos[sol].ThumbnailCamera = thumbInfo.camera
			outManifest.Photos[sol].EarthDate = thumbInfo.earthDate
		}
	} else {
		fmt.Fprintf(os.Stderr, "Unable to get thumbnail info for %s (%s)\n", roverName, err)
	}

	// Try to find geodata for every sol.
	coordsData, err := fetchCoordsData(roverName, filePrefix, outManifest.MaxSol)
	if err == nil {
		for _, sol := range outManifest.ActiveSols {
			solManifest := outManifest.Photos[sol]
			solManifest.Longitude = coordsData[sol].Longitude
			solManifest.Latitude = coordsData[sol].Latitude
		}
		outManifest.Locations = coordsData
	} else {
		fmt.Fprintf(os.Stderr, "Unable to get coords info for %s (%s)\n", roverName, err)
	}

	// Done!
	return outManifest, nil
}

// fetchCoordsData will take the name of a rover, a path to
// "/scraper/manifests/", and the number of sols that this rover has been active
// on mars, and will return the location of the rover on every sol, or an error
// if one occurred.
func fetchCoordsData(roverName, filePrefix string, numSols int) ([]Location, error) {

	// Open the pre-scraped file.
	fileName := fmt.Sprintf("%s/%s_coords.txt", filePrefix, roverName)
	coordsFile, err := os.Open(fileName)
	if err != nil {
		return nil, err
	}

	// Build the output slice (include sol 0, just to be sure).
	out := make([]Location, numSols+1)
	minSol := 1000000
	maxSol := 0

	// Read file line by line.
	scanner := bufio.NewScanner(coordsFile)
	for scanner.Scan() {
		// There must be 4 columns
		lineData := strings.Fields(scanner.Text())
		if len(lineData) != 4 {
			return nil, errors.New("Not enough columns.")
		}

		// get the startSol of an interval.
		sSol, err := strconv.ParseInt(lineData[2], 10, 32)
		if err != nil {
			return nil, errors.New("Start sol is not an integer.")
		}

		// get the endSol of an interval.
		eSol, err := strconv.ParseInt(lineData[3], 10, 32)
		if err != nil {
			return nil, errors.New("End sol is not an integer.")
		}

		// get the longitude of the rover during the interval.
		longitude, err := strconv.ParseFloat(lineData[0], 64)
		if err != nil {
			return nil, errors.New("Longitude is not a number.")
		}

		// get the latitude of the rover during the interval.
		latitude, err := strconv.ParseFloat(lineData[1], 64)
		if err != nil {
			return nil, errors.New("Latitude is not a number.")
		}

		// cast from int64 (from parseInt) to int
		startSol := int(sSol)
		endSol := int(eSol)

		// fill every sol in this interval with the given latitude and longitude.
		for sol := startSol; sol <= endSol; sol++ {
			if sol < minSol {
				minSol = sol
			}
			if sol > maxSol {
				maxSol = sol
			}
			out[sol] = Location{
				Longitude: longitude,
				Latitude:  latitude,
				Sol:       sol,
			}
		}
	}

	// Backfill earlier sols with the data from the first sol we have geodata for.
	for sol := minSol; sol >= 0; sol-- {
		out[sol] = out[minSol]
		out[sol].Sol = sol
	}

	// Frontfill later sols with the data from the last sol we have geodata for.
	for sol := maxSol; sol < len(out); sol++ {
		out[sol] = out[maxSol]
		out[sol].Sol = sol
	}

	// Return the sol.
	return out, nil
}

// fetchThumnailData will fetch pre-scraped thumbnails for a given rover, where
// filePrefix is the path to /scraper/manifests/.
// It will return data on the thumbnails for every available sol, or an error
// if one occurred.
func fetchThumbnailData(roverName, filePrefix string) ([]thumbnailData, error) {

	// Open the pre-scraped file.
	fileName := fmt.Sprintf("%s/%s_thumbnail.txt", filePrefix, roverName)
	thumbnailFile, err := os.Open(fileName)
	if err != nil {
		return nil, err
	}

	// Store thumbnail data output.
	out := []thumbnailData{}

	// Read file line by line.
	scanner := bufio.NewScanner(thumbnailFile)
	for scanner.Scan() {

		// Each line must have 4 columns.
		lineData := strings.Fields(scanner.Text())
		if len(lineData) != 4 {
			return nil, errors.New("Not enough columns.")
		}

		// First, the sol that this thumbnail data is for, which must be an int.
		sol, err := strconv.ParseInt(lineData[0], 0, 32)
		if err != nil {
			return nil, errors.New("Sol is not an integer.")
		}

		// Then, the camera that took the picture, the earth date it was taken,
		// and the url of the thumbnail.
		out = append(out, thumbnailData{
			sol:       int(sol),
			camera:    lineData[1],
			earthDate: lineData[2],
			thumbnail: lineData[3],
		})
	}

	// Return an error if we couldn't scan the file.
	if err := scanner.Err(); err != nil {
		return nil, err
	}

	// Done!
	return out, nil
}

// parseSolManifest will take an unmarshalled JSON object containing
// the manifest data for a particular sol.
//
// It will return the sol in question, along with that sol's manifest, or
// an error if one occurred.
func parseSolManifest(data interface{}) (int, *SolManifest, error) {

	manifestMap, valid := data.(map[string]interface{})
	if !valid {
		return -1, nil, errors.New("Sol Manifest is not a map.")
	}

	// Sol Manifest sol.
	sol, exists := manifestMap["sol"]
	if !exists {
		return -1, nil, errors.New("Sol manifest has no sol.")
	}

	solNum, valid := sol.(float64)
	if !valid {
		return -1, nil, errors.New("Sol is not a number.")
	}

	// Total photos for sol manifest.
	totalPhotos, exists := manifestMap["total_photos"]
	if !exists {
		return -1, nil, errors.New("Sol manifest has no total photos.")
	}

	totalPhotosNum, valid := totalPhotos.(float64)
	if !valid {
		return -1, nil, errors.New("Total photos are not a number.")
	}

	// Cameras for sol manifest.
	cameras, exists := manifestMap["cameras"]
	if !exists {
		return -1, nil, errors.New("Sol manifest has no cameras.")
	}

	camerasList, valid := cameras.([]interface{})
	if !valid {
		return -1, nil, errors.New("Sol manifest cameras are not a list.")
	}

	// Put every camera this day into a set.
	solCameras := map[string]interface{}{}

	for _, camera := range camerasList {
		if cameraStr, valid := camera.(string); !valid {
			return -1, nil, errors.New("Camera is not a string")
		} else {
			solCameras[cameraStr] = struct{}{}
		}
	}

	// Build and return the manifest.
	solManifest := &SolManifest{
		Sol:         int(solNum),
		TotalPhotos: int(totalPhotosNum),
		Cameras:     solCameras,
	}

	return int(solNum), solManifest, nil
}
