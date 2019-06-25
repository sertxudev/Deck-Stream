<template>
  <div class="row p-2 group-row">
    <div class="col-12 border-bottom mb-2 pb-1 px-1 text-white" @contextmenu.prevent="openContextGroup($event)">{{ group.name }}</div>
    <Clips :gIndex="gIndex"/>
  </div>
</template>

<script>
import { ipcRenderer, remote } from "electron";
const { Menu, MenuItem, dialog } = remote;

import Clips from "./Clips";

export default {
  components: { Clips },
  props: ["group", "gIndex"],
  methods: {
    openContextGroup: function (event) {
    //   // console.log('openContextClip', event)
    //   let element = event.target.parentNode;
    //   if (!element.classList.contains("card")) element = element.parentNode
      let data = this.$store.state.data
    //   let groupID = element.id.split('clip-').pop().split('-').shift()
    //   let clipID = element.id.split('clip-').pop().split('-').pop()
      // console.log(this.group, data.activeDeck, this.gIndex)

      const menu = new Menu()
      menu.append(new MenuItem({
        label: "Edit Group...",
        click: () => {
          ipcRenderer.send("open-edit-group", { group: this.group, dIndex: data.activeDeck, gIndex: this.gIndex })
        }
      }))

      menu.append(new MenuItem({
        label: "Clear Group",
        click: () => {
          let action = dialog.showMessageBoxSync(remote.getCurrentWindow(), { type: "warning", title: "Clear group", message: `Are you sure you want to remove all the clips from the group named "${this.group.name}"?`, buttons: ["No", "Yes"], noLink: true })
          if (action == 0) return null
          data.decks[data.activeDeck].groups[this.gIndex].clips.splice(0, data.decks[data.activeDeck].groups[this.gIndex].clips.length)
          ipcRenderer.send('update-data', data)
        }
      }))

      menu.append(new MenuItem({
        label: "Remove Group",
        click: () => {
          let clip = data.decks[data.activeDeck].groups[this.gIndex]
          let action = dialog.showMessageBoxSync(remote.getCurrentWindow(), { type: "warning", title: "Remove clip", message: `Are you sure you want to remove the group named "${this.group.name}"?`, buttons: ["No", "Yes"], noLink: true })
          if (action == 0) return null
          data.decks[data.activeDeck].groups.splice(this.gIndex, 1)
          ipcRenderer.send('update-data', data)
        }
      }))

      menu.popup({ window: remote.getCurrentWindow() })
    }
  }
};
</script>
