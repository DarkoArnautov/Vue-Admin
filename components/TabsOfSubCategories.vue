<template>
  <md-card class="md-card-tabs"
    :class="[
      { 'flex-column': flexColumn },
      { 'nav-pills-icons': navPillsIcons },
      { 'md-card-plain': plain }
    ]" style="margin-top: 0">
    <md-card-content style="padding-top: 0">
      <md-list class="nav-tabs">
        <md-list-item
          v-for="(item, index) in categories"
          @click="switchPanel(categories[index])"
          :key="index"
          :to="item.to"
          :class="[
            { active: isActivePanel(categories[index]) },
            { [getColorButton(colorButton)]: isActivePanel(categories[index]) }
          ]" >
          {{ categories[index].title }}
          <md-icon v-if="navPillsIcons" :class="categories[index].icon"></md-icon>
        </md-list-item>
      </md-list>

    </md-card-content>
  </md-card>
</template>

<script>
export default {
  props: {
    flexColumn: Boolean,
    navPillsIcons: Boolean,
    plain: Boolean,
    categories: Array,
    colorButton: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      activePanel: this.categories[0]
    };
  },
  methods: {
    switchPanel(panel) {
      this.activePanel = panel;
    },
    isActivePanel(panel) {
      return this.activePanel == panel;
    },
    getColorButton: function(colorButton) {
      return "md-" + colorButton + "";
    }
  }
};
</script>

<style lang="css"></style>
