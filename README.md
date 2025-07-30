<p align="center"><img src=".README_ASSETS/icon.svg" alt="FindMyBus icon" width="86"></p>

<h1 align="center">FindMyBus</h1>
<p align="center">
    FindMyBus is an open-source Android application that allows you to view public transport vehicles positions on a map in real time. <br>
    Built with <a href="https://svelte.dev/">Svelte</a>, <a href="https://konstaui.com/">KonstaUI</a> and <a href="https://capacitorjs.com/">Capacitor</a>.
</p>

# Features
- Visualize GTFS Realtime feeds on a map
- See live positions of vehicles and extra information about them, such as their timetables
- Light data usage

## Installation
- Download and install an `.apk` file from the [Releases](https://github.com/TriLinder/FindMyBus/releases/latest) page
- Alternatively, you can build the app from source (see below)

# Screenshots
<p align="center">
    [TODO: screenshots here]
</p>

# Building
Prerequisites: Android Studio and Node.js (v22)

1. Clone the repository
2. Run `npm install` in the directory to install project dependencies
3. Run `npm run dev` to debug the application in a web browser
    - While running in a web browser, it might be necessary to temporarily [disable CORS protection](https://addons.mozilla.org/en-US/firefox/addon/cors-everywhere/) for the application to be able to reach your transport agency's GTFS feeds. **Please make sure to enable it again as soon as possible afterwards.** As an alternative, download and host the GTFS files on a localhost webserver yourself.
4. Run `npm run build && npx cap sync && npx cap open android` to build the web files and open the application in Android studio
5. Build the application in Android Studio