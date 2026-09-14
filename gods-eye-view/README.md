# God's Eye View for Home Assistant

A Home Assistant app that runs [God's Eye View](https://github.com/bilawalsidhu/gods-eye-view) inside Home Assistant OS and exposes it through Home Assistant Ingress.

## What it provides

- Interactive 3D Earth
- Live aircraft
- Ships and vessels
- Satellites
- Earthquakes
- CCTV/public cameras
- Other geospatial awareness layers provided by the upstream project

## Architecture

The add-on downloads the upstream God's Eye View source at image-build time, runs it with Node.js 24, and places an Nginx Ingress proxy in front of it. The Vite application is kept on loopback inside the container; Home Assistant Ingress is the only exposed interface.

## Installation

Add this repository to Home Assistant under **Settings → Apps → App store → Repositories**:

`https://github.com/louisjferreira/ha-gods-eye-view`

Install **God's Eye View**, start it, then use **OPEN WEB UI**. The next phase is to create a dedicated dashboard card for it.

## Upstream

This project packages the MIT-licensed upstream application by Bilawal Sidhu:

https://github.com/bilawalsidhu/gods-eye-view
