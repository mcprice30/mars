package main

import (
	"flag"

	"github.com/mcprice30/mars"
	"github.com/jwowillo/trim/server"
)

// main runs a server on the provided host and port which serves
// mars.
func main() {
	s := server.New(host, port)
	s.SetHeader("Access-Control-Allow-Origin", "*")
	s.Serve(mars.New(host, port))
}

var (
	// host to run on.
	host string
	// port to run on.
	port int
)

// init parses command line flags.
func init() {
	flag.StringVar(&host, "host", "localhost", "host to run on")
	flag.IntVar(&port, "port", 5000, "port to run on")
	flag.Parse()
}
