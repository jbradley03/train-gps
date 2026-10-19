# Train GPS logger (CS7NS4 Assignment 2)

A single web page (`index.html`) that logs GPS from a phone while on the DART and
saves it as a CSV. No server: points are stored on the phone until you download them.

## Setup

Phone browsers only allow GPS on HTTPS pages, so host `index.html` somewhere with
HTTPS, e.g. GitHub Pages: push this folder to a repo, then Settings -> Pages ->
deploy from the main branch. Open the `https://<user>.github.io/<repo>/` link on the phone.

## On the train

1. Enter the route, pick an interval (2 s is fine), tap **Start**, allow location.
2. Keep the page open and the screen on (the browser throttles GPS in the background).
3. Tap **Stop**, then **Download CSV**. Points from several trips pile up until you tap
   **Clear saved points**.

## CSV columns

`time` (UTC, ISO 8601), `route`, `lat`, `lon`, `accuracy_m`, `speed_mps`
(device-reported; blank if the phone doesn't provide it, so you'd work speed out
from consecutive positions instead).
