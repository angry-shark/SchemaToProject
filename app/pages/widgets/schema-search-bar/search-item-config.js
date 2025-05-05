import Input from "./complex-view/input/input.vue";
import Select from "./complex-view/select/select.vue";
import DynamicSelect from "./complex-view/dynamic-select/dynamic-select.vue";
import DateRange from "./complex-view/data-range/data-range.vue";

const SearchItemConfig = {
  input: {
    component: Input,
  },
  select: {
    component: Select,
  },
  dynamicSelect: {
    component: DynamicSelect,
  },
  dateRange: {
    component: DateRange,
  },
};

export default SearchItemConfig;
