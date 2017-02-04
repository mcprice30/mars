package main

import(
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"os"
)

func main() {
	if (len(os.Args) != 3) {
		fmt.Printf("Usage: %s <rover> <sol>\n", os.Args[0])
		os.Exit(1)	
	}
	rover := os.Args[1]
	sol := os.Args[2]

	baseUrl := "https://api.nasa.gov/mars-photos/api/v1/rovers"
	api_key := "mx2LmwatV6u7v6qgVXSilCK5kiieKLdca7TxK52p"

	resp, err := http.Get(fmt.Sprintf("%s/%s/photos?sol=%s&api_key=%s", baseUrl, rover, sol, api_key))

	if err != nil {
		fmt.Println(err)	
		os.Exit(1)
	}

	respBytes, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		fmt.Println(err)
		os.Exit(1)
	}

	jso := map[string]interface{}{}
	if err := json.Unmarshal(respBytes, &jso); err != nil {
		fmt.Println(err)
		os.Exit(1)
	}

	count := 0

	for k, v := range jso {
		if k == "photos" {
			photoArr, valid := v.([]interface{})
			if !valid {
				fmt.Println("F1")
				os.Exit(1)
			}


			for _, photo := range photoArr {

				photoMap, valid := photo.(map[string]interface{})

				if !valid {
					fmt.Println("F2")
					os.Exit(1)
				}

				for kk, vv := range photoMap {
					if kk == "img_src" {
						fmt.Println(vv)
						vvString, valid := vv.(string)
						if !valid {
							fmt.Println("F3")
							os.Exit(1)
						}
						img, err := http.Get(vvString)
						if err != nil {
							fmt.Println(err)
							os.Exit(1)
						}
						fn := fmt.Sprintf("%s/%s_%s_%d.jpg", "photos", rover, sol, count)
						count++
						img_data, err := ioutil.ReadAll(img.Body)
						if err != nil {
							fmt.Println(err)
							os.Exit(1)
						}

						ioutil.WriteFile(fn, img_data, 0644)
					}
				}
			}
		}

	}


}
