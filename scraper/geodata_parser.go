package scraper

import (
	"bufio"
	"errors"
	"fmt"
	"os"
	"strconv"
	"strings"
)

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
