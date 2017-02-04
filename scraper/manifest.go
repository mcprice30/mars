package scraper

import (
	"fmt"
	"sort"
	"strings"
)

// SolManifest represents the manifest for a single sol for a given
// rover.
// It contains the number of photos taken that day and a set
// containing all cameras that took photos that day.
type SolManifest struct {
	Sol             int
	TotalPhotos     int
	Cameras         map[string]interface{}
	ThumbnailUrl    string
	ThumbnailCamera string
	EarthDate       string
	Longitude       string
	Latitude        string
}

// String implements stringer for SolManifest
func (sm *SolManifest) String() string {
	cameras := []string{}
	for c := range sm.Cameras {
		cameras = append(cameras, c)
	}
	out := fmt.Sprintf("%d: %d photos [%s]", sm.Sol, sm.TotalPhotos, strings.Join(cameras, ","))
	if sm.ThumbnailUrl != "" {
		out = fmt.Sprintf("%s date: %s thumbnail (%s): %s", out, sm.EarthDate, sm.ThumbnailCamera, sm.ThumbnailUrl)
	}

	if sm.Longitude != "" {
		out = fmt.Sprintf("%s located at: %s, %s", out, sm.Longitude, sm.Latitude)
	}
	return out
}

// RoverManifest represents the manifest of a single rover.
// It contains basic data about the given rover, along with
// a list of which sols photos were taken in.
// For each active sol, the sol's manifest is included.
type RoverManifest struct {
	Name        string
	LandingDate string
	LaunchDate  string
	Status      string
	MaxSol      int
	MaxDate     string
	TotalPhotos int
	ActiveSols  []int
	Photos      map[int]*SolManifest
}

func (rm *RoverManifest) GetNearbySols(sol, radius int, cameras []string) []*SolManifest {
	out := []*SolManifest{}
	midIdx := sort.SearchInts(rm.ActiveSols, sol)

	if midIdx >= 0 && midIdx < len(rm.ActiveSols) &&
		rm.Photos[rm.ActiveSols[midIdx]].containsCamera(cameras) {

		out = append(out, rm.Photos[rm.ActiveSols[midIdx]])
	}

	added := 0
	for searchIdx := midIdx - 1; searchIdx > 0 && added < radius; searchIdx-- {
		sol := rm.ActiveSols[searchIdx]
		if rm.Photos[sol].containsCamera(cameras) {
			out = append([]*SolManifest{rm.Photos[sol]}, out...)
			added++
		}
	}

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

func (sm *SolManifest) containsCamera(cameras []string) bool {
	for _, camera := range cameras {
		if _, exists := sm.Cameras[camera]; exists {
			return true
		}
	}
	return false
}
