<template>
  <div
    class="card border-0 ui-state-default"
    @contextmenu.prevent="openContextClip($event)"
    :id="id"
  >
    <template>
      <video
        :src="clip.path + '#t=' + clip.posterTime"
        class="card-img-top"
        preload="metadata"
        v-on:error="/*sourceError($event)*/"
        v-on:dblclick="setStream(getActiveDeckId, clip)"
        v-on:click="setPreload(getActiveDeckId, clip)"
        v-if="fileIsVideo(clip.path)"
      ></video>

      <img
        :src="clip.path"
        class="card-img-top"
        v-on:error="sourceError($event)"
        v-on:dblclick="setStream(getActiveDeckId, clip)"
        v-on:click="setPreload(getActiveDeckId, clip)"
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
const { Menu, MenuItem, dialog } = remote;

export default {
  props: ["id", "clip"],
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
    setStream: function (id, clip) {
      let url = clip.path.split("#t=").shift()
      this.$store.commit("changeSource", { id, src: url, ...clip })
      // ipcRenderer.send("enable-stream", { deck, url });
      // this.$store.state.players[deck].src = url
      // this.$root.$refs[`video-${deck}`].src = url;
      // this.$root.$refs[`video-${deck}`].play();
      // clearTimes();
    },
    setPreload: function (id, clip) {
      let url = clip.path.split("#t=").shift()
      this.$store.commit("changePreviewSource", { id, src: url, ...clip })
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
      let data = this.$store.state.data
      let groupID = element.id.split('clip-').pop().split('-').shift()
      let clipID = element.id.split('clip-').pop().split('-').pop()
      // console.log(element, data.decks[data.activeDeck].groups[groupID].clips[clipID])

      const menu = new Menu()
      menu.append(new MenuItem({
        label: "Edit Clip...",
        click: () => {
          let clip = data.decks[data.activeDeck].groups[groupID].clips[clipID]
          ipcRenderer.send("open-edit-clip", { clip: clip, dIndex: data.activeDeck, gIndex: groupID, cIndex: clipID })
        }
      }))

      menu.append(new MenuItem({
        label: "Remove Clip",
        click: () => {
          let clip = data.decks[data.activeDeck].groups[groupID].clips[clipID]
          let action = dialog.showMessageBoxSync(remote.getCurrentWindow(), { type: "warning", title: "Remove clip", message: `Are you sure you want to remove the clip named "${clip.name}"?`, buttons: ["No", "Yes"], noLink: true })
          if (action == 0) return null
          data.decks[data.activeDeck].groups[groupID].clips.splice(clipID, 1)
        }
      }))

      menu.popup({ window: remote.getCurrentWindow() })
    }
  }
};
</script>

