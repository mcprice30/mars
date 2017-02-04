package mars

import (
	"fmt"
	"time"

	"github.com/jwowillo/trim"
	"github.com/jwowillo/trim/application"
	"github.com/mcprice30/mars/api"
)

// Application handles trim.Requests by presenting a client, api, and static.
type Application struct {
	*application.Web
}

// New Application which will be served from the given host and port.
func New(h string, p int) *Application {
	clientConf, apiConf, staticConf := configs(h, p)
	app := &Application{
		Web: application.NewWebWithConfig(
			clientConf,
			apiConf,
			staticConf,
		),
	}
	api.Configure(app.API())
	return app
}

// makeInjectPaths function which overrides trim.Applications in trim.Request
// context with their URLs.
func makeInjectPaths(h string, p int) func(*trim.Request) trim.AnyMap {
	return func(r *trim.Request) trim.AnyMap {
		m := trim.AnyMap{}
		client := r.Context("client").(*application.Client)
		api := r.Context("api").(*application.API)
		static := r.Context("static").(*application.Static)
		m["client"] = path(client.Application, r, h, p)
		m["api"] = path(api.Application, r, h, p)
		m["static"] = path(static.Application, r, h, p)
		if h != "localhost" {
			m["production"] = true
		}
		return m
	}
}

// path to a trim.Application based on the provided trim.Request, host, and
// port.
func path(app trim.Application, r *trim.Request, h string, p int) string {
	var proto string
	if r.TLS() != nil {
		proto = "https://"
	} else {
		proto = "http://"
	}
	if h == "localhost" || p != 80 {
		h += fmt.Sprintf(":%d", p)
	}
	return proto + app.URLFor(trim.Pattern{
		Subdomain: app.Subdomain(),
		Path:      app.BasePath(),
	}, h).String()
}

// configs to use for the Application based on the host and port the
// trim.Application will be served on.
func configs(h string, p int) (
	application.ClientConfig,
	application.APIConfig,
	application.StaticConfig,
) {
	clientConf := application.ClientDefault
	staticConf := application.StaticDefault
	clientConf.Args = makeInjectPaths(h, p)
	staticConf.Args = makeInjectPaths(h, p)
	if h != "localhost" {
		clientConf.CacheDuration = time.Hour
		staticConf.CacheDuration = time.Hour
	} else {
		clientConf.CacheDuration = 0
		staticConf.CacheDuration = 0
	}
	staticConf.Include = []string{".js", ".ts", ".html", ".css"}
	staticConf.Subdomain = ""
	staticConf.BasePath = "static"
	return clientConf, application.APIDefault, staticConf
}
