import { defineStore } from "pinia";
import { ref } from "vue";

export const useProjectStore = defineStore("project", () => {
  //project list
  const projectList = ref([]);

  //set project list
  const setProjectList = (list) => {
    projectList.value = list;
  };

  return {
    projectList,
    setProjectList
  }
});
