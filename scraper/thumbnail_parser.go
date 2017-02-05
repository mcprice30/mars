package scraper

import (
	"bufio"
	"errors"
	"fmt"
	"os"
	"strconv"
	"strings"
	"time"
)

// thumbnailData contains information about what thumbnail is availabile for a
// given sol.
type thumbnailData struct {
	sol       int
	earthDate string
	camera    string
	thumbnail string
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

		date, err := time.Parse("2006-01-02", lineData[2])
		if err != nil {
			return nil, fmt.Errorf("Cannot parse date: %s", err)
		}

		// Then, the camera that took the picture, the earth date it was taken,
		// and the url of the thumbnail.
		out = append(out, thumbnailData{
			sol:       int(sol),
			camera:    lineData[1],
			earthDate: date.Format("January 2, 2006"),
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
