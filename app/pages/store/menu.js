import { defineStore } from "pinia";
import { ref } from "vue";

export const useMenuStore = defineStore("menu", () => {
  //menu list
  const menuList = ref([]);

  //set menu list
  const setMenuList = (list) => {
    menuList.value = list;
  };

  //get menu list
  const getMenuList = () => {
    return menuList.value;
  };

  return {
    menuList,
    setMenuList,
    getMenuList,
  }
});
