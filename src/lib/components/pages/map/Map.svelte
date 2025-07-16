<script lang="ts">
    import 'leaflet/dist/leaflet.css';
    import L from "leaflet";
    import { onMount } from "svelte";

    let map: L.Map;

    onMount(function() {
       map = L.map('map');
       map.setView([50.0869250, 14.4207550], 13)
       L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(map);
    });
</script>

<style>
    #map {
        width: 1000px;
        height: 500px;
    }
</style>

<div id="map"></div>