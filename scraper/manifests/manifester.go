package main

import (
	"fmt"
	"os"

	"github.com/mcprice30/mars/scraper"
)

func main() {
	if len(os.Args) != 2 {
		fmt.Printf("Usage: %s <rover name>\n", os.Args[0])
		os.Exit(1)
	}
	manifest, err := scraper.BuildManifest(os.Args[1], ".")
	if err != nil {
		fmt.Printf("ERROR: %s\n", err)
		os.Exit(1)
	}

	//	fmt.Println(manifest)
	for _, entry := range manifest.ActiveSols {
		fmt.Println(manifest.Photos[entry])
	}
}
