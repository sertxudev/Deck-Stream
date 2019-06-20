<template>
  <div class="card border-0 ui-state-default" @contextmenu.prevent="openContextClip($event)">
    <template>
      <video
        :src="clip.path + '#t=' + clip.posterTime"
        class="card-img-top"
        preload="metadata"
        v-on:error="/*sourceError($event)*/"
        v-on:dblclick="setStream(getActiveDeckId, clip.path, clip.loop)"
        v-on:click="setPreload(getActiveDeckId, clip.path, clip.loop)"
        v-if="fileIsVideo(clip.path)"
      ></video>

      <img
        :src="clip.path"
        class="card-img-top"
        v-on:error="sourceError($event)"
        v-on:dblclick="setStream(getActiveDeckId, clip.path)"
        v-on:click="setPreload(getActiveDeckId, clip.path)"
        v-if="fileIsImage(clip.path)"
      >
    </template>

    <div class="align-items-center card-body d-flex justify-content-center p-0 text-white">
      <small class="mx-1 overflow-hidden">{{clip.name}}</small>
    </div>
  </div>
</template>

<script>
import { ipcRenderer, remote } from "electron";
const { Menu, MenuItem } = remote;

export default {
  props: ["clip", "cIndex", "gIndex"],
  computed: {
    getActiveDeckId() {
      let data = this.$store.state.data
      return data.decks[data.activeDeck].id;
    }
  },
  methods: {
    sourceError: function (event) {
      event.target.outerHTML = `
        <div style="height:65px;background: #262626;" class="align-items-center d-flex justify-content-center rounded-top">
          <small class="border border-danger rounded" style="padding: 1px 4px;color: #b3b3b3;">Replace</small>
        </div>`
    },
    setStream: function (id, url, loop = false) {
      url = url.split("#t=").shift();
      this.$store.commit("changeSource", { id, src: url, loop })
      // ipcRenderer.send("enable-stream", { deck, url });
      // this.$store.state.players[deck].src = url
      // this.$root.$refs[`video-${deck}`].src = url;
      // this.$root.$refs[`video-${deck}`].play();
      // clearTimes();
    },
    setPreload: function (id, url, loop = false) {
      url = url.split("#t=").shift();
      this.$store.commit("changePreviewSource", { id, src: url, loop })
      // ipcRenderer.send("set-preload", { deck, url });
    },
    fileIsVideo: function (filename) {
      return filename.split(".").pop().match(/(webm|ogg|mp4)$/i);
    },
    fileIsImage: function (filename) {
      return filename.split(".").pop().match(/(jpg|jpeg|png|gif)$/i);
    },
    openContextClip: function (event) {
      // console.log('openContextClip', event)
      let element = event.target.parentNode;
      if (!element.classList.contains("card")) element = element.parentNode

      const menu = new Menu();
      // const methods = require("../../context-menu/clips");
      // menu.append(new MenuItem({ label: 'Settings', click: () => methods.openSettings(element) }))
      // menu.append(new MenuItem({ label: event }));
      menu.append(
        new MenuItem({
          label: "Settings",
          click: () => ipcRenderer.send("clips-settings", event)
        })
      );
      // // menu.append(new MenuItem({ label: 'Settings', click: () => { console.log('Settings - Group ' + element.id.split('-')[1] + ' - Clip ' + element.id.split('-')[2]) } }))
      // // menu.append(new MenuItem({ label: 'Remove', click: () => { console.log('Remove - Group ' + element.id.split('-')[1] + ' - Clip ' + element.id.split('-')[2]) } }))

      menu.popup({ window: remote.getCurrentWindow() });
    }
  }
};
</script>

