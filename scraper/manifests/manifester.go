package main

import (
	"fmt"
	"os"

	"github.com/mcprice30/mars/scraper"
)

func main() {
	if len(os.Args) != 3 {
		fmt.Printf("Usage: %s <rover name> <camera name>\n", os.Args[0])
		os.Exit(1)
	}
	manifest, err := scraper.BuildManifest(os.Args[1], ".")
	if err != nil {
		fmt.Printf("ERROR: %s\n", err)
		os.Exit(1)
	}

//	fmt.Println(manifest)
	out := manifest.GetNearbySols(1000, 15, []string{os.Args[2]})
	for _, entry := range out {
		fmt.Println(entry)
	}
}
