package scraper

import (
	"fmt"
	"sort"
	"strings"
)

// Location represents the location of a rover on a given sol.
type Location struct {

	// Latitude is the latitude of the rover.
	Latitude float64

	// Longitude is the longitude of the rover.
	Longitude float64

	// Sol is the sol at which this measurement was taken.
	Sol int
}

// SolManifest represents the manifest for a single sol for a given
// rover.
// It contains the number of photos taken that day and a set
// containing all cameras that took photos that day.
type SolManifest struct {

	// Sol is the number of the sol, starting from the day the rover landed.
	Sol int

	// TotalPhotos is the number of photos taken during this sol.
	TotalPhotos int

	// Cameras is a set containing which cameras were used during this sol.
	Cameras map[string]interface{}

	// ThumbnailUrl contains the Url of a thumbnail for this sol.
	ThumbnailUrl string

	// ThumbnailCamera contains which camera the thumbnail was taken with.
	ThumbnailCamera string

	// EarthDate stores which earth date the thumbnail was taken.
	EarthDate string

	// Longitude stores the longitude of the rover during this sol.
	Longitude float64

	// Latitude contains the latitude of the rover during this sol.
	Latitude float64
}

// String implements stringer for SolManifest. It returns a string
// representation of the SolManifest for use in debugging.
func (sm *SolManifest) String() string {
	cameras := []string{}
	for c := range sm.Cameras {
		cameras = append(cameras, c)
	}
	out := fmt.Sprintf("%d: %d photos [%s]", sm.Sol, sm.TotalPhotos, strings.Join(cameras, ","))
	if sm.ThumbnailUrl != "" {
		out = fmt.Sprintf("%s date: %s thumbnail (%s): %s", out, sm.EarthDate, sm.ThumbnailCamera, sm.ThumbnailUrl)
	}

	if sm.Longitude != 0 {
		out = fmt.Sprintf("%s located at: %f, %f", out, sm.Longitude, sm.Latitude)
	}
	return out
}

// RoverManifest represents the manifest of a single rover.
// It contains basic data about the given rover, along with
// a list of which sols photos were taken in.
// For each active sol, the sol's manifest is included.
type RoverManifest struct {

	// Name is the name of the rover.
	Name string

	// LandingDate is the earth date that the rover landed on mars.
	LandingDate string

	// LaunchDate is the earth date that the rover was launched.
	LaunchDate string

	// Status stores the status of the rover ("complete" or "active").
	Status string

	// MaxSol is the latest sol that there is information for.
	MaxSol int

	// MaxDate is the latest earth date that there is information for.
	MaxDate string

	// TotalPhotos is the total number of photos taken by this rover.
	TotalPhotos int

	// ActiveSols is a sorted slice containing all sols that at
	// least one photo was taken during.
	ActiveSols []int

	// Stores the sol manifest for every sol that the rover
	// took at least one photo during.
	Photos map[int]*SolManifest

	// A slice containing the location of the rover at every
	// given sol.
	Locations []Location
}

// GetNearbySols will return the manifests for the sols nearest a given
// sol matching the set of cameras, sorted in ascending order.
//
// For a sol to "match" the list of cameras, at least one of the given cameras
// must have been used to take a picture that sol.
//
// If the given sol matches the list of cameras, this will return that sol, with
// up to 'radius' earlier and up to 'radius' later sols.
//
// If the given sol does not match the list of cameras, this will return up to
// 'radius' earlier and 'radius' later sols.
func (rm *RoverManifest) GetNearbySols(sol, radius int, cameras []string) []*SolManifest {
	out := []*SolManifest{}

	// Binary search for the exact match.
	midIdx := sort.SearchInts(rm.ActiveSols, sol)

	// If we have an exact match, add it.
	if midIdx >= 0 && midIdx < len(rm.ActiveSols) &&
		rm.Photos[rm.ActiveSols[midIdx]].containsCamera(cameras) {

		out = append(out, rm.Photos[rm.ActiveSols[midIdx]])
	}

	// Prepend up to 'radius' earlier sols.
	added := 0
	for searchIdx := midIdx - 1; searchIdx > 0 && added < radius; searchIdx-- {
		sol := rm.ActiveSols[searchIdx]
		if rm.Photos[sol].containsCamera(cameras) {
			out = append([]*SolManifest{rm.Photos[sol]}, out...)
			added++
		}
	}

	// Append up to 'radius' later sols.
	added = 0
	for searchIdx := midIdx + 1; searchIdx < len(rm.ActiveSols) && added < radius; searchIdx++ {
		sol := rm.ActiveSols[searchIdx]
		if rm.Photos[sol].containsCamera(cameras) {
			out = append(out, rm.Photos[sol])
			added++
		}
	}

	return out
}

// containsCamera will return true if and only if at least one of the
// given cameras was used to take a picture during the sol in question.
func (sm *SolManifest) containsCamera(cameras []string) bool {
	for _, camera := range cameras {
		if _, exists := sm.Cameras[camera]; exists {
			return true
		}
	}
	return false
}
