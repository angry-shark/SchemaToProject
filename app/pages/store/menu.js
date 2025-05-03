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

  //find menu by key
  /**
   * 
   * @param {*} key 搜索字段
   * @param {*} value 搜索值
   * @param {*} mList 要搜索的菜单列表，默认为menuList，穿这个是因为 可以在递归中使用
   * @returns 
   */
  const findMenuItem = ({key, value}, mList = menuList.value) => {
    for (let i = 0; i < mList.length; i++) {
      const menuItem = mList[i];
      if(!menuItem) continue;

      if (menuItem[key] === value) {
        return menuItem;
      }
      if (menuItem.menuType == 'group' && menuItem.subMenu) {
        const mItem = findMenuItem({key, value}, menuItem.subMenu);
        if (mItem) {
          return mItem;
        }
      }else if(menuItem.menuType == 'sider' && menuItem.siderConfig && menuItem.siderConfig.menu) {
        const mItem = findMenuItem({key, value},  menuItem.siderConfig.menu);
        if (mItem) {
          return mItem;
        }
      }
    }
  };

  return {
    menuList,
    setMenuList,
    getMenuList,
    findMenuItem
  };
});
